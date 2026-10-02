"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erreur dans la section admin:", error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-slate-950 px-5 text-white">
      <section className="w-full max-w-lg rounded-2xl border border-red-800/40 bg-slate-900 p-7">
        <h1 className="text-xl font-bold">La page d’administration n’a pas pu charger</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Une erreur temporaire a interrompu cette page. Réessaie ou retourne au tableau de bord.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            Réessayer
          </button>
          <Link
            href="/dashboard"
            className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/5"
          >
            Retour au dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}