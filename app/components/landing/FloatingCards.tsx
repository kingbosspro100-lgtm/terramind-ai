"use client";

import {
  Bot,
  CloudSun,
  TrendingUp,
  Wallet,
  Bell,
} from "lucide-react";

export default function FloatingCards() {
  return (
    <>
      {/* Carte IA */}

      <div className="absolute -left-12 top-20 hidden animate-bounce lg:block">

        <div className="rounded-3xl border border-white/60 bg-white/90 p-5 shadow-2xl backdrop-blur">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-emerald-100 p-3">

              <Bot className="text-emerald-700" size={22} />

            </div>

            <div>

              <p className="font-bold text-slate-900">

                TerraMind AI

              </p>

              <p className="text-sm text-slate-600">

                Rendement +12%

              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Carte météo */}

      <div className="absolute -right-20 top-28 hidden animate-pulse lg:block">

        <div className="rounded-3xl border border-white/60 bg-white/90 p-5 shadow-2xl backdrop-blur">

          <div className="flex items-center gap-3">

            <CloudSun className="text-sky-600" />

            <div>

              <p className="font-bold">

                29°C

              </p>

              <p className="text-sm text-slate-500">

                Soleil

              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Finance */}

      <div className="absolute -right-16 bottom-20 hidden lg:block animate-[float_5s_ease-in-out_infinite]">

        <div className="rounded-3xl bg-gradient-to-r from-emerald-700 to-green-600 p-5 text-white shadow-2xl">

          <div className="flex items-center gap-3">

            <Wallet />

            <div>

              <p className="text-sm text-emerald-100">

                Revenus

              </p>

              <p className="font-black">

                +245 000 FCFA

              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Notification */}

      <div className="absolute left-16 bottom-10 hidden lg:block animate-[float_6s_ease-in-out_infinite]">

        <div className="rounded-3xl border border-white/60 bg-white p-5 shadow-xl">

          <div className="flex items-center gap-3">

            <Bell className="text-orange-500" />

            <div>

              <p className="font-semibold">

                Récolte prête

              </p>

              <p className="text-sm text-slate-500">

                Parcelle Maïs A

              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Progression */}

      <div className="absolute right-20 bottom-[-40px] hidden lg:block animate-[float_4s_ease-in-out_infinite]">

        <div className="rounded-3xl border border-white/60 bg-white p-5 shadow-xl">

          <div className="flex items-center gap-3">

            <TrendingUp className="text-lime-600" />

            <div>

              <p className="font-bold">

                Production

              </p>

              <p className="text-sm text-lime-600">

                +18 %

              </p>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}