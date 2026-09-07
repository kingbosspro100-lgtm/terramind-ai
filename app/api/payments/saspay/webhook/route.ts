import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";
import { getSasPayTransactionStatus } from "@/services/saspay";
import { Plan } from "@/lib/subscription";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    
    const txId = body.transaction_id || body.id || body.reference;
    const txReference = body.reference || body.tx_ref;

    if (!txId && !txReference) {
      return NextResponse.json({ message: "Payload Webhook SASPAY sans identifiant de transaction." }, { status: 400 });
    }

    const targetRef = txId || txReference;

    // 1. Vérifier le statut RÉEL directement auprès de l'API serveur SASPAY
    const verifyResult = await getSasPayTransactionStatus(targetRef);

    if (!verifyResult.success || verifyResult.status !== "approved") {
      return NextResponse.json({
        received: true,
        processed: false,
        message: `Transaction ${targetRef} SASPAY non confirmée (Statut : ${verifyResult.status}).`,
      });
    }

    const supabase = await createClient();
    const now = new Date();
    const nowIso = now.toISOString();

    // 2. Rechercher la transaction correspondant en base de données
    let { data: paymentRecord } = await supabase
      .from("payments")
      .select("*")
      .or(`reference.eq.${targetRef},provider_transaction_id.eq.${targetRef}`)
      .maybeSingle();

    if (!paymentRecord) {
      console.warn(`Webhook SASPAY : Transaction ${targetRef} introuvable en base.`);
      return NextResponse.json({ received: true, processed: false, message: "Transaction introuvable en base." });
    }

    const targetUserId = paymentRecord.user_id;

    // 3. Idempotence : Ne pas traiter deux fois une transaction déjà approuvée
    if (paymentRecord.status === "approved" || paymentRecord.status === "completed" || paymentRecord.status === "paid") {
      return NextResponse.json({ received: true, processed: true, message: "Transaction SASPAY déjà validée au préalable." });
    }

    const plan: Plan = paymentRecord.plan === "enterprise" ? "enterprise" : "pro";
    const expectedAmount = plan === "enterprise" ? 25000 : 2500;

    // Expiration exacte : Exactement 1 mois après la date/heure réelle du paiement confirmé
    const startedAt = now;
    const expiresAt = new Date(startedAt);
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    const startedAtIso = startedAt.toISOString();
    const expiresAtIso = expiresAt.toISOString();

    // 4. Mettre à jour la transaction dans payments
    await supabase.from("payments").upsert(
      {
        user_id: targetUserId,
        plan,
        amount: expectedAmount,
        currency: "FCFA",
        reference: paymentRecord.reference,
        status: "approved",
        provider: "saspay",
        provider_transaction_id: String(targetRef),
        updated_at: nowIso,
      },
      { onConflict: "reference" }
    );

    // 5. Activer l'abonnement dans subscriptions avecstarted_at et expires_at
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

    // 6. Synchroniser les métadonnées
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

    console.log(`Webhook SASPAY : Succès activation plan ${plan.toUpperCase()} pour l'utilisateur ${targetUserId}`);

    return NextResponse.json({
      received: true,
      processed: true,
      plan,
      user_id: targetUserId,
      expires_at: expiresAtIso,
    });
  } catch (error: any) {
    console.error("Erreur serveur Webhook SASPAY:", error);
    return NextResponse.json({ error: "WEBHOOK_ERROR", message: error.message }, { status: 500 });
  }
}
