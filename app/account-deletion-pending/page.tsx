"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, CalendarClock, RotateCcw } from "lucide-react";
import { createClient } from "@/lib/client";

export default function AccountDeletionPendingPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setAuthenticated(Boolean(data.user));
      setChecking(false);
    });
  }, []);

  async function cancelDeletion() {
    setCancelling(true);
    setError("");
    try {
      const response = await fetch("/api/user/delete", { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "L’annulation a échoué.");
      router.replace("/dashboard");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Impossible d’annuler la suppression.");
    } finally {
      setCancelling(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B0914] px-4 py-10 text-white">
      <section className="w-full max-w-lg rounded-2xl border border-amber-800/40 bg-[#15121b] p-6 shadow-2xl sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-700/40 bg-amber-950/40 text-amber-300">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-2xl font-bold">Suppression du compte programmée</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Votre compte est inaccessible pendant le délai de sécurité. Toutes vos données seront supprimées définitivement après 7 jours, sauf si vous annulez la demande avant cette échéance.
        </p>
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
          <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
          <p>Pour conserver votre compte, reconnectez-vous avec vos identifiants puis annulez la demande sur cette page.</p>
        </div>

        {error && <p role="alert" className="mt-4 rounded-lg border border-red-800 bg-red-950/40 p-3 text-sm text-red-200">{error}</p>}

        {!checking && authenticated ? (
          <button
            type="button"
            onClick={cancelDeletion}
            disabled={cancelling}
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
          >
            <RotateCcw className="h-4 w-4" />
            {cancelling ? "Annulation…" : "Annuler la suppression du compte"}
          </button>
        ) : !checking ? (
          <Link
            href="/login?callbackUrl=%2Faccount-deletion-pending"
            className="mt-6 flex min-h-11 items-center justify-center rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Me reconnecter pour annuler
          </Link>
        ) : (
          <p className="mt-6 text-sm text-slate-400">Vérification de la session…</p>
        )}
      </section>
    </main>
  );
}