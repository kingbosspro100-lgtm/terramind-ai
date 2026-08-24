import {
  BarChart3,
  TrendingUp,
} from "lucide-react";

import FarmChart from "../FarmChart";

type Farm = {
  city: string;
};

type Props = {
  farms: Farm[];
};

export default function DashboardCharts({
  farms,
}: Props) {
  return (
    <section className="grid gap-8 xl:grid-cols-3">

      {/* Grand graphique */}

      <div className="xl:col-span-2 rounded-3xl bg-white p-8 shadow-xl">

        <div className="mb-8 flex items-center justify-between">

          <div>

            <div className="flex items-center gap-3">

              <BarChart3 className="h-7 w-7 text-emerald-600" />

              <h2 className="text-3xl font-bold">

                Analyse des exploitations

              </h2>

            </div>

            <p className="mt-2 text-gray-500">

              Répartition des exploitations selon leur localisation.

            </p>

          </div>

          <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">

            Temps réel

          </span>

        </div>

        <FarmChart farms={farms} />

      </div>

      {/* Carte statistiques */}

      <div className="rounded-3xl bg-gradient-to-br from-emerald-600 via-green-600 to-lime-500 p-8 text-white shadow-xl">

        <div className="flex items-center gap-3">

          <TrendingUp className="h-8 w-8" />

          <h2 className="text-2xl font-bold">

            Performance

          </h2>

        </div>

        <div className="mt-8 space-y-5">

          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">

            <p className="text-green-100">

              Rendement estimé

            </p>

            <h3 className="mt-2 text-4xl font-black">

              +18%

            </h3>

          </div>

          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">

            <p className="text-green-100">

              Santé des cultures

            </p>

            <h3 className="mt-2 text-4xl font-black">

              96%

            </h3>

          </div>

          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">

            <p className="text-green-100">

              IA Score

            </p>

            <h3 className="mt-2 text-4xl font-black">

              A+

            </h3>

          </div>

        </div>

      </div>

    </section>
  );
}