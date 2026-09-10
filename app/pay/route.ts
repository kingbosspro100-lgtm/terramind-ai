import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { plan } = await request.json(); // 'pro' ou 'enterprise'

    // Récupérer le domaine actuel (ex: https://votre-site.vercel.app)
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // L'URL vers laquelle le client sera redirigé après le paiement
    const returnUrl = `${origin}/welcome-pro`;

    /* 
      Ici, faites l'appel vers l'API Saspay.
      Remplacez cette partie par la requête API exacte de Saspay si vous avez une clé API.
    */
    const response = await fetch('https://api.saspay.com/v1/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SASPAY_SECRET_KEY}`, // Votre clé privée Saspay
      },
      body: JSON.stringify({
        plan: plan,
        success_url: returnUrl, // Saspay renverra l'utilisateur sur /welcome-pro
        cancel_url: `${origin}/pricing`,
      }),
    });

    const data = await response.json();

    // Rediriger le client vers l'URL de paiement générée par Saspay
    return NextResponse.json({ url: data.checkout_url });

  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de l'initialisation du paiement' }, { status: 500 });
  }
}
