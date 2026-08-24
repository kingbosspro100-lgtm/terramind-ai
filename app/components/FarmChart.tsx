"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { BarChart3 } from "lucide-react";

type Farm = {
  city: string;
};

type Props = {
  farms: Farm[];
};

const COLORS = [
  "#7B61FF", // Purple
  "#00F5A0", // Neon green
  "#3b82f6", // Blue
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#06b6d4", // Cyan
  "#ec4899", // Pink
];

export default function FarmChart({ farms }: Props) {
  const cityCounts = farms.reduce((acc: Record<string, number>, farm) => {
    acc[farm.city] = (acc[farm.city] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(cityCounts)
    .map(([city, total]) => ({
      city,
      total,
    }))
    .sort((a, b) => b.total - a.total);

  if (data.length === 0) {
    return (
      <div className="rounded-3xl bg-[#0A100C] border border-emerald-900/30 p-12 text-center shadow-2xl">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-emerald-900/20 border border-emerald-800/30">
            <BarChart3 className="h-8 w-8 text-emerald-400" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-white">
          Aucune donnée disponible
        </h3>
        <p className="mt-2 text-sm text-emerald-200/60 font-medium">
          Ajoutez des exploitations pour générer les statistiques de répartition.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 shadow-2xl overflow-hidden">
      
      {/* Header */}
      <div className="border-b border-emerald-900/30 px-6 py-5 bg-[#0B0914]/50">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-emerald-400" />
          Répartition géographique
        </h2>
        <p className="mt-1 text-[11px] text-emerald-200/60 font-medium">
          Nombre d'exploitations par ville.
        </p>
      </div>

      {/* Chart */}
      <div className="h-[300px] px-6 py-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#2e2559"
            />
            <XAxis
              dataKey="city"
              tick={{ fill: "#a78bfa", fontSize: 11, fontWeight: 600 }}
              axisLine={{ stroke: "#2e2559" }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "#a78bfa", fontSize: 11, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "#2e2559", opacity: 0.4 }}
              contentStyle={{
                backgroundColor: "#0B0914",
                border: "1px solid #4c1d95",
                borderRadius: "16px",
                color: "#fff",
                fontWeight: 600,
                fontSize: "12px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
              }}
              itemStyle={{ color: "#a78bfa" }}
            />
            <Bar
              dataKey="total"
              radius={[6, 6, 0, 0]}
              animationDuration={1500}
              barSize={40}
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Stats */}
      <div className="border-t border-emerald-900/30 bg-[#0B0914]/80 px-6 py-4 flex gap-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/60 mb-1">
            Exploitations
          </p>
          <p className="text-xl font-extrabold text-emerald-400">
            {farms.length}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/60 mb-1">
            Villes
          </p>
          <p className="text-xl font-extrabold text-blue-400">
            {data.length}
          </p>
        </div>
      </div>
    </div>
  );
}