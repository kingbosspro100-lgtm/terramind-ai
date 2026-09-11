import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { plan } = await request.json(); // 'pro' ou 'enterprise'

    // 1. Détection automatique de l'URL du domaine (fonctionne en local & sur Vercel)
    const origin =
      request.headers.get('origin') ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      'http://localhost:3000';

    // 2. URL de retour post-paiement vers votre page d'activation
    const redirectUrlAfterPayment = `${origin}/welcome-pro`;

    // 3. Choix du montant en fonction de l'offre
    const amount = plan === 'pro' ? 2500 : plan === 'enterprise' ? 25000 : 0;

    /*
      4. Appel vers l'API Saspay.
      Saspay accepte le champ de redirection (souvent nommé success_url, return_url ou redirect_url dans leur documentation API).
    */
    const saspayResponse = await fetch('https://api.saspay.com/v1/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SASPAY_SECRET_KEY}`,
      },
      body: JSON.stringify({
        amount: amount,
        currency: 'XOF',
        description: `Abonnement TerraMind AI - Offre ${plan.toUpperCase()}`,
        success_url: redirectUrlAfterPayment,
        cancel_url: `${origin}/pricing`,
      }),
    });

    if (!saspayResponse.ok) {
      throw new Error(`Erreur HTTP Saspay: ${saspayResponse.status}`);
    }

    const data = await saspayResponse.json();

    // 5. Renvoie le lien du guichet de paiement Saspay
    return NextResponse.json({ redirectUrl: data.checkout_url || data.url });
  } catch (error) {
    console.error('Erreur API Saspay:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la préparation du paiement' },
      { status: 500 }
    );
  }
}
