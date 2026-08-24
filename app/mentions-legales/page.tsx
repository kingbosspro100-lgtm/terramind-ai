"use client";

import PublicHeader from "@/app/components/landing/PublicHeader";
import Footer from "@/app/components/landing/Footer";
import { useLanguage } from "@/lib/language-context";
import { Building, Server, ShieldAlert } from "lucide-react";

export default function LegalNoticePage() {
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
              <Building className="h-3.5 w-3.5 text-emerald-400" />
              <span>{isEn ? "Legal Information" : "Informations Légales Officiel"}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              {isEn ? "Legal Notice" : "Mentions Légales"}
            </h1>

            <p className="text-xs text-emerald-200/70 max-w-xl mx-auto font-medium">
              {isEn
                ? "Official legal details for TerraMind AI Technologies SAS platform publisher and host."
                : "Informations obligatoires relatives à l'éditeur et à l'hébergeur de la plateforme TerraMind AI."}
            </p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 py-12 space-y-6 text-emerald-200/80 font-medium text-xs">
          <div className="rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-8 shadow-2xl space-y-2">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Building className="h-4 w-4 text-emerald-400" />
              <span>1. {isEn ? "Site Publisher" : "Éditeur du Site"}</span>
            </h2>
            <div className="space-y-1">
              <p><strong>Company:</strong> TerraMind AI Technologies SAS</p>
              <p><strong>Headquarters:</strong> Avenue Jean-Paul II, Cotonou, Bénin</p>
              <p><strong>Contact:</strong> kingbosspro100@gmail.com</p>
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-8 shadow-2xl space-y-2">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Server className="h-4 w-4 text-emerald-400" />
              <span>2. {isEn ? "Cloud Hosting" : "Hébergement"}</span>
            </h2>
            <p>Vercel Inc. & Supabase AWS Cloud Infrastructure.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
