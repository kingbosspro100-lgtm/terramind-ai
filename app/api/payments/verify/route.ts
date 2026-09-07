import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helper";
import { createClient } from "@/lib/server";
import { getSasPayTransactionStatus } from "@/services/saspay";
import { Plan } from "@/lib/subscription";

export async function POST(request: Request) {
  // 1. Authentification requise
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
      { error: "BAD_REQUEST", message: "Référence de paiement SASPAY manquante." },
      { status: 400 }
    );
  }

  try {
    const supabase = await createClient();

    // 2. Rechercher l'enregistrement dans la table payments
    let { data: paymentRecord } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", user.id)
      .or(reference ? `reference.eq.${reference}` : `provider_transaction_id.eq.${providerTxId}`)
      .maybeSingle();

    const targetTxRef = providerTxId || reference || paymentRecord?.reference;
    const plan: Plan = (body.plan || paymentRecord?.plan || "pro") === "enterprise" ? "enterprise" : "pro";
    const expectedAmount = plan === "enterprise" ? 25000 : 2500;

    // 3. Interroger obligatoirement l'API officielle SASPAY pour vérifier le statut réel
    // Ne simule jamais la réussite. Ne donne pas PRO/ENTREPRISE sans vraie confirmation SASPAY.
    const saspayCheck = await getSasPayTransactionStatus(targetTxRef);

    const isAlreadyApprovedInDb =
      paymentRecord?.status === "approved" ||
      paymentRecord?.status === "completed" ||
      paymentRecord?.status === "paid";

    const isApprovedBySasPay = saspayCheck.success && saspayCheck.status === "approved";

    if (!isApprovedBySasPay && !isAlreadyApprovedInDb) {
      if (saspayCheck.requiresManualConfig) {
        return NextResponse.json(
          {
            error: "SASPAY_CONFIG_REQUIRED",
            message: "Module SASPAY non configuré. Veuillez renseigner SASPAY_SECRET_KEY dans .env.local pour activer la vérification des paiements réels.",
            status: "pending",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error: "PAYMENT_NOT_CONFIRMED",
          message: "Le paiement SASPAY n'a pas encore été confirmé. L'abonnement n'a pas été activé.",
          status: paymentRecord?.status || "pending",
        },
        { status: 400 }
      );
    }

    // 4. Calcul de l'expiration exacte : 1 mois après la date/heure réelle de confirmation du paiement
    const startDate = new Date();
    const expiresDate = new Date(startDate);
    expiresDate.setMonth(expiresDate.getMonth() + 1);

    const startedAtIso = startDate.toISOString();
    const expiresAtIso = expiresDate.toISOString();
    const nowIso = startDate.toISOString();

    // 5. Mettre à jour la transaction dans payments
    await supabase.from("payments").upsert(
      {
        user_id: user.id,
        plan,
        amount: expectedAmount,
        currency: "FCFA",
        reference: reference || paymentRecord?.reference || `TX_SASPAY_${Date.now()}`,
        status: "approved",
        provider: "saspay",
        provider_transaction_id: targetTxRef ? String(targetTxRef) : null,
        updated_at: nowIso,
      },
      { onConflict: "reference" }
    );

    // 6. Activer le plan dans subscriptions avec started_at et expires_at
    await supabase.from("subscriptions").upsert(
      {
        user_id: user.id,
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

    // 7. Synchroniser la session et le profil
    try {
      await supabase.from("users_profile").upsert({
        id: user.id,
        updated_at: nowIso,
      });
    } catch (e) {
      // Ignorer
    }

    await supabase.auth.updateUser({
      data: { plan },
    });

    return NextResponse.json({
      success: true,
      message: `Paiement SASPAY confirmé ! Abonnement TerraMind ${plan.toUpperCase()} activé.`,
      plan,
      amount: expectedAmount,
      reference,
      expires_at: expiresAtIso,
      status: "approved",
    });
  } catch (error: any) {
    console.error("Erreur serveur vérification paiement SASPAY:", error);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Une erreur est survenue lors de la vérification du paiement." },
      { status: 500 }
    );
  }
}
