import { redirect } from "next/navigation";
import { createClient } from "@/lib/server";
import { getTransactions, getMonthlyFinanceEvolution } from "@/services/finance-server";

import TransactionForm from "@/app/components/TransactionForm";
import TransactionCard from "@/app/components/TransactionCard";
import FinanceChart from "@/app/components/finance/FinanceChart";

import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Sparkles,
  BarChart3,
} from "lucide-react";

import { getCurrentUser } from "@/lib/auth-helper";

export default async function FinancePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const transactions = await getTransactions();
  const chartData = await getMonthlyFinanceEvolution();

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  let farms: any[] = [];
  try {
    const { data } = await supabase
      .from("farms")
      .select("id, name")
      .eq("user_id", user.id);
    if (data) farms = data;
  } catch (e) {
    console.error("Finance farms fetch error:", e);
  }

  return (
    <main className="space-y-8 max-w-7xl mx-auto pb-16 text-white">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-emerald-900/30 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3 py-1 text-[11px] font-semibold text-emerald-300 mb-3">
            <Wallet className="h-3 w-3 text-emerald-400" />
            <span>Gestion Financière</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Performances Économiques
          </h1>
          <p className="mt-1 text-sm text-emerald-200/70 max-w-2xl font-medium">
            Analysez vos revenus, optimisez vos dépenses et accédez aux prévisions de rentabilité générées par l'IA.
          </p>
        </div>

        {farms.length === 0 && (
          <div className="inline-flex items-center rounded-2xl bg-amber-950/40 border border-amber-900/40 px-4 py-2.5 text-xs text-amber-400 font-bold">
            Créez une exploitation d'abord
          </div>
        )}
      </div>




      {/* KPI Grid */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Revenus", value: `${totalIncome.toLocaleString()} FCFA`, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-900/20", border: "border-emerald-800/30" },
          { label: "Dépenses", value: `${totalExpense.toLocaleString()} FCFA`, icon: TrendingDown, color: "text-red-400", bg: "bg-red-900/20", border: "border-red-800/30" },
          { label: "Bénéfice Net", value: `${balance.toLocaleString()} FCFA`, icon: PiggyBank, color: "text-blue-400", bg: "bg-blue-900/20", border: "border-blue-800/30" },
          { label: "Transactions", value: transactions.length.toString(), icon: Wallet, color: "text-amber-400", bg: "bg-amber-900/20", border: "border-amber-800/30" }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-6 shadow-2xl relative overflow-hidden group hover:border-emerald-500/40 transition">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-600/5 rounded-full blur-2xl group-hover:bg-emerald-600/10 transition-all duration-500"></div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/60">{kpi.label}</p>
                <div className={`p-2.5 rounded-xl ${kpi.bg} border ${kpi.border} ${kpi.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                {kpi.value}
              </h3>
            </div>
          )
        })}
      </div>

      {/* Graphique d'Évolution Financière */}
      <div className="rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-400" />
            Évolution Financière
          </h2>
        </div>
        <FinanceChart data={chartData} />
      </div>

      {/* Liste Transactions */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white border-b border-emerald-900/30 pb-4">
          📋 Historique des Transactions
        </h2>

        {transactions.length === 0 ? (
          <div className="rounded-3xl bg-[#0A100C] border border-dashed border-emerald-900/50 p-12 text-center shadow-xl">
            <div className="text-5xl mb-4">💳</div>
            <p className="text-sm font-bold text-white">Aucune transaction enregistrée.</p>
            <p className="text-xs text-emerald-200/60 mt-1">Saisissez vos premières dépenses pour activer les graphiques.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {transactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>
        )}
      </div>

      {/* Ajout d'une Transaction en bas de page */}
      <div className="pt-8 mt-8 border-t border-emerald-900/30">
        <h2 className="text-xl font-bold text-white mb-6">➕ Nouvelle Transaction</h2>
        {farms.length > 0 ? (
          <TransactionForm farmId={farms[0].id} />
        ) : (
          <div className="rounded-3xl bg-[#0A100C] border border-dashed border-emerald-900/50 p-8 text-center">
            <p className="text-sm font-bold text-amber-400">Veuillez créer une exploitation avant d'ajouter une transaction.</p>
          </div>
        )}
      </div>
    </main>
  );
}