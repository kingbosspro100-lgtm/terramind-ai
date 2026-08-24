"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";

type Transaction = {
  amount: number;
  type: string;
  transaction_date: string;
};

type Props = {
  transactions?: Transaction[];
};

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
}

export default function AnalyticGauge({
  transactions = [],
}: Props) {
  const now = new Date();

  const currentMonthKey = getMonthKey(now);

  const previousMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );

  const previousMonthKey = getMonthKey(previousMonth);

  const getBalance = (monthKey: string) => {
    return transactions
      .filter((transaction) => {
        if (!transaction.transaction_date) return false;

        const date = new Date(
          `${transaction.transaction_date}T00:00:00`
        );

        return getMonthKey(date) === monthKey;
      })
      .reduce((total, transaction) => {
        const amount = Number(transaction.amount || 0);

        if (transaction.type === "income") {
          return total + amount;
        }

        if (transaction.type === "expense") {
          return total - amount;
        }

        return total;
      }, 0);
  };

  const currentBalance = getBalance(currentMonthKey);
  const previousBalance = getBalance(previousMonthKey);

  let evolution = 0;

  if (previousBalance !== 0) {
    evolution =
      ((currentBalance - previousBalance) /
        Math.abs(previousBalance)) *
      100;
  } else if (currentBalance !== 0) {
    evolution = 100;
  }

  evolution = Number(evolution.toFixed(1));

  const isPositive = evolution >= 0;

  const totalDots = 28;

  const activeDots = Math.min(
    totalDots,
    Math.max(
      0,
      Math.round(
        (Math.abs(evolution) / 100) * totalDots
      )
    )
  );

  const dots = Array.from({
    length: totalDots,
  }).map((_, i) => ({
    id: i,
    active: i < activeDots,
  }));

  return (
    <div className="rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-6 md:p-8 shadow-2xl flex flex-col justify-between h-full">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">
            Vue Analytique
          </h2>

          <p className="text-xs text-emerald-200 font-semibold mt-1">
            Évolution réelle de votre activité
          </p>
        </div>
      </div>

      {/* Gauge */}
      <div className="relative my-8 flex items-center justify-center">
        <div className="relative w-64 h-64 flex items-center justify-center">

          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 200 200"
          >
            {dots.map((dot) => {
              const angle =
                (dot.id / totalDots) * 360;

              const radius = 80;

              const cx =
                100 +
                radius *
                Math.cos(
                  (angle * Math.PI) / 180
                );

              const cy =
                100 +
                radius *
                Math.sin(
                  (angle * Math.PI) / 180
                );

              return (
                <circle
                  key={dot.id}
                  cx={cx}
                  cy={cy}
                  r="5"
                  fill={
                    dot.active
                      ? "#00F5A0"
                      : "#302B5A"
                  }
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>

          {/* Centre */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">

            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-200/70">
              Évolution
            </p>

            <p className="mt-1 text-4xl font-extrabold text-white tracking-tight">
              {evolution > 0 ? "+" : ""}
              {evolution.toLocaleString("fr-FR")}%
            </p>

            {transactions.length > 0 ? (
              <div
                className={`mt-2 flex items-center gap-1 text-xs font-bold ${isPositive
                    ? "text-[#00F5A0]"
                    : "text-red-400"
                  }`}
              >
                {isPositive ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}

                <span>
                  vs. mois précédent
                </span>
              </div>
            ) : (
              <p className="mt-2 text-xs text-slate-500">
                Pas encore assez de données
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="h-2" />
    </div>
  );
}