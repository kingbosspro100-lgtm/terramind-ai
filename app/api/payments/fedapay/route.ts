import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helper";
import { createClient } from "@/lib/server";
import { createFedaPayTransaction } from "@/services/fedapay";

export async function POST(request: Request) {
  // 1. Récupérer l'utilisateur authentifié
  const user = await getCurrentUser();

  if (!user || !user.id) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentification requise pour souscrire un abonnement." },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const targetPlan = body.plan === "enterprise" ? "enterprise" : body.plan === "pro" ? "pro" : "free";

  if (targetPlan === "free") {
    return NextResponse.json({
      success: true,
      message: "L'offre FREE est gratuite. Aucun paiement FedaPay n'est requis.",
      plan: "free",
    });
  }

  // 2. Déterminer le montant strictement côté SERVEUR
  const amount = targetPlan === "enterprise" ? 25000 : 2500;
  const reference = `TX_FEDA_${targetPlan.toUpperCase()}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const description = `Abonnement TerraMind AI ${targetPlan.toUpperCase()} (${amount} FCFA/mois)`;

  const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "https://terramind.ai";
  const callbackUrl = `${origin}/checkout?reference=${reference}&plan=${targetPlan}`;

  try {
    const supabase = await createClient();
    const nowIso = new Date().toISOString();

    // 3. Créer la transaction FedaPay via l'API REST officielle FedaPay
    const fedapayRes = await createFedaPayTransaction({
      amount,
      description,
      customerEmail: user.email || undefined,
      customerFirstname: user.name?.split(" ")[0] || "Client",
      customerLastname: user.name?.split(" ").slice(1).join(" ") || "TerraMind",
      reference,
      callbackUrl,
      customMetadata: {
        user_id: user.id,
        plan: targetPlan,
        reference,
      },
    });

    if (!fedapayRes.success) {
      return NextResponse.json(
        { error: "FEDAPAY_ERROR", message: fedapayRes.message || "Échec de création de transaction FedaPay." },
        { status: 500 }
      );
    }

    // 4. Conserver la transaction dans la table payments avec le statut pending
    await supabase.from("payments").upsert(
      {
        user_id: user.id,
        plan: targetPlan,
        amount,
        currency: "FCFA",
        reference,
        status: "pending",
        provider: "fedapay",
        provider_transaction_id: fedapayRes.transactionId ? String(fedapayRes.transactionId) : null,
        updated_at: nowIso,
      },
      { onConflict: "reference" }
    );

    return NextResponse.json({
      success: true,
      reference,
      amount,
      plan: targetPlan,
      transactionId: fedapayRes.transactionId,
      redirectUrl: fedapayRes.redirectUrl || callbackUrl,
    });
  } catch (error: any) {
    console.error("Erreur création paiement FedaPay:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Une erreur est survenue lors de l'initialisation du paiement FedaPay." },
      { status: 500 }
    );
  }
}
