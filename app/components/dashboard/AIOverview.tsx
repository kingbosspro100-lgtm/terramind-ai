import {
  Bot,
  Sparkles,
  Brain,
  TrendingUp,
  TriangleAlert,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function AIOverview() {
  return (
    <section className="overflow-hidden rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-6 md:p-8 text-white shadow-2xl">

      {/* En-tête */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-emerald-700 shadow-lg">

            <Bot size={34} />

          </div>

          <div>

            <h2 className="text-3xl font-black">

              TerraMind AI

            </h2>

            <p className="text-green-100">

              Assistant agricole intelligent

            </p>

          </div>

        </div>

        <Sparkles className="h-8 w-8 text-yellow-300" />

      </div>

      {/* Carte principale */}

      <div className="mt-8 rounded-3xl bg-white/10 p-7 backdrop-blur-xl">

        <h3 className="text-2xl font-bold">

          🧠 Analyse du jour

        </h3>

        <p className="mt-4 leading-8 text-green-100">

          Les données météo indiquent de bonnes conditions pour les
          prochains jours. Les cultures de maïs présentent un excellent
          potentiel de croissance. Une irrigation légère est recommandée
          en fin d'après-midi afin d'optimiser le rendement.

        </p>

      </div>

      {/* KPI IA */}

      <div className="mt-8 grid gap-5 md:grid-cols-3">

        <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">

          <TrendingUp className="mb-4 text-lime-300" />

          <p className="text-green-100">

            Rendement prévu

          </p>

          <h3 className="mt-3 text-4xl font-black">

            +18%

          </h3>

        </div>

        <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">

          <Brain className="mb-4 text-cyan-300" />

          <p className="text-green-100">

            Score IA

          </p>

          <h3 className="mt-3 text-4xl font-black">

            96%

          </h3>

        </div>

        <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">

          <TriangleAlert className="mb-4 text-yellow-300" />

          <p className="text-green-100">

            Alertes

          </p>

          <h3 className="mt-3 text-4xl font-black">

            1

          </h3>

        </div>

      </div>

      {/* Conseils */}

      <div className="mt-8 rounded-3xl bg-white/10 p-7 backdrop-blur">

        <h3 className="text-xl font-bold">

          ✅ Recommandations IA

        </h3>

        <ul className="mt-5 space-y-4">

          <li className="flex items-center gap-3">

            🌱 Fertiliser les parcelles de maïs.

          </li>

          <li className="flex items-center gap-3">

            💧 Prévoir une irrigation demain matin.

          </li>

          <li className="flex items-center gap-3">

            🌦️ Aucun risque de pluie importante.

          </li>

          <li className="flex items-center gap-3">

            📈 Les rendements sont supérieurs à la moyenne régionale.

          </li>

        </ul>

      </div>

      {/* Bouton */}
      
      <Link href="/ai" className="mt-8 flex w-fit items-center gap-3 rounded-2xl bg-white px-8 py-4 font-bold text-emerald-700 transition hover:scale-105">
      
        Ouvrir Assistant AI

        <ArrowRight />

      </Link>

    </section>
  );
}
