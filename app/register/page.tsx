"use client";
import Logo from "@/app/components/ui/Logo";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { signIn } from "next-auth/react";
import { createClient } from "@/lib/client";

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get("plan") || "free";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const supabase = createClient();

  // Password strength logic
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "", color: "bg-gray-700" };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { score: 33, label: "Faible", color: "bg-red-500" };
    if (score <= 4) return { score: 66, label: "Moyen", color: "bg-yellow-500" };
    return { score: 100, label: "Très Fort", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength(password);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Le mot de passe doit contenir au moins 8 caractères.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            plan: selectedPlan,
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm?next=/welcome`,
        },
      });

      if (error) {
        setErrorMsg(error.message || "Erreur lors de la création du compte.");
      } else {
        if (selectedPlan === "pro" || selectedPlan === "enterprise") {
          const checkoutUrl = `/checkout?plan=${selectedPlan}`;
          router.push(`/login?plan=${selectedPlan}&callbackUrl=${encodeURIComponent(checkoutUrl)}`);
        } else {
          router.push("/");
        }
      }
    } catch (err: any) {
      setErrorMsg("Une erreur réseau est survenue.");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    setSocialLoading(provider);
    setErrorMsg("");
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const targetNext = selectedPlan === "pro" || selectedPlan === "enterprise" ? `/checkout?plan=${selectedPlan}` : "/dashboard";

      // 1. Try Supabase OAuth redirect first
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(targetNext)}`,
        },
      });

      if (error) {
        console.warn("Supabase OAuth notice:", error.message, "- trying NextAuth fallback");
        await signIn(provider, {
          redirectTo: targetNext,
        });
      }
    } catch (err: any) {
      console.warn("OAuth redirecting via NextAuth...", err);
      try {
        const targetNext = selectedPlan === "pro" || selectedPlan === "enterprise" ? `/checkout?plan=${selectedPlan}` : "/dashboard";
        await signIn(provider, {
          redirectTo: targetNext,
        });
      } catch (nextAuthErr: any) {
        setErrorMsg(`Inscription avec ${provider} non disponible.`);
        console.error("OAuth error:", nextAuthErr);
        setSocialLoading(null);
      }
    }
  };

  const loginTargetUrl =
    selectedPlan === "pro" || selectedPlan === "enterprise"
      ? `/login?plan=${selectedPlan}&callbackUrl=${encodeURIComponent(`/checkout?plan=${selectedPlan}`)}`
      : "/login";

  return (
    <div className="min-h-screen bg-[#0B0914] text-white flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
      {/* Top Bar Link */}
      <div className="p-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo width={36} height={36} />
          <span className="text-xl font-bold tracking-tight text-white">
            TerraMind <span className="text-emerald-400">AI</span>
          </span>
        </Link>

        <Link
          href={loginTargetUrl}
          className="text-xs font-bold text-emerald-300 hover:text-white transition px-4 py-2 rounded-full border border-emerald-800/40 bg-[#0A100C]"
        >
          Déjà un compte ? Se connecter
        </Link>
      </div>

      {/* Form Container */}
      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden py-8">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10 rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3.5 py-1 text-[11px] font-semibold text-emerald-300">
              <Sparkles className="h-3 w-3 text-emerald-400" />
              <span>Formule : {selectedPlan.toUpperCase()}</span>
              <Link href="/pricing" className="text-[10px] underline text-emerald-400 ml-1 hover:text-white">
                (Changer)
              </Link>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Rejoignez TerraMind AI
            </h1>
            <p className="text-xs text-emerald-200/80 font-medium">
              Pilotez vos exploitations avec l'intelligence artificielle.
            </p>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="rounded-2xl bg-red-950/60 border border-red-800/40 p-4 text-xs font-semibold text-red-300 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Social OAuth Buttons */}
          <button
            type="button"
            disabled={socialLoading === "google"}
            onClick={() => handleSocialLogin("google")}
            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-[#0A100C] border border-emerald-900/30 py-3 text-xs font-bold text-white hover:bg-[#1C183B] transition disabled:opacity-50 disabled:cursor-not-allowed"
            title="Google"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
            </svg>
            <span>S'inscrire avec Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-emerald-900/30"></div>
            </div>
            <span className="relative bg-[#151130] px-4 text-[10px] uppercase tracking-wider font-bold text-emerald-300/60">
              Ou par Formulaire
            </span>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1.5">Nom Complet</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-300/40" />
                <input
                  type="text"
                  required
                  placeholder="Jean Dupont"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-2xl bg-[#0A100C] border border-emerald-900/30 pl-10 pr-4 py-3 text-sm text-white placeholder-emerald-300/30 outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1.5">Adresse Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-300/40" />
                <input
                  type="email"
                  required
                  placeholder="jean.dupont@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl bg-[#0A100C] border border-emerald-900/30 pl-10 pr-4 py-3 text-sm text-white placeholder-emerald-300/30 outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1.5">Mot de passe</label>
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

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="h-1.5 w-full bg-[#0A100C] rounded-full overflow-hidden">
                    <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: `${strength.score}%` }}></div>
                  </div>
                  <p className="text-[10px] font-semibold text-emerald-300 text-right">
                    Force : <span className="text-white">{strength.label}</span>
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1.5">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-300/40" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-2xl bg-[#0A100C] border border-emerald-900/30 pl-10 pr-4 py-3 text-sm text-white placeholder-emerald-300/30 outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || socialLoading !== null}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-xs font-bold text-white shadow-xl shadow-emerald-600/30 hover:opacity-95 transition mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? "Création en cours..." : "Créer mon compte"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="text-center text-xs text-emerald-200/80 font-medium">
            Déjà inscrit ?{" "}
            <Link href={loginTargetUrl} className="font-bold text-emerald-400 hover:text-white transition">
              Se connecter
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-emerald-300/50">
        © 2026 TerraMind AI. Tous droits réservés.
      </footer>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#0B0914] text-emerald-400 font-bold">Chargement...</div>}>
      <RegisterFormContent />
    </Suspense>
  );
}
