import { redirect } from "next/navigation";
import { isAdmin } from "@/services/admin";
import { getAdminAnalytics } from "@/services/adminAnalytics";
import { createClient } from "@/lib/server";
import { AlertTriangle, TrendingUp, Users, DollarSign, PieChart, ShieldAlert } from "lucide-react";

type Payment = {
  id: string;
  amount: number | string | null;
  status: string | null;
  created_at: string | null;
  plan: string | null;
  payment_method: string | null;
  transaction_id: string | null;
};

export default async function AdminRevenuePage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/dashboard");
  }

  const supabase = await createClient();

  // 1. Récupération des analytics SaaS (MRR, Churn, CAC, LTV)
  let analytics: any = null;
  try {
    analytics = await getAdminAnalytics();
  } catch (err) {
    console.error("Erreur calcul analytics admin:", err);
  }

  // 2. Récupération des paiements
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("status", "paid")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur récupération paiements :", error);
  }

  const payments: Payment[] = (data ?? []) as Payment[];

  const totalRevenue = analytics?.revenue?.total ?? payments.reduce(
    (total: number, payment: Payment) => total + Number(payment.amount ?? 0),
    0
  );

  const mrr = analytics?.revenue?.mrr ?? 0;
  const cac = analytics?.acquisition?.cac ?? 0;
  const ltv = analytics?.ltv?.value ?? 0;
  const churnRate = (analytics?.churn?.rate ?? 0) * 100;
  const isLtvHealthy = analytics?.ltv?.healthy ?? true;
  const ltvCacRatio = analytics?.ltv?.ratio ?? (cac > 0 ? ltv / cac : 0);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 space-y-8">
        <div>
          <a href="/admin" className="text-sm text-emerald-400 hover:text-emerald-300 transition">
            ← Administration
          </a>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Revenus & Métriques SaaS Détaillés</h1>
          <p className="mt-2 text-sm text-slate-400">
            Suivi financier en temps réel : MRR, Churn, CAC, LTV et transactions de TerraMind AI.
          </p>
        </div>

        {/* Alerte Business si LTV <= 3 × CAC */}
        {!isLtvHealthy && (
          <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/80 to-red-950/60 p-5 shadow-2xl flex items-start gap-4">
            <div className="rounded-xl bg-amber-900/50 p-3 text-amber-400 shrink-0">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                Alerte Business : Ratio LTV / CAC Sous le Seuil de Rentabilité
              </h3>
              <p className="text-xs text-amber-200/90 mt-1 leading-relaxed">
                Le ratio LTV / CAC actuel est de <strong className="text-white font-mono">{ltvCacRatio.toFixed(2)}x</strong> (objectif minimum de rentabilité : <strong className="text-emerald-300 font-mono">&gt; 3.0x</strong>).
                Le coût d'acquisition client (CAC: {cac.toLocaleString("fr-FR")} FCFA) est trop élevé par rapport à la valeur de vie client (LTV: {ltv.toLocaleString("fr-FR")} FCFA).
              </p>
            </div>
          </div>
        )}

        {/* Grille des KPIs Financiers Principaux */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Revenus Totaux</span>
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-emerald-400">
              {totalRevenue.toLocaleString("fr-FR")} FCFA
            </p>
            <p className="text-[10px] text-slate-500">Total cumulé des paiements validés</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>MRR (Revenu Mensuel Récurrent)</span>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-emerald-400">
              {mrr.toLocaleString("fr-FR")} FCFA
            </p>
            <p className="text-[10px] text-slate-500">Basé sur les abonnements actifs</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Churn Rate (Taux d'attrition)</span>
              <AlertTriangle className="h-4 w-4 text-amber-400" />
            </div>
            <p className={`text-2xl font-bold ${churnRate > 5 ? "text-amber-400" : "text-white"}`}>
              {churnRate.toFixed(1)}%
            </p>
            <p className="text-[10px] text-slate-500">Pourcentage d'abonnements résiliés</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Ratio LTV / CAC</span>
              <PieChart className="h-4 w-4 text-purple-400" />
            </div>
            <p className={`text-2xl font-bold ${isLtvHealthy ? "text-emerald-400" : "text-amber-400"}`}>
              {ltvCacRatio.toFixed(2)}x
            </p>
            <p className="text-[10px] text-slate-500">LTV: {ltv.toFixed(0)} FCFA | CAC: {cac.toFixed(0)} FCFA</p>
          </div>
        </div>

        {/* Détails secondaires des métriques */}
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs text-slate-400">Transactions Réglées</p>
            <p className="mt-2 text-2xl font-bold text-white">{payments.length}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs text-slate-400">Abonnements Actifs</p>
            <p className="mt-2 text-2xl font-bold text-white">{analytics?.subscriptions?.active ?? 0}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs text-slate-400">Devise de Facturation</p>
            <p className="mt-2 text-2xl font-bold text-white">XOF (FCFA)</p>
          </div>
        </div>

        {/* Table des paiements et transactions réelles */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Historique des Transactions Supabase</h2>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="border-b border-white/10 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Plan</th>
                    <th className="px-6 py-4">Méthode</th>
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        Aucune transaction enregistrée dans Supabase.
                      </td>
                    </tr>
                  ) : (
                    payments.map((payment: Payment) => (
                      <tr key={payment.id} className="border-b border-white/5 transition hover:bg-white/[0.03]">
                        <td className="px-6 py-4 text-slate-400">
                          {payment.created_at
                            ? new Date(payment.created_at).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </td>
                        <td className="px-6 py-4 font-semibold text-white uppercase">{payment.plan ?? "—"}</td>
                        <td className="px-6 py-4 text-slate-300">{payment.payment_method ?? "—"}</td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{payment.transaction_id ?? "—"}</td>
                        <td className="px-6 py-4 font-bold text-emerald-400">
                          {Number(payment.amount ?? 0).toLocaleString("fr-FR")} FCFA
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}