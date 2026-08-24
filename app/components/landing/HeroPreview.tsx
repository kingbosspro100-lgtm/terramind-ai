"use client";

import {
  Bot,
  CloudSun,
  TrendingUp,
  Wallet,
  Tractor,
  Sprout,
  Package,
} from "lucide-react";
import FloatingCards from "./FloatingCards";
import Card from "../ui/Card";
import Logo from "../ui/Logo";

export default function HeroPreview() {
  return (
    <div className="relative">
<FloatingCards />
      {/* Carte météo */}

     <Card className="absolute -left-52 -top-16 z-20 hidden w-56 p-5 lg:block">

        <div className="flex items-center gap-3">

          <div className="rounded-2xl bg-sky-100 p-3">

            <CloudSun className="text-sky-600" />

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Météo
            </p>

            <p className="text-2xl font-bold text-slate-900">
              29°C
            </p>

            <p className="text-xs text-slate-500">
              Soleil • Humidité 64%
            </p>

          </div>

        </div>

      </Card>

      {/* Carte IA */}

      <Card className="absolute -right-8 bottom-12 z-20 hidden w-64 p-5 lg:block">

        <div className="flex gap-3">

          <div className="rounded-2xl bg-emerald-100 p-3">

            <Bot className="text-emerald-700" />

          </div>

          <div>

            <p className="font-bold text-slate-900">
              TerraMind AI
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-500">

              Les conditions météo sont favorables.
              Réduisez l'irrigation aujourd'hui.

            </p>

          </div>

        </div>

      </Card>

      {/* Dashboard */}

      <Card className="overflow-hidden rounded-[32px] border-0 bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b bg-slate-50 px-6 py-5">

         <div className="flex items-center gap-4">
  <Logo width={36} height={36} />

  <div>
    <p className="text-lg font-bold text-slate-900">
      TerraMind AI
    </p>

    <p className="text-xs text-slate-500">
      Dashboard Premium
    </p>
  </div>
</div> 

          

          <div className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-700">

            ● En ligne

          </div>

        </div>

        <div className="space-y-6 p-6">

          {/* KPI */}

          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-2xl bg-emerald-50 p-5">

              <div className="flex items-center justify-between">

                <Tractor className="text-emerald-700" />

                <TrendingUp
                  size={18}
                  className="text-emerald-700"
                />

              </div>

              <h2 className="mt-4 text-3xl font-black">

                24

              </h2>

              <p className="text-sm text-slate-500">

                Exploitations

              </p>

            </div>

            <div className="rounded-2xl bg-lime-50 p-5">

              <div className="flex items-center justify-between">

                <Sprout className="text-lime-700" />

                <TrendingUp
                  size={18}
                  className="text-lime-700"
                />

              </div>

              <h2 className="mt-4 text-3xl font-black">

                132

              </h2>

              <p className="text-sm text-slate-500">

                Cultures

              </p>

            </div>

          </div>

          {/* Graphique */}

          <div className="rounded-2xl bg-slate-50 p-5">

            <div className="mb-5 flex items-center justify-between">

              <h3 className="font-bold">

                Production

              </h3>

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">

                +18 %

              </span>

            </div>

            <div className="flex h-36 items-end gap-3">

              {[40, 55, 42, 70, 65, 82, 90].map((value, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t-xl bg-gradient-to-t from-emerald-600 to-lime-400"
                  style={{
                    height: `${value}%`,
                  }}
                />
              ))}

            </div>

          </div>

          {/* Finances */}

          <div className="rounded-3xl bg-gradient-to-r from-emerald-700 to-green-600 p-6 text-white">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-emerald-100">

                  Revenus

                </p>

                <h2 className="mt-2 text-3xl font-black">

                  2 450 000 FCFA

                </h2>

              </div>

              <div className="rounded-2xl bg-white/20 p-4">

                <Wallet size={30} />

              </div>

            </div>

          </div>

          {/* Stock */}

          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-5">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-orange-100 p-3">

                <Package className="text-orange-600" />

              </div>

              <div>

                <p className="font-semibold">

                  Stock disponible

                </p>

                <p className="text-sm text-slate-500">

                  245 sacs • 12 tonnes

                </p>

              </div>

            </div>

            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">

              Stable

            </span>

          </div>

        </div>

      </Card>

    </div>
  );
}