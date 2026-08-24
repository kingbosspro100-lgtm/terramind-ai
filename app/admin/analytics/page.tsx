import { redirect } from "next/navigation";
import { isAdmin } from "@/services/admin";
import {
  getAdminAnalytics,
  getMonthlyMRR,
  getMonthlyGrowth,
  getMonthlyChurn,
} from "@/services/adminAnalytics";

export default async function AdminAnalyticsPage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/dashboard");
  }

  const analytics = await getAdminAnalytics();
const monthlyMRR = await getMonthlyMRR(6);
const monthlyGrowth = await getMonthlyGrowth(6);
const monthlyChurn = await getMonthlyChurn(6);
  const money = (value: number) =>
    `${Math.round(value).toLocaleString("fr-FR")} FCFA`;

  const percent = (value: number) =>
    `${(value * 100).toFixed(2)}%`;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* HEADER */}

        <a
          href="/admin"
          className="text-sm text-emerald-400 hover:text-emerald-300"
        >
          ← Administration
        </a>

        <div className="mt-6">
          <p className="text-sm font-medium text-emerald-400">
            TerraMind AI
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Analytics
          </h1>

          <p className="mt-2 text-slate-400">
            Analyse des performances économiques de la
            plateforme.
          </p>
        </div>

        {/* FINANCIAL METRICS */}

        <section className="mt-10">
          <h2 className="text-lg font-semibold">
            Métriques financières
          </h2>

          <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

            {/* MRR */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm text-slate-400">
                MRR
              </p>

              <p className="mt-3 text-3xl font-bold text-emerald-400">
                {money(analytics.revenue.mrr)}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Revenus récurrents mensuels
              </p>
            </div>

            {/* ARPU */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm text-slate-400">
                ARPU
              </p>

              <p className="mt-3 text-3xl font-bold">
                {money(analytics.revenue.arpu)}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Revenu moyen par client payant
              </p>
            </div>

            {/* CAC */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm text-slate-400">
                CAC
              </p>

              <p className="mt-3 text-3xl font-bold">
                {money(
                  analytics.acquisition.cac
                )}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Coût moyen d'acquisition
              </p>
            </div>

            {/* LTV */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm text-slate-400">
                LTV
              </p>

              <p className="mt-3 text-3xl font-bold">
                {money(analytics.ltv.value)}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Valeur vie client estimée
              </p>
            </div>

          </div>
        </section>

        {/* UNIT ECONOMICS */}

        <section className="mt-10">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">

            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <p className="text-sm text-slate-400">
                  Unit Economics
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  LTV / CAC
                </h2>

                <p className="mt-2 max-w-2xl text-sm text-slate-500">
                  Le ratio indique combien de valeur
                  client est générée pour chaque FCFA
                  dépensé en acquisition.
                </p>
              </div>

              <div className="text-left lg:text-right">

                <p
                  className={`text-5xl font-black ${
                    analytics.ltv.healthy
                      ? "text-emerald-400"
                      : "text-orange-400"
                  }`}
                >
                  {analytics.ltv.ratio.toFixed(2)}x
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  Objectif : ≥ 3x
                </p>

              </div>

            </div>

            {/* SCALE */}

            <div className="mt-8">

              <div className="h-4 overflow-hidden rounded-full bg-white/10">

                <div
                  className={`h-full rounded-full transition-all ${
                    analytics.ltv.healthy
                      ? "bg-emerald-400"
                      : "bg-orange-400"
                  }`}
                  style={{
                    width: `${Math.min(
                      (analytics.ltv.ratio / 5) * 100,
                      100
                    )}%`,
                  }}
                />

              </div>

              <div className="mt-3 flex justify-between text-xs text-slate-500">
                <span>0x</span>
                <span>1x</span>
                <span>2x</span>
                <span>3x</span>
                <span>5x+</span>
              </div>

            </div>

            {/* STATUS */}

            <div
              className={`mt-8 rounded-2xl border p-5 ${
                analytics.ltv.healthy
                  ? "border-emerald-400/20 bg-emerald-400/5"
                  : "border-orange-400/20 bg-orange-400/5"
              }`}
            >

              <p className="font-semibold">
                {analytics.ltv.healthy
                  ? "🟢 Économie saine"
                  : "🟠 Ratio à améliorer"}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                {analytics.ltv.healthy
                  ? "La valeur générée par les clients dépasse suffisamment le coût d'acquisition."
                  : "Le ratio LTV/CAC est inférieur à l'objectif de 3x. Il faut améliorer la rétention, le revenu moyen ou réduire le coût d'acquisition."}
              </p>

            </div>

          </div>
        </section>

        {/* CUSTOMER METRICS */}

        <section className="mt-10">

          <h2 className="text-lg font-semibold">
            Clients & abonnements
          </h2>

          <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm text-slate-400">
                Utilisateurs
              </p>

              <p className="mt-3 text-3xl font-bold">
                {analytics.users.total}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm text-slate-400">
                Clients payants
              </p>

              <p className="mt-3 text-3xl font-bold text-emerald-400">
                {analytics.users.paying}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm text-slate-400">
                Abonnements actifs
              </p>

              <p className="mt-3 text-3xl font-bold">
                {analytics.subscriptions.active}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm text-slate-400">
                Churn
              </p>

              <p className="mt-3 text-3xl font-bold">
                {percent(
                  analytics.churn.rate
                )}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                {analytics.churn.cancelled} résiliation(s)
              </p>
            </div>

          </div>

        </section>

        {/* ACQUISITION */}

        <section className="mt-10">

          <h2 className="text-lg font-semibold">
            Acquisition
          </h2>

          <div className="mt-4 grid gap-5 md:grid-cols-2">

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

              <p className="text-sm text-slate-400">
                Dépenses d'acquisition
              </p>

              <p className="mt-3 text-3xl font-bold">
                {money(
                  analytics.acquisition.totalExpenses
                )}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Total enregistré dans acquisition_expenses
              </p>

            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

              <p className="text-sm text-slate-400">
                CAC
              </p>

              <p className="mt-3 text-3xl font-bold">
                {money(
                  analytics.acquisition.cac
                )}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Dépenses d'acquisition ÷ clients payants
              </p>
<section className="mt-10">

  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">

    <div>
      <p className="text-sm text-slate-400">
        Évolution
      </p>

      <h2 className="mt-1 text-2xl font-bold">
        MRR mensuel
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Évolution réelle des revenus récurrents
        mensuels sur les 6 derniers mois.
      </p>
    </div>

    <div className="mt-8 space-y-4">

      {monthlyMRR.map((item) => (
        <div
          key={item.month}
          className="flex items-center gap-4"
        >

          <div className="w-28 shrink-0 text-sm text-slate-400">
            {item.month}
          </div>

          <div className="h-8 flex-1 overflow-hidden rounded-lg bg-white/5">

            <div
              className="h-full rounded-lg bg-emerald-400"
              style={{
                width: `${
                  monthlyMRR.length > 0
                    ? Math.min(
                        (item.mrr /
                          Math.max(
                            ...monthlyMRR.map(
                              (m) => m.mrr
                            ),
                            1
                          )) *
                          100,
                        100
                      )
                    : 0
                }%`,
              }}
            />

          </div>

          <div className="w-36 text-right text-sm font-semibold">
            {Math.round(
              item.mrr
            ).toLocaleString("fr-FR")}{" "}
            FCFA
          </div>

        </div>
      ))}

    </div>

  </div>

</section>
<section className="mt-10">

  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">

    <div>
      <p className="text-sm text-slate-400">
        Acquisition & rétention
      </p>

      <h2 className="mt-1 text-2xl font-bold">
        Croissance mensuelle
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Nouveaux clients et clients ayant résilié
        leur abonnement.
      </p>
    </div>

    <div className="mt-8 overflow-x-auto">

      <table className="w-full min-w-[650px] text-left">

        <thead className="border-b border-white/10 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-4">
              Mois
            </th>

            <th className="px-4 py-4">
              Nouveaux clients
            </th>

            <th className="px-4 py-4">
              Clients perdus
            </th>

            <th className="px-4 py-4">
              Croissance nette
            </th>

            <th className="px-4 py-4">
              MRR
            </th>
          </tr>
        </thead>

        <tbody>

          {monthlyGrowth.map((item) => {
            const netGrowth =
              item.newCustomers -
              item.churnedCustomers;

            return (
              <tr
                key={item.month}
                className="border-b border-white/5"
              >

                <td className="px-4 py-4 text-slate-300">
                  {item.month}
                </td>

                <td className="px-4 py-4 font-semibold text-emerald-400">
                  +{item.newCustomers}
                </td>

                <td className="px-4 py-4 font-semibold text-red-400">
                  -{item.churnedCustomers}
                </td>

                <td
                  className={`px-4 py-4 font-bold ${
                    netGrowth >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {netGrowth >= 0 ? "+" : ""}
                  {netGrowth}
                </td>

                <td className="px-4 py-4 font-semibold">
                  {Math.round(
                    item.mrr
                  ).toLocaleString("fr-FR")}{" "}
                  FCFA
                </td>

              </tr>
            );
          })}

        </tbody>

      </table>

    </div>

  </div>

</section>
<section className="mt-10">

  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">

    <div>
      <p className="text-sm text-slate-400">
        Rétention
      </p>

      <h2 className="mt-1 text-2xl font-bold">
        Churn mensuel
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Pourcentage des clients actifs au début
        du mois qui ont résilié pendant ce mois.
      </p>
    </div>

    <div className="mt-8 overflow-x-auto">

      <table className="w-full min-w-[700px] text-left">

        <thead className="border-b border-white/10 text-xs uppercase text-slate-500">

          <tr>
            <th className="px-4 py-4">
              Mois
            </th>

            <th className="px-4 py-4">
              Clients début
            </th>

            <th className="px-4 py-4">
              Résiliations
            </th>

            <th className="px-4 py-4">
              Churn
            </th>

            <th className="px-4 py-4">
              Statut
            </th>
          </tr>

        </thead>

        <tbody>

          {monthlyChurn.map((item) => {

            const healthy =
              item.churnRate <= 0.05;

            return (
              <tr
                key={item.month}
                className="border-b border-white/5"
              >

                <td className="px-4 py-4 text-slate-300">
                  {item.month}
                </td>

                <td className="px-4 py-4">
                  {item.startingCustomers}
                </td>

                <td className="px-4 py-4 text-red-400">
                  {item.cancelledCustomers}
                </td>

                <td
                  className={`px-4 py-4 text-lg font-bold ${
                    healthy
                      ? "text-emerald-400"
                      : "text-orange-400"
                  }`}
                >
                  {(item.churnRate * 100).toFixed(2)}%
                </td>

                <td className="px-4 py-4">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      healthy
                        ? "bg-emerald-400/10 text-emerald-400"
                        : "bg-orange-400/10 text-orange-400"
                    }`}
                  >
                    {healthy
                      ? "Sain"
                      : "À surveiller"}
                  </span>

                </td>

              </tr>
            );

          })}

        </tbody>

      </table>

    </div>

  </div>

</section>
            </div>

          </div>

        </section>

      </div>
    </main>
  );
}