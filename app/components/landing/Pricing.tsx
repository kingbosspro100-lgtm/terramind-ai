"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { AI_QUOTA_CONFIG } from "@/lib/ai-quota-config";

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="bg-slate-50 py-32"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <span className="rounded-full bg-emerald-100 px-5 py-2 font-semibold text-emerald-700">
            Tarifs & Quotas IA
          </span>

          <h2 className="mt-6 text-5xl font-black text-slate-900">
            Choisissez votre formule
          </h2>

          <p className="mt-5 text-xl text-slate-500">
            Commencez avec l'offre Découverte puis évoluez selon les besoins de vos exploitations.
          </p>

        </div>

        <div className="mt-20 grid gap-10 lg:grid-cols-2">

          {/* Gratuit */}
          <div className="rounded-[35px] border border-slate-200 bg-white p-10 shadow-lg flex flex-col justify-between">
            <div>
              <h3 className="text-3xl font-black">
                Gratuit
              </h3>

              <p className="mt-4 text-slate-500">
                Idéal pour découvrir TerraMind AI.
              </p>

              <div className="mt-8">
                <span className="text-6xl font-black">
                  0
                </span>
                <span className="text-2xl text-slate-500">
                  FCFA / mois
                </span>
              </div>

              <div className="mt-10 space-y-5">
                {[
                  `${AI_QUOTA_CONFIG.FREE_MONTHLY_AI_MESSAGES} messages IA par mois`,
                  "Gestion d'une exploitation",
                  "Tableau de bord agronomique",
                  "Prévisions météo de base",
                  "Messages bonus via vidéos",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-slate-700 font-medium"
                  >
                    <Check className="text-green-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/register?plan=free"
              className="mt-10 block rounded-2xl border border-emerald-600 py-4 text-center font-bold text-emerald-700 transition hover:bg-emerald-50"
            >
              Commencer gratuitement
            </Link>

          </div>

          {/* Premium / PRO */}
          <div className="relative rounded-[35px] bg-gradient-to-br from-emerald-700 via-green-600 to-lime-500 p-10 text-white shadow-[0_30px_80px_rgba(16,185,129,.35)] flex flex-col justify-between">

            <div className="absolute right-8 top-8 rounded-full bg-white px-4 py-2 text-sm font-bold text-emerald-700">
              ⭐ Recommandé
            </div>

            <div>
              <h3 className="text-3xl font-black">
                TerraMind PRO
              </h3>

              <p className="mt-4 text-emerald-100">
                Pour les exploitations agricoles professionnelles.
              </p>

              <div className="mt-8">
                <span className="text-6xl font-black">
                  2 500
                </span>
                <span className="text-2xl">
                  FCFA / mois
                </span>
              </div>

              <div className="mt-10 space-y-5">
                {[
                  `${AI_QUOTA_CONFIG.PRO_MONTHLY_AI_MESSAGES} messages IA par mois`,
                  "Prévisions météo avancées Bénin",
                  "Gestion financière & rentabilité",
                  "Suivi d'inventaire & stocks",
                  "Export des rapports PDF & Excel",
                  "Support prioritaire 7j/7",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 font-medium"
                  >
                    <Check className="shrink-0 text-white" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/pricing"
              className="mt-10 block rounded-2xl bg-white py-4 text-center font-bold text-emerald-700 transition hover:scale-105"
            >
              Souscrire à TerraMind PRO
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}