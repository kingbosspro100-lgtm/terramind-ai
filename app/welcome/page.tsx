"use client";

import Link from "next/link";
import Logo from "../components/ui/Logo";
import {
  Sparkles,
  CloudSun,
  Sprout,
  Package,
  Wallet,
  ArrowRight,
  Bot,
  ShieldCheck,
} from "lucide-react";

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-[#0B0914] text-white flex flex-col justify-between p-6 md:p-12 relative overflow-hidden selection:bg-emerald-600 selection:text-white">
      {/* Glow Backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-teal-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between relative z-10">
        <Link href="/" className="flex items-center gap-3">
          <Logo width={44} height={44} />
          <div>
            <h1
              className="text-2xl font-extrabold text-white tracking-tight"
              style={{ fontFamily: "'Times New Roman', Times, serif" }}
            >
              TerraMind <span className="text-emerald-400">AI</span>
            </h1>
            <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
              Smart Agriculture
            </p>
          </div>
        </Link>

        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-4 py-1.5 text-xs font-bold text-emerald-300">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Compte Activé</span>
        </div>
      </header>

      {/* Main Card */}
      <div className="max-w-4xl mx-auto w-full my-auto relative z-10 py-8">
        <div className="rounded-3xl bg-gradient-to-b from-[#181436] via-[#0E0C24] to-[#050A07] border border-emerald-900/40 p-8 md:p-14 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/70 px-4 py-1.5 text-xs font-extrabold text-emerald-300 shadow-md">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>Bienvenue dans l'Écosystème TerraMind</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              🎉 Félicitations & Bienvenue !
            </h1>

            <p className="text-sm md:text-base text-emerald-200/80 leading-relaxed font-medium">
              Votre compte d'exploitant agricole a été créé avec succès. Vous disposez désormais du copilot IA le plus performant pour piloter vos exploitations.
            </p>
          </div>

          {/* Module Highlights Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-4">
            <div className="rounded-2xl border border-emerald-900/30 bg-[#0A100C] p-5 space-y-3 hover:border-emerald-500/40 transition group">
              <div className="p-3 rounded-xl bg-blue-900/20 border border-blue-800/30 text-blue-400 w-fit">
                <CloudSun className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                Météo Pro & Radar
              </h3>
              <p className="text-xs text-emerald-200/60 leading-relaxed font-medium">
                Prévisions par commune et alertes pluviométriques en direct.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-900/30 bg-[#0A100C] p-5 space-y-3 hover:border-emerald-500/40 transition group">
              <div className="p-3 rounded-xl bg-emerald-900/20 border border-emerald-800/30 text-emerald-400 w-fit">
                <Sprout className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                Gestion des Parcelles
              </h3>
              <p className="text-xs text-emerald-200/60 leading-relaxed font-medium">
                Suivi complet du cycle de culture et santé des sols.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-900/30 bg-[#0A100C] p-5 space-y-3 hover:border-emerald-500/40 transition group">
              <div className="p-3 rounded-xl bg-amber-900/20 border border-amber-800/30 text-amber-400 w-fit">
                <Package className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                Stock & Logistique
              </h3>
              <p className="text-xs text-emerald-200/60 leading-relaxed font-medium">
                Inventaire, alertes de pénurie et codes QR de traçabilité.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-900/30 bg-[#0A100C] p-5 space-y-3 hover:border-emerald-500/40 transition group">
              <div className="p-3 rounded-xl bg-purple-900/20 border border-purple-800/30 text-purple-400 w-fit">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                TerraMind Copilot
              </h3>
              <p className="text-xs text-emerald-200/60 leading-relaxed font-medium">
                Conseils agronomiques certifiés et diagnostics photos.
              </p>
            </div>
          </div>

          {/* Call to Action Button */}
          <div className="pt-4 text-center">
            <Link
              href="/home"
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 px-10 py-5 text-base font-extrabold text-white shadow-2xl shadow-emerald-600/40 hover:scale-105 transition"
            >
              <span>Accéder au Tableau de Bord (Accueil)</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center text-xs text-emerald-300/50 relative z-10">
        © {new Date().getFullYear()} TerraMind AI. Tous droits réservés.
      </footer>
    </main>
  );
}