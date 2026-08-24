import {
  Sparkles,
  CloudSun,
  ArrowRight,
  Tractor,
  Bot,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const hour = new Date().getHours();

  let greeting = "Bonjour";

  if (hour >= 18) greeting = "Bonsoir";
  if (hour >= 22 || hour < 5) greeting = "Bonne nuit";

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-emerald-700 via-green-600 to-lime-500 p-10 text-white shadow-2xl">

      {/* Halo lumineux */}

      <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>

      <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-black/10 blur-3xl"></div>

      {/* Contenu */}

      <div className="relative z-10 grid gap-10 lg:grid-cols-[2fr_1fr]">

        {/* Partie gauche */}

        <div>

          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur">

            <Sparkles size={18} />

            <span className="text-sm font-semibold">
              Agriculture intelligente
            </span>

          </div>

          <h1 className="mt-6 text-5xl font-black leading-tight">

            {greeting} 👋

            <br />

            Bienvenue sur

            <span className="block text-yellow-300">
              TerraMind AI
            </span>

          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-green-50">

            Gérez vos exploitations agricoles,
            surveillez vos cultures,
            analysez vos finances
            et prenez de meilleures décisions grâce
            à l'intelligence artificielle.

          </p>

          <div className="mt-8 flex flex-wrap gap-4">

            <Link
              href="/farms"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-4 font-bold text-green-700 shadow-xl transition hover:scale-105"
            >
              <Tractor size={22} />

              Ajouter une exploitation

              <ArrowRight size={18} />

            </Link>

            <Link
              href="/finance"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-4 font-semibold backdrop-blur transition hover:bg-white/20"
            >
              Voir les finances
            </Link>

          </div>

        </div>

        {/* Carte IA */}

        <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl shadow-xl">

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white">

              <Bot className="h-9 w-9 text-green-700" />

            </div>

            <div>

              <h2 className="text-2xl font-bold">
                TerraMind AI
              </h2>

              <p className="text-green-100">
                Assistant agricole intelligent
              </p>

            </div>

          </div>

          <div className="mt-8 space-y-4">

            <div className="rounded-2xl bg-white/10 p-4">

              <div className="flex items-center gap-3">

                <CloudSun className="text-yellow-300" />

                <span>
                  Température idéale aujourd'hui pour vos cultures.
                </span>

              </div>

            </div>

            <div className="rounded-2xl bg-white/10 p-4">

              <div className="flex items-center gap-3">

                <CalendarDays className="text-cyan-200" />

                <span>{today}</span>

              </div>

            </div>

            <div className="rounded-2xl bg-white/10 p-4">

              🤖 Conseil IA :

              <p className="mt-2 text-green-50">

                Vérifiez l'humidité du sol avant
                d'effectuer un arrosage aujourd'hui.

              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}