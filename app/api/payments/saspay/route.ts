import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Traitement du webhook Saspay / confirmation de paiement
    console.log("Saspay Payment Webhook received:", body);

    return NextResponse.json({ success: true, message: "Payment processed successfully" });
  } catch (error) {
    console.error("Error processing Saspay payment:", error);
    return NextResponse.json(
      { success: false, error: "Invalid payment payload" },
      { status: 400 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const plan = searchParams.get("plan") || "pro";

  const PLAN_PAYMENT_URLS: Record<string, string> = {
    pro: "https://link.saspay.me/il0qjbz-ano?amount=2500&plan=pro",
    enterprise: "https://link.saspay.me/vactjwnktn8?amount=25000&plan=enterprise",
  };

  const redirectUrl = PLAN_PAYMENT_URLS[plan] || PLAN_PAYMENT_URLS.pro;
  return NextResponse.redirect(redirectUrl);
}
