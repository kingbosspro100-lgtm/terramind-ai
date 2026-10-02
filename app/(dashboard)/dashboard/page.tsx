import Link from "next/link";
import { CloudSun, ChartNoAxesCombined, Store } from "lucide-react";
import KpiGrid from "@/app/components/dashboard/KpiGrid";
import ChartsSection from "@/app/components/dashboard/ChartsSection";
import AnalyticGauge from "@/app/components/dashboard/AnalyticGauge";
import WeatherOverview from "@/app/components/dashboard/WeatherOverview";
import AIOverview from "@/app/components/dashboard/AIOverview";
import RecentActivity from "@/app/components/dashboard/RecentActivity";
import QuickActions from "@/app/components/dashboard/QuickActions";
import { getDashboardStats } from "@/services/dashboard";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">

      {/* Row 1: Agricultural KPI Cards */}
      <KpiGrid
        totalFarms={stats?.totalFarms ?? 0}
        totalCrops={stats?.totalCrops ?? 0}
        totalArea={stats?.totalArea ?? 0}
        totalCities={stats?.totalCities ?? 0}
      />

      {/* Row 2: Charts & Analytics */}
      <section className="grid gap-6 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-7 xl:col-span-8">
          <ChartsSection transactions={stats?.transactionsData ?? []} />
        </div>

        <div className="lg:col-span-5 xl:col-span-4">
          <AnalyticGauge
            transactions={stats?.transactionsData ?? []}
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Météo", href: "/dashboard/weather", description: "Conditions et alertes", icon: CloudSun, tint: "from-brand-cyan/20 to-brand-blue/5" },
          { title: "Prix des marchés", href: "/dashboard/markets", description: "Relevés par pays", icon: ChartNoAxesCombined, tint: "from-brand-gold/20 to-brand-pink/5" },
          { title: "TerraMind Store", href: "/dashboard/store", description: "Produits et ventes", icon: Store, tint: "from-brand-purple/20 to-brand-pink/5" },
        ].map(({ title, href, description, icon: Icon, tint }) => (
          <Link
            key={title}
            href={href}
            className={`group rounded-xl border border-white/10 bg-gradient-to-br ${tint} p-4 text-white shadow-lg shadow-black/25 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-brand-cyan/40`}
          >
            <div className="flex items-center justify-between">
              <div className="rounded-xl border border-white/10 bg-brand-dark/70 p-2.5 text-brand-cyan">
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Accès</span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">{title}</h3>
            <p className="mt-1 text-sm text-slate-300">{description}</p>
          </Link>
        ))}
      </section>

      {/* Row 3: Weather & AI */}
      <section className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <WeatherOverview />
        </div>

        <div className="lg:col-span-7">
          <AIOverview />
        </div>
      </section>

      {/* Row 4: Actions & Activity */}
      <section className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <QuickActions />
        </div>

        <div className="lg:col-span-6">
          <RecentActivity
            activities={stats?.recentActivities ?? []}
          />
        </div>
      </section>

    </div>
  );
}
