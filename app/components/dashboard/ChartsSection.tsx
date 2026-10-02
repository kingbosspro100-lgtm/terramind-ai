"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Transaction = {
  id: string;
  type: string;
  amount: number;
  transaction_date: string;
  category?: string | null;
  description?: string | null;
};

type ChartPoint = {
  date: string;
  revenus: number;
  depenses: number;
};

function formatAmount(value: number) {
  return `${value.toLocaleString("fr-FR")} FCFA`;
}

function buildChartData(transactions: Transaction[]): ChartPoint[] {
  const grouped = new Map<string, ChartPoint>();

  for (const transaction of transactions) {
    const date = transaction.transaction_date;

    if (!date) continue;

    if (!grouped.has(date)) {
      grouped.set(date, {
        date,
        revenus: 0,
        depenses: 0,
      });
    }

    const point = grouped.get(date)!;
    const amount = Number(transaction.amount || 0);

    if (transaction.type === "income") {
      point.revenus += amount;
    }

    if (transaction.type === "expense") {
      point.depenses += amount;
    }
  }

  return Array.from(grouped.values())
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((item) => ({
      ...item,
      date: new Date(`${item.date}T00:00:00`).toLocaleDateString(
        "fr-FR",
        {
          day: "2-digit",
          month: "short",
        }
      ),
    }));
}

export default function ChartsSection({
  transactions,
}: {
  transactions?: Transaction[];
}) {
  const chartData = buildChartData(transactions ?? []);

  const hasData = chartData.length > 0;

  return (
    <div className="cosmic-panel rounded-2xl p-6 md:p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">
            Évolution financière
          </h2>

          <p className="text-xs text-emerald-200 font-semibold mt-1">
            Revenus et dépenses enregistrés dans votre exploitation
          </p>
        </div>
      </div>

      {!hasData ? (
        <div className="h-[280px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm font-semibold text-white">
              Aucune donnée disponible
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Enregistrez votre première transaction pour voir votre évolution.
            </p>
          </div>
        </div>
      ) : (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#00C6FF"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="#00C6FF"
                    stopOpacity={0}
                  />
                </linearGradient>

                <linearGradient
                  id="expenseGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#FF2A85"
                    stopOpacity={0.25}
                  />
                  <stop
                    offset="95%"
                    stopColor="#FF2A85"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="date"
                stroke="#8490A7"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                stroke="#8490A7"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  `${Number(value).toLocaleString("fr-FR")}`
                }
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload || payload.length === 0) {
                    return null;
                  }

                  const revenus = Number(
                    payload.find(
                      (item) => item.dataKey === "revenus"
                    )?.value ?? 0
                  );

                  const depenses = Number(
                    payload.find(
                      (item) => item.dataKey === "depenses"
                    )?.value ?? 0
                  );

                  return (
                    <div className="rounded-xl border border-brand-cyan/30 bg-brand-card/95 px-4 py-3 shadow-xl backdrop-blur-md">
                      <p className="text-xs font-semibold text-slate-300">
                        {label}
                      </p>

                      <p className="mt-2 text-xs text-brand-cyan">
                        Revenus :{" "}
                        <span className="font-bold text-white">
                          {formatAmount(revenus)}
                        </span>
                      </p>

                      <p className="mt-1 text-xs text-brand-pink">
                        Dépenses :{" "}
                        <span className="font-bold text-white">
                          {formatAmount(depenses)}
                        </span>
                      </p>
                    </div>
                  );
                }}
              />

              <Area
                type="monotone"
                dataKey="revenus"
                stroke="#10B981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#revenueGradient)"
              />

              <Area
                type="monotone"
                dataKey="depenses"
                stroke="#F59E0B"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#expenseGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}