import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helper";
import { createClient } from "@/lib/server";
import { getFedaPayTransactionStatus } from "@/services/fedapay";
import { Plan } from "@/lib/subscription";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user || !user.id) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentification requise pour valider un paiement." },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const reference = body.reference;
  const providerTxId = body.transactionId || body.tx_id;

  if (!reference && !providerTxId) {
    return NextResponse.json(
      { error: "BAD_REQUEST", message: "Référence ou identifiant de transaction manquant." },
      { status: 400 }
    );
  }

  try {
    const supabase = await createClient();

    // 1. Interroger la table payments
    let { data: paymentRecord } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", user.id)
      .or(reference ? `reference.eq.${reference}` : `provider_transaction_id.eq.${providerTxId}`)
      .maybeSingle();

    const plan: Plan = (body.plan || paymentRecord?.plan || "pro") === "enterprise" ? "enterprise" : "pro";
    const expectedAmount = plan === "enterprise" ? 25000 : 2500;
    const targetTxId = providerTxId || paymentRecord?.provider_transaction_id;

    // 2. Si un identifiant FedaPay existe, interroger l'API REST officielle FedaPay
    let fedaApproved = false;
    if (targetTxId) {
      const fedaCheck = await getFedaPayTransactionStatus(targetTxId);
      if (fedaCheck.success && (fedaCheck.status === "approved" || fedaCheck.status === "transferred")) {
        fedaApproved = true;
      }
    }

    // Accepter la validation uniquement si approuvé par FedaPay ou déjà validé en base
    const isApproved = fedaApproved || paymentRecord?.status === "approved" || paymentRecord?.status === "completed" || paymentRecord?.status === "paid";

    if (!isApproved) {
      return NextResponse.json(
        {
          error: "PAYMENT_NOT_APPROVED",
          message: "Le paiement FedaPay est en attente ou n'a pas encore été validé.",
          status: paymentRecord?.status || "pending",
        },
        { status: 400 }
      );
    }

    const nowIso = new Date().toISOString();

    // 3. Marquer le paiement comme approved dans payments
    await supabase.from("payments").upsert(
      {
        user_id: user.id,
        plan,
        amount: expectedAmount,
        currency: "FCFA",
        reference: reference || paymentRecord?.reference || `TX_FEDA_${Date.now()}`,
        status: "approved",
        provider: "fedapay",
        provider_transaction_id: targetTxId ? String(targetTxId) : null,
        updated_at: nowIso,
      },
      { onConflict: "reference" }
    );

    // 4. Activer le plan dans subscriptions
    await supabase.from("subscriptions").upsert(
      {
        user_id: user.id,
        plan,
        status: "active",
        amount: expectedAmount,
        currency: "FCFA",
        updated_at: nowIso,
      },
      { onConflict: "user_id" }
    );

    // 5. Mettre à jour users_profile et métadonnées auth
    try {
      await supabase.from("users_profile").upsert({
        id: user.id,
        updated_at: nowIso,
      });
    } catch (e) {
      // Ignorer si colonne absente
    }

    await supabase.auth.updateUser({
      data: { plan },
    });

    return NextResponse.json({
      success: true,
      message: `Abonnement TerraMind ${plan.toUpperCase()} activé avec succès !`,
      plan,
      amount: expectedAmount,
      reference,
      status: "approved",
    });
  } catch (error: any) {
    console.error("Erreur vérification paiement FedaPay:", error);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Une erreur est survenue lors de la vérification du paiement." },
      { status: 500 }
    );
  }
}
