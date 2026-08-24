import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helper";
import { createClient } from "@/lib/server";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user || !user.id) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentification requise pour initier un paiement." },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const targetPlan = body.plan === "enterprise" ? "enterprise" : body.plan === "pro" ? "pro" : "free";

  if (targetPlan === "free") {
    return NextResponse.json({
      success: true,
      message: "L'offre FREE est gratuite. Aucun paiement requis.",
      plan: "free",
    });
  }

  const amount = targetPlan === "enterprise" ? 25000 : 2500;
  const reference = `TX_${targetPlan.toUpperCase()}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const paymentMethod = body.paymentMethod || "mobile_money";

  try {
    const supabase = await createClient();
    const nowIso = new Date().toISOString();

    // Insérer la transaction en attente dans la table payments
    const { error: insertErr } = await supabase.from("payments").insert([
      {
        user_id: user.id,
        plan: targetPlan,
        amount,
        currency: "FCFA",
        reference,
        status: "pending",
        payment_method: paymentMethod,
        created_at: nowIso,
        updated_at: nowIso,
      },
    ]);

    if (insertErr) {
      console.error("Erreur insertion paiement:", insertErr);
    }

    return NextResponse.json({
      success: true,
      reference,
      amount,
      plan: targetPlan,
      paymentMethod,
      checkoutUrl: `/checkout?reference=${reference}&plan=${targetPlan}&amount=${amount}`,
    });
  } catch (error: any) {
    console.error("Erreur serveur création paiement:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Impossible de créer l'intention de paiement." },
      { status: 500 }
    );
  }
}
