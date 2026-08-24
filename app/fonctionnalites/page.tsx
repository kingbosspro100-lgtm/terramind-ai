"use client";

import PublicHeader from "@/app/components/landing/PublicHeader";
import Footer from "@/app/components/landing/Footer";
import { useLanguage } from "@/lib/language-context";
import Link from "next/link";
import {
  Tractor,
  Sprout,
  Package,
  Wallet,
  CloudSun,
  Bot,
  BarChart3,
  ShieldCheck,
  Mic,
  Camera,
  WifiOff,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function FonctionnalitesPage() {
  const { publicLanguage } = useLanguage();
  const isEn = publicLanguage === "en";

  const features = isEn
    ? [
      {
        icon: Bot,
        title: "TerraMind Copilot AI",
        description:
          "Agri-expert AI assistant supporting photo analysis of diseased crops, voice dictation, and multi-conversation sessions.",
        badge: "AI & Vision",
      },
      {
        icon: Camera,
        title: "Crop Disease Photo Diagnostic",
        description:
          "Upload leaf or crop photos directly to the AI for instantaneous phytosanitary disease and pest diagnosis.",
        badge: "Vision AI",
      },
      {
        icon: Mic,
        title: "Voice Dictation (Audio Transcriber)",
        description:
          "Hands-free voice recognition allowing farmers to dictate questions directly in the field.",
        badge: "Voice AI",
      },
      {
        icon: CloudSun,
        title: "Benin 12 Departments Live Weather",
        description:
          "Live meteorological data by department, humidity, wind, 7-day forecast, and agronomic alerts.",
        badge: "Météo Réelle",
      },
      {
        icon: Tractor,
        title: "Farm & GPS Location Management",
        description:
          "Register your farms and parcelles with exact GPS coordinates and territorial tracking.",
        badge: "Exploitations",
      },
      {
        icon: Sprout,
        title: "Crop Monitoring",
        description:
          "Track plantings, growth stages, harvest dates, and historical crop yields.",
        badge: "Cultures",
      },
      {
        icon: Package,
        title: "Stock & Inventory Management",
        description:
          "Track seed, fertilizer, and equipment stocks with minimum quantity threshold alerts.",
        badge: "Stock",
      },
      {
        icon: Wallet,
        title: "Transactions & Financial Balance",
        description:
          "Log incomes and operational expenses, calculate net profit, and edit/delete transactions anytime.",
        badge: "Finances",
      },
      {
        icon: WifiOff,
        title: "PWA Offline Availability",
        description:
          "Access your farm data and cached records directly in the field even without internet.",
        badge: "Offline PWA",
      },
      {
        icon: BarChart3,
        title: "Agricultural Analytics Dashboard",
        description:
          "Visual KPIs and summary charts to keep your agricultural enterprise clear and under control.",
        badge: "Dashboard",
      },
      {
        icon: ShieldCheck,
        title: "Secure Auth & Subscriptions",
        description:
          "Google OAuth & Phone SMS authentication, transparent Free / Pro / Enterprise subscription plans.",
        badge: "Sécurité",
      },
    ]
    : [
      {
        icon: Bot,
        title: "TerraMind Copilot IA",
        description:
          "Assistant agronomique intelligent avec conseils personnalisés, analyse de photos de cultures et dictée vocale.",
        badge: "IA & Vision",
      },
      {
        icon: Camera,
        title: "Diagnostic Photo des Maladies",
        description:
          "Transmettez une photo de feuille ou plant touché pour obtenir un diagnostic phytosanitaire et des solutions.",
        badge: "Vision IA",
      },
      {
        icon: Mic,
        title: "Dictée Vocale (Audio Transcripteur)",
        description:
          "Transcripteur vocal permettant aux agriculteurs de dicter leurs questions en direct dans leurs champs.",
        badge: "IA Vocale",
      },
      {
        icon: CloudSun,
        title: "Météo Réelle des 12 Départements du Bénin",
        description:
          "Données météorologiques en direct par département, température, pluie, vent et prévisions sur 7 jours.",
        badge: "Météo Réelle",
      },
      {
        icon: Tractor,
        title: "Gestion des Exploitations & Géolocalisation GPS",
        description:
          "Enregistrez vos fermes avec position GPS automatique et géolocalisation précise des parcelles.",
        badge: "Exploitations",
      },
      {
        icon: Sprout,
        title: "Suivi des Cultures & Récoltes",
        description:
          "Suivez les étapes de croissance, les dates de semis, les traitements et les volumes de récoltes.",
        badge: "Cultures",
      },
      {
        icon: Package,
        title: "Gestion du Stock & Inventaire",
        description:
          "Suivez vos réserves d'engrais, semences et matériels avec alertes de stock faible.",
        badge: "Stock",
      },
      {
        icon: Wallet,
        title: "Transactions & Bilan Financier",
        description:
          "Saisissez vos revenus et dépenses, suivez votre bénéfice net et gérez vos transactions à tout moment.",
        badge: "Finances",
      },
      {
        icon: WifiOff,
        title: "Mode Hors-Ligne (PWA)",
        description:
          "Consultez vos exploitations, vos stocks et vos données enregistrées même sans réseau dans vos champs.",
        badge: "Hors-ligne PWA",
      },
      {
        icon: BarChart3,
        title: "Tableau de Bord & Indicateurs",
        description:
          "Vue synthétique de la santé de votre exploitation avec indicateurs clés et graphiques récapitulatifs.",
        badge: "Dashboard",
      },
      {
        icon: ShieldCheck,
        title: "Authentification Sécurisée & Formules",
        description:
          "Connexion Google et E-mail , abonnements transparents Free, Pro et Entreprise.",
        badge: "Sécurité",
      },
    ];

  return (
    <div className="min-h-screen bg-[#0B0914] text-white flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
      {/* Top Header with Language Switcher */}
      <PublicHeader />

      {/* Main Content */}
      <main className="flex-1 pt-28 pb-16">
        {/* Header Hero Section */}
        <section className="relative px-6 py-16 text-center overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="mx-auto max-w-4xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-4 py-1.5 text-xs font-bold text-emerald-300">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>{isEn ? "TerraMind AI Feature Suite" : "L'Écosystème Agricole TerraMind AI"}</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
              {isEn ? "All Functional Features" : "Toutes les fonctionnalités"}
            </h1>

            <p className="mx-auto max-w-2xl text-base sm:text-lg text-emerald-200/80 font-medium leading-relaxed">
              {isEn
                ? "Discover how TerraMind AI simplifies farm management, crop diagnostics, weather analysis, stock control, and financial tracking for African farmers."
                : "Découvrez comment TerraMind AI aide à mieux gérer son exploitation, ses cultures, ses stocks, ses finances et à obtenir une assistance agronomique intelligente."}
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-8 shadow-2xl transition duration-300 hover:border-emerald-500/40 hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 shadow-md">
                      <Icon className="h-7 w-7" />
                    </div>

                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1 rounded-full">
                      {feature.badge}
                    </span>
                  </div>

                  <h2 className="text-xl font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                    {feature.title}
                  </h2>

                  <p className="mt-3 text-xs leading-relaxed text-emerald-200/70 font-medium">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Banner -> Routes to Tarifs */}
        <section className="mx-auto mt-12 max-w-5xl px-6">
          <div className="rounded-3xl bg-gradient-to-r from-emerald-900/50 via-[#181436] to-teal-900/40 border border-emerald-500/40 p-10 text-center shadow-2xl relative overflow-hidden space-y-6">
            <h2 className="text-3xl font-extrabold text-white">
              {isEn ? "Ready to optimize your farm management?" : "Prêt à mieux gérer votre exploitation ?"}
            </h2>

            <p className="mx-auto max-w-xl text-xs sm:text-sm text-emerald-200/80 font-medium">
              {isEn
                ? "Explore our simple plans and start managing your fields and crops smarter."
                : "Découvrez nos offres et commencez gratuitement à piloter vos cultures, vos stocks et vos finances."}
            </p>

            <div>
              <Link
                href="/tarifs"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4 text-sm font-extrabold text-white shadow-xl shadow-emerald-600/30 hover:scale-105 transition"
              >
                <span>{isEn ? "View Pricing Plans" : "Voir les Tarifs"}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}