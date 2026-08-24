"use client";
import Logo from "@/app/components/ui/Logo";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, Sparkles, AlertCircle, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg("Les mots de passe ne correspondent pas.");
      return;
    }
    if (password.length < 8) {
      setErrorMsg("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg(false);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;
      setSuccessMsg(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch (err: any) {
      setErrorMsg("Impossible de réinitialiser le mot de passe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0914] text-white flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
      <div className="p-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo width={36} height={36} />
          <span className="text-xl font-bold tracking-tight text-white">
            TerraMind <span className="text-emerald-400">AI</span>
          </span>
        </Link>
      </div>

      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10 rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3.5 py-1 text-[11px] font-semibold text-emerald-300">
              <Sparkles className="h-3 w-3 text-emerald-400" />
              <span>Sécurité du compte</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Nouveau mot de passe
            </h1>
            <p className="text-xs text-emerald-200/80 font-medium">
              Veuillez entrer votre nouveau mot de passe ci-dessous.
            </p>
          </div>

          {errorMsg && (
            <div className="rounded-2xl bg-red-950/60 border border-red-800/40 p-4 text-xs font-semibold text-red-300 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="rounded-2xl bg-emerald-950/60 border border-emerald-800/40 p-4 text-xs font-semibold text-emerald-300 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 shrink-0 text-emerald-400" />
              <span>Mot de passe mis à jour ! Redirection...</span>
            </div>
          )}

          {!successMsg && (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1.5">Nouveau mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-300/40" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl bg-[#0A100C] border border-emerald-900/30 pl-10 pr-4 py-3 text-sm text-white placeholder-emerald-300/30 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
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
                    className="w-full rounded-2xl bg-[#0A100C] border border-emerald-900/30 pl-10 pr-4 py-3 text-sm text-white placeholder-emerald-300/30 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-xs font-bold text-white shadow-xl shadow-emerald-600/30 hover:opacity-95 transition"
              >
                <span>{loading ? "Mise à jour..." : "Réinitialiser"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </main>

      <footer className="p-6 text-center text-xs text-emerald-300/50">
        © 2026 TerraMind AI. Tous droits réservés.
      </footer>
    </div>
  );
}
