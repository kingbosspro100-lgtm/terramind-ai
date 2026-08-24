"use client";

import PublicHeader from "@/app/components/landing/PublicHeader";
import Footer from "@/app/components/landing/Footer";
import { useLanguage } from "@/lib/language-context";
import { Scale } from "lucide-react";

export default function TermsPage() {
  const { publicLanguage } = useLanguage();
  const isEn = publicLanguage === "en";

  return (
    <div className="min-h-screen bg-[#0B0914] text-white flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
      {/* Top Header with Language Switcher */}
      <PublicHeader />

      {/* Main Content */}
      <main className="flex-1 pt-28 pb-16">
        <section className="relative overflow-hidden py-12 px-6 text-center border-b border-emerald-900/20">
          <div className="max-w-3xl mx-auto relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-4 py-1.5 text-xs font-bold text-emerald-300">
              <Scale className="h-3.5 w-3.5 text-emerald-400" />
              <span>{isEn ? "SaaS Terms of Service" : "Accord Contractuel SaaS"}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              {isEn ? "Terms of Service" : "Conditions Générales d'Utilisation"}
            </h1>

            <p className="text-xs text-emerald-200/70 max-w-xl mx-auto font-medium">
              {isEn
                ? "By using TerraMind AI, you agree to these terms governing farm software, AI Copilot, and Chariow seller listings."
                : "En utilisant TerraMind AI, vous acceptez les présentes conditions régissant l'accès à nos services agricoles."}
            </p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 py-12 space-y-6 text-emerald-200/80 font-medium text-xs">
          <div className="rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-8 shadow-2xl space-y-2">
            <h2 className="text-base font-extrabold text-white">1. {isEn ? "Service Description" : "Objet du Service"}</h2>
            <p>
              {isEn
                ? "TerraMind AI provides agricultural software for farm monitoring, AI Copilot image diagnostics, Chariow product marketplace, weather radar, and PWA offline access."
                : "TerraMind AI fournit une suite logicielle SaaS destinée aux exploitants agricoles, coopératives et agronomes."}
            </p>
          </div>

          <div className="rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-8 shadow-2xl space-y-2">
            <h2 className="text-base font-extrabold text-white">2. {isEn ? "Subscriptions & PRO Plan (2,500 FCFA)" : "Abonnements & Offre PRO (2 500 FCFA)"}</h2>
            <p>
              {isEn
                ? "Subscriptions are billed monthly. The PRO plan is priced at 2,500 FCFA / month with 100 AI messages."
                : "Les abonnements sont souscrits selon les tarifs en vigueur. La formule PRO est à 2 500 FCFA / mois."}
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
