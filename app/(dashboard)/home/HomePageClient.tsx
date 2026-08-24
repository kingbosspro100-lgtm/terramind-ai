"use client";

import Link from "next/link";
import { Bot, CloudSun, House, LayoutDashboard, Package, Settings, Sprout, Tractor, Wallet } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function HomePageClient({ userName }: { userName: string }) {
  const { language, t } = useLanguage();

  const modules = [
    { href: "/dashboard", icon: LayoutDashboard, title: t.navDashboard, description: language === "en" ? "Overview of key metrics and recent farm activity." : "Visualisez vos indicateurs essentiels et l'activité récente." },
    { href: "/farms", icon: Tractor, title: t.navFarms, description: language === "en" ? "Manage your farms, plots, and field data." : "Organisez vos fermes, parcelles et informations de terrain." },
    { href: "/crops", icon: Sprout, title: t.navCrops, description: language === "en" ? "Track plantings, growth, harvest, and crop analytics." : "Suivez les semis, la croissance, les récoltes et les analyses." },
    { href: "/weather", icon: CloudSun, title: t.navWeather, description: language === "en" ? "Check precision forecasts, alerts, and recommended actions." : "Consultez les prévisions, alertes et actions recommandées." },
    { href: "/stock", icon: Package, title: t.navStock, description: language === "en" ? "Manage seeds, fertilizers, equipment, and low stock alerts." : "Gérez vos semences, engrais, matériels et seuils d'alerte." },
    { href: "/finance", icon: Wallet, title: t.navFinance, description: language === "en" ? "Track revenue, expenses, and farm profitability." : "Contrôlez revenus, dépenses et rentabilité de l'exploitation." },
    { href: "/ai", icon: Bot, title: t.navAI, description: language === "en" ? "Ask questions and get expert agronomic AI advice." : "Posez vos questions et obtenez des conseils agronomiques." },
    { href: "/settings", icon: Settings, title: t.navSettings, description: language === "en" ? "Customize your account, alert preferences, and quotas." : "Personnalisez votre compte, vos alertes et vos préférences." },
  ];

  return (
    <main className="mx-auto max-w-7xl space-y-10 pb-16 text-white">
      <section className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-[#181436] via-[#0B130E] to-[#050A07] p-7 shadow-2xl md:p-10">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3 py-1 text-[11px] font-bold text-emerald-300">
            <House className="h-3.5 w-3.5" />
            {t.welcomeUser}
          </div>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight md:text-5xl">
            {language === "en" ? `Welcome ${userName}, your farm clearer. Your decisions, more peaceful.` : `Bonjour ${userName}, votre exploitation plus claire. Vos décisions plus sereines.`}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-emerald-100/80">
            {t.homeSubtitle}
          </p>
          <Link href="/dashboard" className="mt-7 inline-flex items-center rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 transition hover:opacity-90">
            {language === "en" ? "Open Dashboard" : "Ouvrir mon dashboard"}
          </Link>
        </div>
      </section>

      <section>
        <div className="max-w-3xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-400">
            TerraMind AI Guide
          </p>
          <h2 className="mt-3 text-2xl font-extrabold md:text-3xl">
            {language === "en" ? "Everything you can do in TerraMind AI" : "Tout ce que vous pouvez faire dans TerraMind"}
          </h2>
          <p className="mt-2 text-sm text-emerald-200/70">
            {language === "en" ? "Access each module directly and discover its features." : "Accédez directement à chaque module et découvrez son utilité."}
          </p>
        </div>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map(({ href, icon: Icon, title, description }) => (
            <Link key={href} href={href} className="group rounded-3xl border border-emerald-900/30 bg-gradient-to-b from-[#181436] to-[#050A07] p-6 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-emerald-950/30">
              <div className="inline-flex rounded-2xl border border-emerald-500/20 bg-emerald-950/50 p-3 text-emerald-400 transition group-hover:bg-emerald-500 group-hover:text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-emerald-100/70">{description}</p>
              <span className="mt-5 block text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                {language === "en" ? "Explore module →" : "Découvrir le module →"}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
