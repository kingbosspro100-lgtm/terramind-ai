import { redirect } from "next/navigation";
import { isAdmin } from "@/services/admin";
import { getAdminAnalytics } from "@/services/adminAnalytics";

export default async function AdminPage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/dashboard");
  }

  const analytics = await getAdminAnalytics();

  const formatMoney = (value: number) =>
    `${Math.round(value).toLocaleString("fr-FR")} FCFA`;

  const formatPercent = (value: number) =>
    `${(value * 100).toFixed(2)}%`;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* HEADER */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-400">
              TerraMind AI
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Administration
            </h1>

            <p className="mt-2 text-slate-400">
              Vue globale de l'activité de la plateforme.
            </p>
          </div>

          <a
            href="/dashboard"
            className="w-fit rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5"
          >
            ← Retour au dashboard
          </a>
        </div>

        {/* BUSINESS KPIs */}

        <section className="mt-10">

          <h2 className="text-lg font-semibold">
            Performance financière
          </h2>

          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {/* MRR */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm text-slate-400">
                MRR
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-400">
                {formatMoney(analytics.revenue.mrr)}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Revenus récurrents mensuels
              </p>
            </div>

            {/* REVENUE */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm text-slate-400">
                Revenus totaux
              </p>

              <p className="mt-2 text-2xl font-bold">
                {formatMoney(
                  analytics.revenue.total
                )}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Paiements confirmés
              </p>
            </div>

            {/* CAC */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm text-slate-400">
                CAC
              </p>

              <p className="mt-2 text-2xl font-bold">
                {formatMoney(
                  analytics.acquisition.cac
                )}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Coût d'acquisition client
              </p>
            </div>

            {/* LTV */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm text-slate-400">
                LTV
              </p>

              <p className="mt-2 text-2xl font-bold">
                {formatMoney(
                  analytics.ltv.value
                )}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Valeur vie client estimée
              </p>
            </div>

          </div>
        </section>

        {/* GROWTH */}

        <section className="mt-10">

          <h2 className="text-lg font-semibold">
            Croissance
          </h2>

          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {/* USERS */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm text-slate-400">
                Utilisateurs
              </p>

              <p className="mt-2 text-3xl font-bold">
                {analytics.users.total}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Tous les comptes
              </p>
            </div>

            {/* PAYING */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm text-slate-400">
                Clients payants
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-400">
                {analytics.users.paying}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Abonnements actifs
              </p>
            </div>

            {/* SUBSCRIPTIONS */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm text-slate-400">
                Abonnements actifs
              </p>

              <p className="mt-2 text-3xl font-bold">
                {analytics.subscriptions.active}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Sur {analytics.subscriptions.total} au total
              </p>
            </div>

            {/* CHURN */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm text-slate-400">
                Churn
              </p>

              <p className="mt-2 text-3xl font-bold">
                {formatPercent(
                  analytics.churn.rate
                )}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                {analytics.churn.cancelled} résiliation(s)
              </p>
            </div>

          </div>
        </section>

        {/* LTV / CAC */}

        <section className="mt-10">

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

              <div>
                <p className="text-sm text-slate-400">
                  Unit Economics
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  LTV / CAC
                </h2>

                <p className="mt-2 max-w-xl text-sm text-slate-500">
                  Mesure combien de valeur TerraMind
                  génère par rapport au coût nécessaire
                  pour acquérir un client.
                </p>
              </div>

              <div className="text-left md:text-right">

                <p
                  className={`text-5xl font-bold ${
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

            <div className="mt-8 h-3 overflow-hidden rounded-full bg-white/10">

              <div
                className={`h-full rounded-full ${
                  analytics.ltv.healthy
                    ? "bg-emerald-400"
                    : "bg-orange-400"
                }`}
                style={{
                  width: `${Math.min(
                    analytics.ltv.ratio * 20,
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

        </section>

        {/* PLANS */}

        <section className="mt-10">

          <h2 className="text-lg font-semibold">
            Répartition des utilisateurs
          </h2>

          <div className="mt-4 grid gap-5 md:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm text-slate-400">
                Free
              </p>

              <p className="mt-2 text-3xl font-bold">
                {analytics.users.free}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm text-slate-400">
                Pro
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-400">
                {analytics.users.pro}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm text-slate-400">
                Enterprise
              </p>

              <p className="mt-2 text-3xl font-bold">
                {analytics.users.enterprise}
              </p>
            </div>

          </div>

        </section>

        {/* NAVIGATION */}

        <section className="mt-10 grid gap-4 md:grid-cols-4">

          <a
            href="/admin/revenus"
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-emerald-400/30 hover:bg-white/[0.05]"
          >
            <p className="font-semibold">
              💰 Revenus détaillés
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Consulter toutes les transactions.
            </p>
          </a>

          <a
            href="/admin/analytics"
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-emerald-400/30 hover:bg-white/[0.05]"
          >
            <p className="font-semibold">
              📊 Analytics
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Analyser les performances de TerraMind.
            </p>
          </a>

          <a
            href="/admin/avis"
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-emerald-400/30 hover:bg-white/[0.05]"
          >
            <p className="font-semibold">
              💬 Avis & Témoignages
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Gérer les retours communauté.
            </p>
          </a>

          <a
            href="/dashboard"
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-emerald-400/30 hover:bg-white/[0.05]"
          >
            <p className="font-semibold">
              🌾 Dashboard utilisateur
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Retourner à l'application.
            </p>
          </a>

        </section>

      </div>
    </main>
  );
}