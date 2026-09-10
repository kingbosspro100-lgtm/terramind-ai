'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

function WelcomeProContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialisation du client Supabase avec les variables d'environnement Vercel
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const emailParam = searchParams.get('email') || '';
  const [email, setEmail] = useState(emailParam);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Connexion Google (1 Clic)
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Définition d'un mot de passe manuel
  const handlePasswordSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-4">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl text-center">
        <div className="w-16 h-16 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          ✓
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Paiement Réussi !</h1>
        <p className="text-gray-400 text-sm mb-6">
          Votre abonnement a été validé pour <strong className="text-white">{email || 'votre compte'}</strong>.
          Finalisez l'activation de votre compte TerraMind AI ci-dessous.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Option A: Connexion Google */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition mb-6 shadow-md cursor-pointer disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          {loading ? 'Activation en cours...' : 'Activer avec Google (1-Clic)'}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gray-900 px-3 text-gray-500">Ou définir un mot de passe</span>
          </div>
        </div>

        {/* Option B: Mot de Passe Manuel */}
        <form onSubmit={handlePasswordSignUp} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Votre Adresse Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="votre.email@gmail.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Choisissez un mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg text-sm transition cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : 'Créer mon mot de passe'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function WelcomeProPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Chargement...</div>}>
      <WelcomeProContent />
    </Suspense>
  );
      }
