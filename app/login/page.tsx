"use client";

import Logo from "@/app/components/ui/Logo";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { signIn } from "next-auth/react";
import { createClient } from "@/lib/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || searchParams.get("next") || "/dashboard";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const supabase = createClient();

  useEffect(() => {
    if (urlError) {
      if (urlError === "auth_callback_failed") {
        setErrorMsg("Échec de la validation de la connexion Google. Veuillez réessayer.");
      } else {
        setErrorMsg("Une erreur d'authentification s'est produite.");
      }
    }
  }, [urlError]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message || "Identifiants incorrects. Veuillez réessayer.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg("Une erreur réseau est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setSocialLoading("google");
    setErrorMsg("");
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(callbackUrl)}`,
        },
      });

      if (error) {
        await signIn("google", { redirectTo: callbackUrl });
      }
    } catch (err: any) {
      try {
        await signIn("google", { redirectTo: callbackUrl });
      } catch (nextAuthErr: any) {
        setErrorMsg("Connexion avec Google non disponible.");
        setSocialLoading(null);
      }
    }
  };

  return (
    <div className="w-full max-w-md relative z-10 rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-8 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3.5 py-1 text-[11px] font-semibold text-emerald-300">
          <Sparkles className="h-3 w-3 text-emerald-400" />
          <span>Accès Sécurisé TerraMind AI</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Bon retour parmi nous
        </h1>
        <p className="text-xs text-emerald-200/80 font-medium">
          Connectez-vous avec votre adresse Email ou votre compte Google.
        </p>
      </div>

      {/* Feedback Alerts */}
      {errorMsg && (
        <div className="rounded-2xl bg-red-950/60 border border-red-800/40 p-4 text-xs font-semibold text-red-300 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="rounded-2xl bg-emerald-950/60 border border-emerald-800/40 p-4 text-xs font-semibold text-emerald-300 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Google OAuth Button */}
      <button
        type="button"
        disabled={socialLoading === "google"}
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 rounded-2xl bg-[#0A100C] border border-emerald-900/40 py-3.5 text-xs font-bold text-white hover:bg-[#1C183B] hover:border-emerald-500/40 transition shadow-sm disabled:opacity-50"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
          <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
          <path fill="#FBBC05" d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
          <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
        </svg>
        <span>{socialLoading === "google" ? "Connexion..." : "Continuer avec Google"}</span>
      </button>

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-emerald-900/30"></div>
        </div>
        <span className="relative bg-[#151130] px-4 text-[10px] uppercase tracking-wider font-bold text-emerald-300/60">
          Ou par Email
        </span>
      </div>

      {/* Connexion par Email */}
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-emerald-200 mb-1.5">Adresse Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-300/40" />
            <input
              type="email"
              required
              placeholder="nom@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl bg-[#0A100C] border border-emerald-900/30 pl-10 pr-4 py-3 text-sm text-white placeholder-emerald-300/30 outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-emerald-200">Mot de passe</label>
            <Link href="/forgot-password" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition">
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-300/40" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl bg-[#0A100C] border border-emerald-900/30 pl-10 pr-4 py-3 text-sm text-white placeholder-emerald-300/30 outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-xs font-bold text-white shadow-xl shadow-emerald-600/30 hover:opacity-95 transition disabled:opacity-50"
        >
          <span>{loading ? "Connexion..." : "Se connecter"}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <p className="text-center text-xs text-emerald-200/80 font-medium">
        Pas encore de compte ?{" "}
        <Link href="/pricing" className="font-bold text-emerald-400 hover:text-white transition">
          Créer un compte gratuit
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0B0914] text-white flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
      {/* Top Bar Link */}
      <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <Link href="/" className="flex items-center gap-2">
          <Logo width={36} height={36} />
          <span className="text-xl font-bold tracking-tight text-white">
            TerraMind <span className="text-emerald-400">AI</span>
          </span>
        </Link>

        <Link
          href="/pricing"
          className="text-xs font-bold text-emerald-300 hover:text-white transition px-3.5 py-1.5 rounded-full border border-emerald-800/40 bg-[#0A100C] shrink-0"
        >
          Créer un compte
        </Link>
      </div>

      {/* Main Login Form Container with Suspense boundary */}
      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center p-12 text-emerald-400">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p className="text-xs font-semibold">Chargement du formulaire...</p>
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-emerald-300/50">
        © 2026 TerraMind AI. Tous droits réservés.
      </footer>
    </div>
  );
}
