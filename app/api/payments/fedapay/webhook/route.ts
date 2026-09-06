import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";
import { getFedaPayTransactionStatus } from "@/services/fedapay";
import { Plan } from "@/lib/subscription";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    
    // Extraire l'objet transaction depuis le payload FedaPay Webhook
    const entity = body.entity || "transaction";
    const eventName = body.event || body.type || "";
    const txObject = body.object || body.transaction || body.v1?.transaction || body;

    const txId = txObject.id || body.id;
    const txStatus = txObject.status || (eventName.includes("approved") ? "approved" : "pending");

    if (!txId) {
      return NextResponse.json({ message: "Payload Webhook FedaPay sans ID de transaction." }, { status: 400 });
    }

    // 1. Vérification directe de sécurité auprès de l'API REST FedaPay
    const verifyResult = await getFedaPayTransactionStatus(txId);
    const finalStatus = verifyResult.success ? verifyResult.status : txStatus;

    if (finalStatus !== "approved" && finalStatus !== "transferred") {
      return NextResponse.json({
        received: true,
        processed: false,
        message: `Transaction ${txId} FedaPay non approuvée (Statut actuel : ${finalStatus}).`,
      });
    }

    const metadata = verifyResult.metadata || txObject.custom_metadata || {};
    const reference = metadata.reference || txObject.reference || `TX_FEDA_${txId}`;
    const userId = metadata.user_id;

    const supabase = await createClient();
    const nowIso = new Date().toISOString();

    // 2. Recherche de la transaction dans la table payments
    let { data: paymentRecord } = await supabase
      .from("payments")
      .select("*")
      .eq("provider_transaction_id", String(txId))
      .maybeSingle();

    if (!paymentRecord && reference) {
      const { data: refRecord } = await supabase
        .from("payments")
        .select("*")
        .eq("reference", reference)
        .maybeSingle();
      paymentRecord = refRecord;
    }

    const targetUserId = userId || paymentRecord?.user_id;

    if (!targetUserId) {
      console.warn(`Webhook FedaPay : Utilisateur introuvable pour la transaction ${txId}`);
      return NextResponse.json({ received: true, processed: false, message: "Utilisateur non identifié dans la transaction." });
    }

    // 3. Empêcher le traitement double (idempotence)
    if (paymentRecord?.status === "approved" || paymentRecord?.status === "completed" || paymentRecord?.status === "paid") {
      return NextResponse.json({ received: true, processed: true, message: "Transaction FedaPay déjà traitée et validée." });
    }

    const plan: Plan = (metadata.plan || paymentRecord?.plan || "pro") === "enterprise" ? "enterprise" : "pro";
    const expectedAmount = plan === "enterprise" ? 25000 : 2500;

    // Calcul de l'expiration exacte à 1 mois jour/heure/minute/seconde
    const startDate = new Date();
    const expiresDate = new Date(startDate);
    expiresDate.setMonth(expiresDate.getMonth() + 1);

    const startedAtIso = startDate.toISOString();
    const expiresAtIso = expiresDate.toISOString();

    // 4. Mettre à jour la table payments
    await supabase.from("payments").upsert(
      {
        user_id: targetUserId,
        plan,
        amount: expectedAmount,
        currency: "FCFA",
        reference: reference || `TX_FEDA_${txId}`,
        status: "approved",
        provider: "fedapay",
        provider_transaction_id: String(txId),
        updated_at: nowIso,
      },
      { onConflict: "reference" }
    );

    // 5. Activer le plan dans la table subscriptions avec started_at et expires_at
    await supabase.from("subscriptions").upsert(
      {
        user_id: targetUserId,
        plan,
        status: "active",
        amount: expectedAmount,
        currency: "FCFA",
        started_at: startedAtIso,
        expires_at: expiresAtIso,
        updated_at: nowIso,
      },
      { onConflict: "user_id" }
    );

    // 6. Mettre à jour users_profile et auth metadata
    try {
      await supabase.from("users_profile").upsert({
        id: targetUserId,
        updated_at: nowIso,
      });
    } catch (e) {
      // Ignorer si colonne absente
    }

    await supabase.auth.updateUser({
      data: { plan },
    });

    console.log(`Webhook FedaPay : Succès validation plan ${plan.toUpperCase()} pour l'utilisateur ${targetUserId}`);

    return NextResponse.json({
      received: true,
      processed: true,
      plan,
      user_id: targetUserId,
    });
  } catch (error: any) {
    console.error("Erreur serveur Webhook FedaPay:", error);
    return NextResponse.json({ error: "WEBHOOK_ERROR", message: error.message }, { status: 500 });
  }
}
