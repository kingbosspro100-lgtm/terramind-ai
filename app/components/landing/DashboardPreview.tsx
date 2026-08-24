"use client";

import {
  Bot,
  CloudSun,
  Sprout,
  Tractor,
  Wallet,
  TrendingUp,
} from "lucide-react";

export default function DashboardPreview() {
  return (
    <section
      id="dashboard"
      className="bg-gradient-to-b from-white to-slate-100 py-32"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <span className="rounded-full bg-emerald-100 px-5 py-2 font-semibold text-emerald-700">
            Dashboard
          </span>

          <h2 className="mt-6 text-5xl font-black text-slate-900">
            Votre exploitation.
          </h2>

          <p className="mt-5 text-xl text-slate-500">
            Toutes vos données réunies dans une seule interface.
          </p>

        </div>

        <div className="mt-20 overflow-hidden rounded-[40px] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(0,0,0,.12)]">

          {/* Header */}

          <div className="flex items-center justify-between border-b bg-slate-50 px-8 py-6">

            <div>

              <h3 className="text-2xl font-black">
                TerraMind AI
              </h3>

              <p className="text-slate-500">
                Dashboard Agricole
              </p>

            </div>

            <div className="rounded-full bg-green-100 px-5 py-2 font-bold text-green-700">
              ● En ligne
            </div>

          </div>

          <div className="grid gap-6 p-8 lg:grid-cols-4">

            <div className="rounded-3xl bg-emerald-50 p-6">

              <Tractor className="text-emerald-700" />

              <h2 className="mt-6 text-4xl font-black">
                24
              </h2>

              <p className="text-slate-500">
                Exploitations
              </p>

            </div>

            <div className="rounded-3xl bg-lime-50 p-6">

              <Sprout className="text-lime-700" />

              <h2 className="mt-6 text-4xl font-black">
                132
              </h2>

              <p className="text-slate-500">
                Cultures
              </p>

            </div>

            <div className="rounded-3xl bg-sky-50 p-6">

              <CloudSun className="text-sky-700" />

              <h2 className="mt-6 text-4xl font-black">
                29°
              </h2>

              <p className="text-slate-500">
                Météo
              </p>

            </div>

            <div className="rounded-3xl bg-orange-50 p-6">

              <Wallet className="text-orange-600" />

              <h2 className="mt-6 text-2xl font-black">
                2,4 M FCFA
              </h2>

              <p className="text-slate-500">
                Revenus
              </p>

            </div>

          </div>

          <div className="grid gap-8 p-8 lg:grid-cols-2">

            <div className="rounded-3xl bg-slate-50 p-8">

              <div className="mb-6 flex items-center justify-between">

                <h3 className="font-bold text-xl">
                  Production
                </h3>

                <TrendingUp className="text-emerald-700" />

              </div>

              <div className="flex h-56 items-end gap-3">

                {[40,55,48,70,62,82,95].map((v, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-xl bg-gradient-to-t from-emerald-700 to-lime-400"
                    style={{ height: `${v}%` }}
                  />
                ))}

              </div>

            </div>

            <div className="rounded-3xl bg-gradient-to-br from-emerald-700 to-green-600 p-8 text-white">

              <div className="flex items-center gap-4">

                <Bot size={34} />

                <h3 className="text-2xl font-bold">
                  Assistant IA
                </h3>

              </div>

              <p className="mt-8 text-lg leading-8 text-emerald-100">

                Les conditions météo sont favorables.

                Augmentez la fréquence des semis cette semaine.

                Rendement estimé : +18%.

              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}