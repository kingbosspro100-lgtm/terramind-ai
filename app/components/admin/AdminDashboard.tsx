import Link from "next/link";

const cards = [
  {
    title: "Utilisateurs",
    value: "—",
    href: "/admin/utilisateurs",
    description: "Utilisateurs inscrits",
  },
  {
    title: "MRR",
    value: "— FCFA",
    href: "/admin/revenus",
    description: "Revenus récurrents mensuels",
  },
  {
    title: "Churn",
    value: "— %",
    href: "/admin/analytics",
    description: "Taux de désabonnement",
  },
  {
    title: "CAC",
    value: "— FCFA",
    href: "/admin/analytics",
    description: "Coût d'acquisition client",
  },
  {
    title: "LTV",
    value: "— FCFA",
    href: "/admin/analytics",
    description: "Valeur vie client",
  },
  {
    title: "LTV / CAC",
    value: "—",
    href: "/admin/analytics",
    description: "Objectif : ≥ 3",
  },
];

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-emerald-400">
            TerraMind AI
          </p>

          <h1 className="text-3xl font-bold">
            Administration
          </h1>

          <p className="mt-2 text-slate-400">
            Vue globale de la plateforme et de ses performances.
          </p>
        </div>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-emerald-400/40 hover:bg-white/[0.07]"
            >
              <p className="text-sm text-slate-400">
                {card.title}
              </p>

              <p className="mt-3 text-3xl font-bold">
                {card.value}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                {card.description}
              </p>

              <div className="mt-5 text-sm font-medium text-emerald-400 opacity-0 transition group-hover:opacity-100">
                Voir les détails →
              </div>
            </Link>
          ))}
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          <Link
            href="/admin/utilisateurs"
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.06]"
          >
            <h2 className="font-semibold">Gestion utilisateurs</h2>
            <p className="mt-2 text-sm text-slate-400">
              Consulter les utilisateurs et leurs abonnements.
            </p>
          </Link>

          <Link
            href="/admin/revenus"
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.06]"
          >
            <h2 className="font-semibold">Revenus</h2>
            <p className="mt-2 text-sm text-slate-400">
              Suivre les revenus et les abonnements.
            </p>
          </Link>

          <Link
            href="/admin/analytics"
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.06]"
          >
            <h2 className="font-semibold">Analytics</h2>
            <p className="mt-2 text-sm text-slate-400">
              MRR, churn, CAC, LTV et santé économique.
            </p>
          </Link>
        </section>
      </div>
    </main>
  );
}