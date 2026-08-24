"use client";

import Link from "next/link";
import PublicHeader from "@/app/components/landing/PublicHeader";
import Footer from "@/app/components/landing/Footer";
import { useLanguage } from "@/lib/language-context";
import {
  Sparkles,
  Brain,
  Users,
  Target,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function AboutPage() {
  const { publicLanguage } = useLanguage();
  const isEn = publicLanguage === "en";

  const stats = isEn
    ? [
        { label: "Connected Farms", value: "1,200+" },
        { label: "Crop Area Monitored", value: "45,000 ha" },
        { label: "AI Forecast Accuracy", value: "98.4%" },
        { label: "Irrigation Water Savings", value: "-35%" },
      ]
    : [
        { label: "Exploitations Connectées", value: "1,200+" },
        { label: "Hectares de Cultures Suivis", value: "45,000 ha" },
        { label: "Précision Prévisions IA", value: "98.4%" },
        { label: "Économie d'Eau d'Irrigation", value: "-35%" },
      ];

  const values = isEn
    ? [
        {
          icon: Brain,
          title: "Cutting-Edge Agronomic AI",
          desc: "Deep learning models trained on African soil types and weather patterns.",
        },
        {
          icon: Target,
          title: "Maximum Precision",
          desc: "Real-time weather radar and sensor data to anticipate pest and climate risks.",
        },
        {
          icon: Users,
          title: "Accessibility for All",
          desc: "Intuitive mobile & desktop interface with PWA offline access for field operators.",
        },
      ]
    : [
        {
          icon: Brain,
          title: "IA Agronomique de Pointe",
          desc: "Des modèles de Deep Learning entraînés sur les spécificités des sols et des climats africains.",
        },
        {
          icon: Target,
          title: "Précision Maximale",
          desc: "Données satellites et météo actualisées en temps réel pour anticiper les risques sanitaires et climatiques.",
        },
        {
          icon: Users,
          title: "Accessibilité pour Tous",
          desc: "Une interface intuitive accessible sur mobile et ordinateur avec mode PWA hors-ligne.",
        },
      ];

  return (
    <div className="min-h-screen bg-[#0B0914] text-white flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
      {/* Top Header with Language Switcher */}
      <PublicHeader />

      {/* Main Content */}
      <main className="flex-1 pt-28 pb-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 px-6 text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-4 py-1.5 text-xs font-bold text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>{isEn ? "The Future of Smart Agriculture" : "L'Avenir de la smart agriculture"}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {isEn ? (
                <>Revolutionizing agriculture through <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">Artificial Intelligence</span></>
              ) : (
                <>Révolutionner l'agriculture grâce à <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">l'Intelligence Artificielle</span></>
              )}
            </h1>

            <p className="text-base md:text-lg text-emerald-200/70 max-w-3xl mx-auto font-medium leading-relaxed">
              {isEn
                ? "TerraMind AI is the next-generation operating system built to maximize crop yield, conserve irrigation water, and empower farm management."
                : "TerraMind AI est le premier système d'exploitation agricole intelligent conçu pour maximiser le rendement des cultures, préserver les ressources en eau et sécuriser la gestion financière des exploitations."}
            </p>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="max-w-7xl mx-auto px-6 mb-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-8 shadow-xl text-center hover:border-emerald-500/40 transition"
              >
                <p className="text-4xl font-extrabold text-white tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-xs font-semibold text-emerald-200/60 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Story & Mission Section */}
        <section className="max-w-7xl mx-auto px-6 py-8 grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              {isEn ? "Our Mission & Commitments" : "Notre Mission & Engagements"}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/70 leading-relaxed font-medium">
              {isEn
                ? "Facing climate shifts and food security challenges, farmers need predictable, precise, and immediately applicable decision tools."
                : "Face au changement climatique et aux défis de sécurité alimentaire, les agriculteurs ont besoin d'outils de décision prévisibles, précis et immédiatement applicables."}
            </p>
            <p className="text-xs sm:text-sm text-emerald-200/70 leading-relaxed font-medium">
              {isEn
                ? "At TerraMind AI, we democratize access to agronomic modeling, photo pest diagnostics, voice dictation, and equipment marketplace."
                : "Chez TerraMind AI, nous démocratisons l'accès à la modélisation agronomique, l'analyse de photos de maladies, la dictée vocale et la marketplace d'outils."}
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-white font-semibold">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                <span>{isEn ? "AI Copilot with photo diagnostics & voice transcriber" : "Copilot IA avec diagnostics photos & transcripteur vocal"}</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-white font-semibold">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                <span>{isEn ? "Chariow seller product dashboard & buyer tools marketplace" : "Tableau Vendeur Chariow & Marketplace d'outils agricoles"}</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-white font-semibold">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                <span>{isEn ? "PWA offline mode with local cache & Benin weather radar" : "Mode PWA hors-ligne avec cache local & météo du Bénin"}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-8 shadow-2xl overflow-hidden space-y-6">
              <h3 className="text-xl font-extrabold text-white">
                {isEn ? "Core Values" : "Nos Valeurs Fondamentales"}
              </h3>
              <div className="space-y-6">
                {values.map((v, i) => {
                  const Icon = v.icon;
                  return (
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold text-white">{v.title}</h4>
                        <p className="text-xs text-emerald-200/70 mt-1 leading-relaxed font-medium">{v.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
