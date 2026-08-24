"use client";

import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";

type Props = {
  feature: string;
};

export default function UpgradePrompt({ feature }: Props) {
  return (
    <div className="rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-50 to-white p-8 text-center shadow-lg">

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
        <Lock
          size={30}
          className="text-emerald-600"
        />
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        <Sparkles
          size={20}
          className="text-emerald-500"
        />

        <h2 className="text-2xl font-black text-gray-900">
          Fonctionnalité Pro
        </h2>
      </div>

      <p className="mx-auto mt-3 max-w-lg text-gray-500">
        <strong>{feature}</strong> est réservée aux abonnés
        TerraMind Pro.
      </p>

      <div className="mt-6">
        <span className="text-3xl font-black text-gray-900">
          5 000 FCFA
        </span>

        <span className="text-gray-500">
          {" "}
          / mois
        </span>
      </div>

      <Link
        href="/pricing"
        className="mt-7 inline-flex rounded-2xl bg-emerald-600 px-7 py-4 font-bold text-white transition hover:bg-emerald-700"
      >
        Mettre à niveau mon abonnement
      </Link>

    </div>
  );
}