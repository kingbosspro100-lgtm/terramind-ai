"use client";

import { BrainCircuit, ChartNoAxesCombined, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function WhyTerraMind() {
  const { t } = useLanguage();

  const reasons = [
    {
      icon: BrainCircuit,
      title: t.whyCard1Title,
      description: t.whyCard1Desc,
      glow: "from-pink-500/20 via-purple-500/20 to-indigo-500/20",
    },
    {
      icon: ChartNoAxesCombined,
      title: t.whyCard2Title,
      description: t.whyCard2Desc,
      glow: "from-amber-500/20 via-emerald-500/20 to-teal-500/20",
    },
    {
      icon: ShieldCheck,
      title: t.whyCard3Title,
      description: t.whyCard3Desc,
      glow: "from-cyan-500/20 via-blue-500/20 to-purple-500/20",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0E0C1F] via-[#120E2B] to-[#0B0914] px-6 py-20 sm:py-28 border-t border-b border-emerald-900/20 text-white">
      {/* Background Rainbow Glow Elements */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-red-600/10 via-amber-500/10 via-emerald-500/10 to-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center space-y-4">
          <div className="inline-block rounded-full bg-gradient-to-r from-red-500/15 via-yellow-500/15 via-emerald-500/15 via-sky-500/15 to-purple-500/15 border border-white/10 px-4 py-1.5 backdrop-blur-md">
            <span className="bg-gradient-to-r from-red-400 via-amber-300 via-emerald-400 via-sky-400 to-purple-400 bg-clip-text text-transparent font-extrabold text-xs uppercase tracking-[0.25em]">
              {t.whyBadge}
            </span>
          </div>

          {/* Rainbow Gradient Multicolore Title */}
          <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
            {t.whyTitle}
          </h2>

          <p className="text-base leading-7 text-emerald-200/70 font-medium max-w-xl mx-auto">
            {t.whyDesc}
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {reasons.map(({ icon: Icon, title, description, glow }) => (
            <article
              key={title}
              className="relative group rounded-3xl border border-white/10 bg-[#0A100C]/90 p-8 shadow-2xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className={`absolute -right-8 -bottom-8 w-36 h-36 bg-gradient-to-br ${glow} rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none`} />

              <div className="inline-flex rounded-2xl bg-gradient-to-r from-red-500/20 via-emerald-500/20 to-purple-500/20 border border-white/15 p-3.5 text-white shadow-md">
                <Icon size={26} className="text-emerald-400" />
              </div>

              <h3 className="mt-6 text-xl font-extrabold text-white">
                <span className="bg-gradient-to-r from-white via-emerald-100 to-slate-200 bg-clip-text">
                  {title}
                </span>
              </h3>

              <p className="mt-3 text-sm leading-6 text-emerald-200/70 font-medium relative z-10">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
