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
