import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helper";
import { createClient } from "@/lib/server";
import { createSasPayTransaction } from "@/services/saspay";

export async function POST(request: Request) {
  // 1. Authentification requise
  const user = await getCurrentUser();

  if (!user || !user.id) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Vous devez être connecté pour souscrire un abonnement." },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const targetPlan = body.plan === "enterprise" ? "enterprise" : body.plan === "pro" ? "pro" : "free";

  if (targetPlan === "free") {
    return NextResponse.json({
      success: true,
      message: "L'offre FREE est gratuite. Aucun paiement SASPAY n'est requis.",
      plan: "free",
    });
  }

  const supabase = await createClient();

  // 2. Vérifier si un abonnement actif existe déjà pour ce plan
  try {
    const { data: existingSub } = await supabase
      .from("subscriptions")
      .select("plan, status, expires_at")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingSub && existingSub.status === "active" && existingSub.plan === targetPlan) {
      const isNotExpired = !existingSub.expires_at || new Date(existingSub.expires_at) > new Date();
      if (isNotExpired) {
        return NextResponse.json(
          {
            error: "ALREADY_SUBSCRIBED",
            message: `Vous disposez déjà d'un abonnement actif pour la formule ${targetPlan.toUpperCase()}.`,
          },
          { status: 400 }
        );
      }
    }
  } catch (e) {
    console.warn("Sub check notice:", e);
  }

  // 3. Montant calculé strictement CÔTÉ SERVEUR (Jamais depuis le frontend)
  const amount = targetPlan === "enterprise" ? 25000 : 2500;
  const reference = `TX_SASPAY_${targetPlan.toUpperCase()}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const description = `Abonnement TerraMind AI ${targetPlan.toUpperCase()} (${amount} FCFA/mois)`;

  const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "https://terramind.ai";
  const callbackUrl = `${origin}/checkout?reference=${reference}&plan=${targetPlan}`;

  try {
    const nowIso = new Date().toISOString();

    // 4. Initialiser la transaction auprès de SASPAY
    const saspayRes = await createSasPayTransaction({
      amount,
      description,
      reference,
      plan: targetPlan,
      customerEmail: user.email || undefined,
      customerName: user.name || "Utilisateur TerraMind",
      callbackUrl,
    });

    // Enregistrer l'intention de paiement dans la table payments avec le statut pending
    await supabase.from("payments").upsert(
      {
        user_id: user.id,
        plan: targetPlan,
        amount,
        currency: "FCFA",
        reference,
        status: "pending",
        provider: "saspay",
        provider_transaction_id: saspayRes.transactionId || null,
        updated_at: nowIso,
      },
      { onConflict: "reference" }
    );

    if (saspayRes.requiresManualConfig) {
      return NextResponse.json(
        {
          success: false,
          error: "SASPAY_CONFIG_REQUIRED",
          message: saspayRes.message || "Le module de paiement SASPAY nécessite la configuration des clés secrètes dans les variables d'environnement du serveur.",
          reference,
          amount,
          plan: targetPlan,
          redirectUrl: callbackUrl,
        },
        { status: 503 }
      );
    }

    if (!saspayRes.success) {
      return NextResponse.json(
        {
          error: "SASPAY_ERROR",
          message: saspayRes.message || "Échec d'initialisation du paiement SASPAY.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reference,
      amount,
      plan: targetPlan,
      transactionId: saspayRes.transactionId,
      redirectUrl: saspayRes.redirectUrl || callbackUrl,
    });
  } catch (error: any) {
    console.error("Erreur serveur création paiement SASPAY:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Une erreur est survenue lors de l'initialisation du paiement SASPAY." },
      { status: 500 }
    );
  }
}
