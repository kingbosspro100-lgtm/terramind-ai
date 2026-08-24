"use client";

import { useState } from "react";
import PublicHeader from "@/app/components/landing/PublicHeader";
import Footer from "@/app/components/landing/Footer";
import { useLanguage } from "@/lib/language-context";
import Link from "next/link";
import {
  Bot,
  CloudSun,
  WifiOff,
  Sparkles,
  ArrowRight,
  Package,
  Mic,
  Camera,
  Tractor,
  Wallet,
} from "lucide-react";

export default function DemoPage() {
  const { publicLanguage } = useLanguage();
  const isEn = publicLanguage === "en";
  const [activeTab, setActiveTab] = useState<"ai" | "farms" | "stock" | "weather" | "pwa">("ai");

  return (
    <div className="min-h-screen bg-[#0B0914] text-white flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
      {/* Top Header with Language Switcher */}
      <PublicHeader />

      {/* Main Demo Content */}
      <main className="flex-1 pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Banner */}
        <section className="rounded-3xl bg-gradient-to-r from-emerald-900/50 via-[#181436] to-teal-900/40 border border-emerald-500/40 p-8 shadow-2xl relative overflow-hidden space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/70 px-4 py-1 text-xs font-extrabold text-emerald-300">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>{isEn ? "Interactive Demo Environment" : "Démonstration Interactive TerraMind AI"}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            {isEn ? "Explore TerraMind AI Features Live" : "Découvrez l'interface TerraMind AI"}
          </h1>

          <p className="text-xs md:text-sm text-emerald-200/80 max-w-3xl font-medium leading-relaxed">
            {isEn
              ? "Test the interactive preview: AI Copilot with photo diagnostics and voice transcription, farm location management, stock inventory, Benin weather radar, and PWA offline mode."
              : "Explorez en direct la plateforme : Copilot IA avec analyse photo et dictée vocale, gestion des exploitations, inventaire de stock, météo réelle du Bénin et mode PWA hors-ligne."}
          </p>

          {/* Interactive Navigation Tabs */}
          <div className="pt-4 flex gap-2 overflow-x-auto scrollbar-hide border-t border-emerald-900/30">
            {[
              { id: "ai", label: isEn ? "AI Copilot (Photo/Audio)" : "Copilot IA (Photo/Audio)", icon: Bot },
              { id: "farms", label: isEn ? "Farms & Crops" : "Exploitations & Cultures", icon: Tractor },
              { id: "stock", label: isEn ? "Stock & Inventory" : "Gestion du Stock", icon: Package },
              { id: "weather", label: isEn ? "Benin Live Weather" : "Météo Réelle Bénin", icon: CloudSun },
              { id: "pwa", label: isEn ? "PWA Offline Mode" : "Mode Hors-ligne PWA", icon: WifiOff },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`inline-flex whitespace-nowrap items-center gap-2 rounded-2xl border px-5 py-3 text-xs font-extrabold transition duration-200 ${
                    isActive
                      ? "border-emerald-500 bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                      : "border-emerald-900/30 bg-[#0A100C] text-emerald-300 hover:bg-[#1C183B] hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* TAB 1: COPILOT IA DEMO */}
        {activeTab === "ai" && (
          <section className="rounded-3xl border border-emerald-900/30 bg-gradient-to-b from-[#181436] to-[#050A07] p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-emerald-900/30 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <Bot className="h-5 w-5 text-emerald-400" />
                  <span>Assistant IA - TerraMind Copilot</span>
                </h3>
                <p className="text-xs text-emerald-200/70 mt-1">
                  {isEn
                    ? "Interactive preview of AI recommendations, photo disease analysis, and voice dictation."
                    : "Aperçu interactif des réponses de l'IA, du diagnostic photo des maladies et de la dictée vocale."}
                </p>
              </div>

              <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950/80 border border-emerald-800/40 px-3 py-1 rounded-full">
                {isEn ? "Demo Mode" : "Mode Démo"}
              </span>
            </div>

            {/* Chat Simulator */}
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="flex gap-3">
                <div className="h-9 w-9 shrink-0 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl rounded-tl-none bg-[#1C183B] p-4 text-xs leading-relaxed text-emerald-100 border border-emerald-900/30 shadow-md">
                  {isEn
                    ? "Hello! I am TerraMind Copilot. I can analyze leaf photos for pests, transcribe your voice questions in the field, and recommend crop treatments."
                    : "Bonjour ! Je suis TerraMind Copilot. Je peux analyser vos photos de plantes, transcrire vos questions vocales au champ et vous conseiller sur vos cultures."}
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <div className="flex max-w-[85%] gap-3 flex-row-reverse">
                  <div className="h-9 w-9 shrink-0 rounded-2xl bg-violet-600 flex items-center justify-center text-white shadow-md">
                    <Camera className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl rounded-tr-none bg-emerald-700 p-4 text-xs leading-relaxed text-white shadow-md space-y-2">
                    <div className="flex items-center gap-2 font-bold text-[11px] bg-black/20 p-2 rounded-xl">
                      <Camera className="h-4 w-4 text-emerald-300" />
                      <span>[Photo jointe : feuille_mais_jaunie.jpg]</span>
                    </div>
                    <p>{isEn ? "Diagnose this maize leaf discoloration." : "Quel est le diagnostic pour cette décoloration du maïs ?"}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-9 w-9 shrink-0 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl rounded-tl-none bg-[#1C183B] p-4 text-xs leading-relaxed text-emerald-100 border border-emerald-900/30 shadow-md space-y-2">
                  <p className="font-bold text-emerald-300">🐛 Diagnostic Visuel & Solution :</p>
                  <p>1. Maladie suspectée : Carence en azote (N) combinée à un début de jaunissement des feuilles basales.</p>
                  <p>2. Recommandation : Apport d'Urée 46% (50 kg/ha) et maintien de l'humidité du sol.</p>
                </div>
              </div>
            </div>

            {/* Input Bar Simulator */}
            <div className="max-w-3xl mx-auto flex items-center gap-2 bg-[#0A100C] p-3 rounded-2xl border border-emerald-900/50">
              <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                <Camera className="h-4 w-4" />
              </div>
              <input
                type="text"
                disabled
                value={isEn ? "🎤 Voice dictation active... [Audio Transcriber]" : "🎤 Dictée vocale active... [Audio Transcripteur]"}
                className="min-w-0 flex-1 bg-transparent text-xs text-emerald-300 outline-none"
              />
              <div className="p-2.5 rounded-xl bg-red-600 text-white animate-pulse">
                <Mic className="h-4 w-4" />
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: FARMS & CROPS */}
        {activeTab === "farms" && (
          <section className="rounded-3xl border border-emerald-900/30 bg-gradient-to-b from-[#181436] to-[#050A07] p-8 shadow-2xl space-y-6">
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Tractor className="h-5 w-5 text-emerald-400" />
              <span>{isEn ? "Farms & Parcels Management" : "Gestion des Exploitations & GPS"}</span>
            </h3>

            <div className="grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-emerald-900/30 bg-[#0A100C] p-5 space-y-2">
                <p className="text-xs text-emerald-300 font-bold uppercase">Domaine Sud Cotonou</p>
                <p className="text-sm font-bold text-white">Superficie : 12.5 Hectares</p>
                <p className="text-xs text-emerald-200/60">Position GPS : 6.3703° N, 2.3912° E</p>
              </div>

              <div className="rounded-2xl border border-emerald-900/30 bg-[#0A100C] p-5 space-y-2">
                <p className="text-xs text-emerald-300 font-bold uppercase">Parcelle Nord Parakou</p>
                <p className="text-sm font-bold text-white">Superficie : 45 Hectares</p>
                <p className="text-xs text-emerald-200/60">Cultures : Maïs hybride & Anacarde</p>
              </div>

              <div className="rounded-2xl border border-emerald-900/30 bg-[#0A100C] p-5 space-y-2">
                <p className="text-xs text-emerald-300 font-bold uppercase">Champ Bohicon</p>
                <p className="text-sm font-bold text-white">Superficie : 8.0 Hectares</p>
                <p className="text-xs text-emerald-200/60">Cultures : Manioc & Soja</p>
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: STOCK DEMO */}
        {activeTab === "stock" && (
          <section className="rounded-3xl border border-emerald-900/30 bg-gradient-to-b from-[#181436] to-[#050A07] p-8 shadow-2xl space-y-6">
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Package className="h-5 w-5 text-emerald-400" />
              <span>{isEn ? "Stock & Inventory Management" : "Inventaire du Stock Agricole"}</span>
            </h3>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-emerald-900/30 bg-[#0A100C] p-5">
                <p className="text-xs text-emerald-300/60 font-bold uppercase">Engrais NPK 15-15-15</p>
                <p className="text-2xl font-black text-white mt-1">450 kg</p>
                <p className="text-xs text-emerald-300 font-semibold mt-1">Stock suffisant</p>
              </div>

              <div className="rounded-2xl border border-emerald-900/30 bg-[#0A100C] p-5">
                <p className="text-xs text-emerald-300/60 font-bold uppercase">Semences Maïs Hybride</p>
                <p className="text-2xl font-black text-white mt-1">80 kg</p>
                <p className="text-xs text-red-400 font-semibold mt-1">⚠️ Seuil d'alerte atteint</p>
              </div>

              <div className="rounded-2xl border border-emerald-900/30 bg-[#0A100C] p-5">
                <p className="text-xs text-emerald-300/60 font-bold uppercase">Carburant Motopompe</p>
                <p className="text-2xl font-black text-white mt-1">120 L</p>
                <p className="text-xs text-emerald-300 font-semibold mt-1">Stock suffisant</p>
              </div>
            </div>
          </section>
        )}

        {/* TAB 4: WEATHER DEMO */}
        {activeTab === "weather" && (
          <section className="rounded-3xl border border-emerald-900/30 bg-gradient-to-b from-[#181436] to-[#050A07] p-8 shadow-2xl space-y-6">
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <CloudSun className="h-5 w-5 text-blue-400" />
              <span>{isEn ? "Benin 12 Departments Weather" : "Météo Réelle des 12 Départements du Bénin"}</span>
            </h3>

            <div className="grid gap-4 md:grid-cols-3 text-center">
              <div className="rounded-2xl border border-emerald-900/30 bg-[#0A100C] p-5">
                <p className="text-xs text-emerald-300/60 font-bold uppercase">Cotonou / Littoral</p>
                <p className="text-3xl font-black text-white mt-1">29°C</p>
                <p className="text-xs text-emerald-300 font-semibold mt-1">Humidité : 84%</p>
              </div>

              <div className="rounded-2xl border border-emerald-900/30 bg-[#0A100C] p-5">
                <p className="text-xs text-emerald-300/60 font-bold uppercase">Parakou / Borgou</p>
                <p className="text-3xl font-black text-white mt-1">31°C</p>
                <p className="text-xs text-emerald-300 font-semibold mt-1">Vent : 18 km/h</p>
              </div>

              <div className="rounded-2xl border border-emerald-900/30 bg-[#0A100C] p-5">
                <p className="text-xs text-emerald-300/60 font-bold uppercase">Natitingou / Atacora</p>
                <p className="text-3xl font-black text-white mt-1">27°C</p>
                <p className="text-xs text-emerald-300 font-semibold mt-1">Précipitations : 12 mm</p>
              </div>
            </div>
          </section>
        )}

        {/* TAB 5: PWA OFFLINE DEMO */}
        {activeTab === "pwa" && (
          <section className="rounded-3xl border border-emerald-900/30 bg-gradient-to-b from-[#181436] to-[#050A07] p-8 shadow-2xl space-y-6">
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <WifiOff className="h-5 w-5 text-amber-400" />
              <span>{isEn ? "PWA Offline Access" : "Disponibilité Hors-Ligne (PWA)"}</span>
            </h3>

            <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/60 to-[#0A100C] p-6 space-y-3">
              <div className="flex items-center gap-3">
                <WifiOff className="h-6 w-6 text-amber-400" />
                <div>
                  <h4 className="text-sm font-extrabold text-white">
                    {isEn ? "No Internet Connection Required in Field" : "Accès continu au cœur de vos parcelles"}
                  </h4>
                  <p className="text-xs text-amber-200/80 mt-0.5">
                    {isEn
                      ? "Service Worker caches your farm records, crop logs, and stock levels for offline consultation."
                      : "Le Service Worker met en cache vos parcelles, vos stocks et vos finances pour une consultation hors-ligne."}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA -> Routes to Tarifs */}
        <section className="rounded-3xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-10 text-center text-white shadow-2xl space-y-6">
          <h2 className="text-3xl font-black">
            {isEn ? "Ready to start with TerraMind AI?" : "Prêt à découvrir nos offres TerraMind AI ?"}
          </h2>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-emerald-100 font-medium">
            {isEn
              ? "Check out our subscription plans and choose the formula that fits your farm."
              : "Consultez nos tarifs transparents et choisissez la formule adaptée à votre exploitation."}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/tarifs"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-xs sm:text-sm font-extrabold text-emerald-700 shadow-xl hover:scale-105 transition"
            >
              <span>{isEn ? "View Pricing Plans" : "Voir les Tarifs"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="rounded-2xl border border-white/40 bg-emerald-950/60 px-8 py-4 text-xs sm:text-sm font-extrabold text-white hover:bg-emerald-900 transition"
            >
              {isEn ? "Sign In" : "Se connecter"}
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}