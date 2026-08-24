"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { TrendingUp, BarChart3 } from "lucide-react";

export type ChartDataItem = {
  month: string;
  income: number;
  expense: number;
  balance?: number;
};

type Props = {
  data: ChartDataItem[];
};

const formatFCFA = (val: number) => `${Math.round(val).toLocaleString("fr-FR")} FCFA`;

export default function FinanceChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-3xl bg-[#0A100C] border border-dashed border-emerald-900/50 p-12 text-center shadow-xl flex flex-col items-center justify-center space-y-3">
        <div className="p-4 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
          <BarChart3 className="h-8 w-8" />
        </div>
        <p className="text-sm font-bold text-white">
          Aucune donnée financière disponible pour le moment.
        </p>
        <p className="text-xs text-emerald-200/60 max-w-md">
          Enregistrez vos premières recettes et dépenses dans l'historique ci-dessous pour visualiser votre évolution mensuelle réelle.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-emerald-900/30 bg-gradient-to-b from-[#181436] to-[#050A07] p-6 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            Évolution Financière Mensuelle
          </h2>
          <p className="mt-1 text-xs text-emerald-200/70">
            Revenus, dépenses et solde net calculés à partir de vos transactions réelles.
          </p>
        </div>
      </div>

      <div className="w-full h-[360px] pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#10b981" strokeOpacity={0.15} />
            <XAxis
              dataKey="month"
              stroke="#a7f3d0"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: "#065f46", strokeOpacity: 0.4 }}
            />
            <YAxis
              stroke="#a7f3d0"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#065f46", strokeOpacity: 0.4 }}
              tickFormatter={(v) => `${(v / 1000).toLocaleString("fr-FR")}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0F172A",
                borderColor: "#10b981",
                borderRadius: "16px",
                color: "#ffffff",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
              }}
              formatter={(value: any, name: any) => [
                formatFCFA(Number(value) || 0),
                name === "income" ? "Revenus" : name === "expense" ? "Dépenses" : "Solde",
              ]}
              labelStyle={{ color: "#34d399", fontWeight: "bold", marginBottom: "4px" }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "16px" }}
              formatter={(value) => {
                if (value === "income") return <span className="text-xs font-semibold text-emerald-400">Revenus</span>;
                if (value === "expense") return <span className="text-xs font-semibold text-red-400">Dépenses</span>;
                return <span className="text-xs font-semibold text-blue-400">Solde Net</span>;
              }}
            />
            <Line
              type="monotone"
              dataKey="income"
              name="income"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 5, fill: "#10b981" }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              name="expense"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ r: 5, fill: "#ef4444" }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="balance"
              name="balance"
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 4, fill: "#3b82f6" }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}