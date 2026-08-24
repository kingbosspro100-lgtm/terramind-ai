"use client";

import PublicHeader from "@/app/components/landing/PublicHeader";
import Footer from "@/app/components/landing/Footer";
import { useLanguage } from "@/lib/language-context";
import { ShieldCheck, Lock, Eye, Database, UserCheck, Mail } from "lucide-react";

export default function PrivacyPolicyPage() {
  const { publicLanguage } = useLanguage();
  const isEn = publicLanguage === "en";

  return (
    <div className="min-h-screen bg-[#0B0914] text-white flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
      {/* Top Header with Language Switcher */}
      <PublicHeader />

      {/* Main Content */}
      <main className="flex-1 pt-28 pb-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-12 px-6 text-center border-b border-emerald-900/20">
          <div className="max-w-3xl mx-auto relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-4 py-1.5 text-xs font-bold text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>{isEn ? "Data Protection & Privacy" : "Protection des données personnelles"}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              {isEn ? "Privacy Policy" : "Politique de Confidentialité"}
            </h1>

            <p className="text-xs text-emerald-200/70 max-w-xl mx-auto font-medium">
              {isEn
                ? "Last updated: January 2026. TerraMind AI protects farm data, photos, dictations, and seller transactions."
                : "Dernière mise à jour : Janvier 2026. TerraMind AI s'engage à protéger la vie privée et les données agricoles de ses utilisateurs."}
            </p>
          </div>
        </section>

        {/* Editorial Content */}
        <section className="max-w-4xl mx-auto px-6 py-12 space-y-8 text-emerald-200/80 font-medium">
          <div className="rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-8 shadow-2xl space-y-3">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-3">
              <Database className="h-5 w-5 text-emerald-400" />
              <span>1. {isEn ? "Data Collection" : "Collecte des Données"}</span>
            </h2>
            <p className="text-xs leading-relaxed">
              {isEn
                ? "We collect account data, farm parcel GPS coordinates, crop photo uploads for AI diagnosis, audio dictations, Chariow product listings, and weather radar telemetry."
                : "TerraMind AI collecte uniquement les données nécessaires au bon fonctionnement de la plateforme : coordonnées GPS, photos de cultures pour l'IA, dictée vocale, lots Chariow en vente et météo."}
            </p>
          </div>

          <div className="rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-8 shadow-2xl space-y-3">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-3">
              <Lock className="h-5 w-5 text-emerald-400" />
              <span>2. {isEn ? "Security & Encryption" : "Sécurité & Stockage"}</span>
            </h2>
            <p className="text-xs leading-relaxed">
              {isEn
                ? "All data is encrypted in transit and at rest using Supabase Auth security protocol. We never sell or share farm data with third parties."
                : "Toutes les données sont stockées de manière sécurisée (chiffrement TLS 1.3 / AES-256). TerraMind AI ne vend jamais vos données agricoles à des tiers."}
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
