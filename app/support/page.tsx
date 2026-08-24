"use client";

import { useState } from "react";
import Link from "next/link";
import PublicHeader from "@/app/components/landing/PublicHeader";
import Footer from "@/app/components/landing/Footer";
import { useLanguage } from "@/lib/language-context";
import {
  Search,
  MessageSquare,
  PhoneCall,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Tractor,
  CloudSun,
  ShieldCheck,
  CreditCard,
  UserCheck,
  CheckCircle2,
} from "lucide-react";

export default function SupportPage() {
  const { publicLanguage } = useLanguage();
  const isEn = publicLanguage === "en";

  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const faqList = isEn
    ? [
        {
          question: "How do I add a new farm on TerraMind AI?",
          answer: "Go to the 'Farms' module in the sidebar, click 'New Farm', and enter your farm location, area, and active crops.",
        },
        {
          question: "How do weather forecasts and irrigation advisories work?",
          answer: "TerraMind AI uses satellite weather telemetry and virtual soil sensors to calculate soil moisture and suggest optimal 7-day irrigation schedules.",
        },
        {
          question: "Can I use TerraMind AI offline in the field?",
          answer: "Yes! TerraMind AI has full PWA offline mode. All your farm data, stocks, and crop history remain accessible without internet connection.",
        },
        {
          question: "What should I do if my crops show disease symptoms?",
          answer: "Open TerraMind AI Copilot, attach a photo of the affected leaf or dictate your observation. The AI generates a diagnostic report and treatment steps.",
        },
      ]
    : [
        {
          question: "Comment ajouter une nouvelle exploitation sur TerraMind AI ?",
          answer: "Rendez-vous dans la section 'Exploitations' depuis le menu principal, puis cliquez sur 'Ajouter une exploitation'. Renseignez la superficie et les cultures.",
        },
        {
          question: "Comment fonctionne la prévision météo et l'irrigation ?",
          answer: "TerraMind AI utilise des modèles météo satellite haute précision pour analyser l'humidité des sols et recommander l'irrigation idéale à 7 jours.",
        },
        {
          question: "Puis-je utiliser TerraMind AI hors connexion internet ?",
          answer: "Oui ! TerraMind AI dispose d'un mode PWA hors-ligne. Vos données d'exploitations et de stocks restent consultables sans réseau internet.",
        },
        {
          question: "Que faire en cas d'alerte de maladie sur mes cultures ?",
          answer: "Accédez à l'Assistant IA, prenez une photo ou décrivez les symptômes observés pour recevoir un diagnostic visuel et des recommandations de traitement.",
        },
      ];

  const categories = isEn
    ? [
        { icon: Tractor, title: "Farm Management", desc: "Parcels, soil data, and rotation planning." },
        { icon: CloudSun, title: "Weather & Irrigation", desc: "Satellite radar, drought alerts, and rainfall advisories." },
        { icon: CreditCard, title: "Billing & Plans", desc: "Subscription management, 2,500 FCFA PRO plan, and receipts." },
        { icon: ShieldCheck, title: "Account & Security", desc: "Profile picture, password updates, and account deletion." },
      ]
    : [
        { icon: Tractor, title: "Gestion des Exploitations", desc: "Cartographie des parcelles, suivi du sol et des rotations." },
        { icon: CloudSun, title: "Prévisions Météo & Irrigation", desc: "Capteurs satellites, alertes sécheresse et conseils de pluie." },
        { icon: CreditCard, title: "Facturation & Tarifs", desc: "Gestion des abonnements, plan PRO à 2 500 FCFA et factures." },
        { icon: ShieldCheck, title: "Sécurité & Compte", desc: "Gestion du profil, mot de passe et suppression du compte." },
      ];

  return (
    <div className="min-h-screen bg-[#0B0914] text-white flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
      {/* Top Header with Language Switcher */}
      <PublicHeader />

      {/* Main Content */}
      <main className="flex-1 pt-28 pb-16">
        {/* Hero Section with Search Bar */}
        <section className="relative overflow-hidden py-12 px-6 text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mx-auto relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-4 py-1.5 text-xs font-bold text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>{isEn ? "Help Center & Premium Support" : "Centre d'Aide & Support Premium"}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {isEn ? "How can we help you?" : "Comment pouvons-nous vous aider ?"}
            </h1>

            <p className="text-sm md:text-base text-emerald-200/70 max-w-xl mx-auto font-medium">
              {isEn ? "Search answers or connect with an agronomic support advisor." : "Trouvez des réponses instantanées dans notre FAQ ou échangez avec un conseiller."}
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="max-w-7xl mx-auto px-6 pb-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <div
                  key={i}
                  className="rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-6 shadow-xl hover:border-emerald-500/40 transition-all"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-950/60 border border-emerald-800/30 text-emerald-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-white mt-4">{cat.title}</h3>
                  <p className="text-xs text-emerald-200/60 mt-1.5 leading-relaxed font-medium">{cat.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
