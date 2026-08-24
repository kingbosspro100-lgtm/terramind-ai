"use client";

import {
  Users,
  Sprout,
  Globe2,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "10 000+",
    label: "Agriculteurs",
  },
  {
    icon: Sprout,
    value: "250 000+",
    label: "Hectares suivis",
  },
  {
    icon: Globe2,
    value: "8",
    label: "Pays africains",
  },
  {
    icon: TrendingUp,
    value: "+32%",
    label: "Rendement moyen",
  },
];

export default function Stats() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-emerald-50 py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="group rounded-3xl border border-emerald-100 bg-white p-8 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="inline-flex rounded-2xl bg-emerald-100 p-4">
                  <Icon className="h-8 w-8 text-emerald-700" />
                </div>

                <h2 className="mt-6 text-5xl font-black text-slate-900">
                  {item.value}
                </h2>

                <p className="mt-3 text-lg text-slate-600">
                  {item.label}
                </p>
              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
}