import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/services/admin";
import { getAdminAnalytics } from "@/services/adminData";

const EMPTY_ANALYTICS = {
  users: { total: 0, free: 0, pro: 0, enterprise: 0, paying: 0 },
  revenue: { total: 0, mrr: 0, arpu: 0 },
  acquisition: { totalExpenses: 0, cac: 0 },
  churn: { rate: 0, cancelled: 0 },
  ltv: { value: 0, ratio: 0, healthy: true },
  subscriptions: { active: 0, total: 0 },
};

const ADMIN_LINKS = [
  { href: "/admin/utilisateurs", label: "Utilisateurs", detail: "Profils et activité" },
  { href: "/admin/revenus", label: "Revenus", detail: "Paiements et abonnements" },
  { href: "/admin/analytics", label: "Analytics", detail: "Tendances et croissance" },
  { href: "/admin/avis", label: "Avis", detail: "Retours des utilisateurs" },
  { href: "/admin/markets", label: "Prix des marchés", detail: "Importer les relevés" },
] as const;

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/dashboard");

  let analytics = EMPTY_ANALYTICS;
  let analyticsUnavailable = false;

  try {
    analytics = await getAdminAnalytics();
  } catch (error) {
    console.error("Chargement des statistiques admin impossible:", error);
    analyticsUnavailable = true;
  }

  const money = (value: number) => `${Math.round(value).toLocaleString("fr-FR")} FCFA`;
  const metrics = [
    { label: "Utilisateurs", value: analytics.users.total.toLocaleString("fr-FR"), detail: `${analytics.users.paying} comptes payants` },
    { label: "Revenus confirmés", value: money(analytics.revenue.total), detail: "Paiements enregistrés" },
    { label: "Revenu mensuel récurrent", value: money(analytics.revenue.mrr), detail: `${analytics.subscriptions.active} abonnements actifs` },
    { label: "Résiliations", value: `${(analytics.churn.rate * 100).toFixed(1)}%`, detail: `${analytics.churn.cancelled} comptes` },
  ];

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-emerald-400">TerraMind AI</p>
            <h1 className="mt-1 text-3xl font-bold">Administration</h1>
            <p className="mt-2 text-sm text-slate-400">Vue de l’activité et des données enregistrées.</p>
          </div>
          <Link href="/dashboard" className="w-fit rounded-lg border border-white/15 px-4 py-2 text-sm text-slate-200 hover:bg-white/5">
            Retour au dashboard
          </Link>
        </header>

        {analyticsUnavailable && (
          <p role="status" className="mt-6 rounded-xl border border-amber-700/40 bg-amber-950/30 px-4 py-3 text-sm text-amber-100">
            Les statistiques ne sont pas disponibles pour le moment. Les indicateurs affichent zéro; vérifie la configuration Supabase serveur.
          </p>
        )}

        <section aria-label="Indicateurs principaux" className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <article key={metric.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="text-sm text-slate-400">{metric.label}</h2>
              <p className="mt-3 text-2xl font-bold text-white">{metric.value}</p>
              <p className="mt-2 text-xs text-slate-500">{metric.detail}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {ADMIN_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-emerald-500/40 hover:bg-white/[0.05]">
              <h2 className="font-semibold text-white">{item.label}</h2>
              <p className="mt-2 text-sm text-slate-400">{item.detail}</p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
