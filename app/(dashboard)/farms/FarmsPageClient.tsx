"use client";

import { Wheat, Ruler, MapPinned, Sprout, Plus } from "lucide-react";
import FarmForm from "@/app/components/FarmForm";
import FarmCard from "@/app/components/FarmCard";
import { useLanguage } from "@/lib/language-context";

interface Props {
  farmList: any[];
}

export default function FarmsPageClient({ farmList }: Props) {
  const { t } = useLanguage();

  const totalFarms = farmList.length;
  const totalArea = farmList.reduce((sum, farm) => sum + Number(farm.area || 0), 0);
  const totalCities = new Set(farmList.map((farm) => farm.city)).size;
  const totalCrops = farmList.reduce((sum, farm) => sum + (farm.crops?.length ?? 0), 0);

  const kpis = [
    { title: t.navFarms, value: totalFarms.toString(), icon: Wheat, color: "text-emerald-400" },
    { title: t.totalSurface, value: `${totalArea} ha`, icon: Ruler, color: "text-blue-400" },
    { title: t.navCrops, value: totalCrops.toString(), icon: Sprout, color: "text-emerald-400" },
    { title: "Villes / Cities", value: totalCities.toString(), icon: MapPinned, color: "text-amber-400" },
  ];

  return (
    <main className="space-y-8 pb-12">
      {/* Header */}
      <section className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3 py-1 text-[11px] font-semibold text-emerald-300 mb-3">
            <MapPinned className="h-3 w-3 text-emerald-400" />
            <span>{t.farmsBadge}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {t.farmsTitle}
          </h1>
          <p className="mt-1 text-sm text-emerald-200/70 max-w-2xl font-medium">
            {t.farmsSubtitle}
          </p>
        </div>

        <a
          href="#farm-creation-form"
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-xl shadow-emerald-600/30 hover:opacity-95 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{t.newFarmBtn}</span>
        </a>
      </section>

      {/* KPI Grid */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-600/10 rounded-full blur-2xl group-hover:bg-emerald-600/20 transition-all duration-500"></div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300/60">{kpi.title}</p>
                <div className={`p-2 rounded-xl bg-[#0A100C] border border-emerald-900/40 ${kpi.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-white tracking-tight">
                {kpi.value}
              </h3>
            </div>
          );
        })}
      </section>

      {/* Formulaire */}
      <div id="farm-creation-form" className="scroll-mt-6">
        <FarmForm />
      </div>

      {/* Liste */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-emerald-900/30 pb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {t.farmListTitle}
          </h2>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3 py-1 text-xs font-semibold text-emerald-300">
            {totalFarms} active{totalFarms > 1 ? "s" : ""}
          </span>
        </div>

        {farmList.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-emerald-900/50 bg-[#0A100C] p-16 text-center shadow-2xl">
            <div className="text-6xl mb-4">🌾</div>
            <h3 className="text-xl font-bold text-white">Aucune exploitation</h3>
            <p className="mt-2 text-sm text-emerald-200/60 font-medium">
              Commencez par créer votre première exploitation pour activer les modules IA et financiers.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {farmList.map((farm) => (
              <FarmCard key={farm.id} farm={farm} farms={farmList} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
