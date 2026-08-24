"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

type Props = {
  items: any[];
};

const COLORS = [
  "#10B981",
  "#3B82F6",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
];

export default function StockChart({ items }: Props) {
  const categories = items.reduce(
    (acc: Record<string, number>, item) => {
      acc[item.category] =
        (acc[item.category] || 0) + Number(item.quantity);

      return acc;
    },
    {}
  );

  const data = Object.entries(categories).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  if (data.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-10 shadow">

        <h2 className="mb-6 text-2xl font-bold">
          📊 Répartition du stock
        </h2>

        <div className="py-20 text-center text-gray-500">
          Aucun graphique disponible.
        </div>

      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-8 shadow">

      <h2 className="mb-8 text-3xl font-bold">
        📊 Répartition du stock
      </h2>

      <ResponsiveContainer width="100%" height={420}>

        <PieChart>

          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={140}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (

              <Cell
                key={entry.name}
                fill={COLORS[index % COLORS.length]}
              />

            ))}
          </Pie>

          <Tooltip />

          <Legend />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
}