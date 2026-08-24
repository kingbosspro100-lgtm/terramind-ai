import { Star, Users, Trophy, ArrowUpRight } from "lucide-react";

export default function TrustStats() {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-6 py-16">
      <div className="mx-auto max-w-6xl">

        {/* Statistiques principales */}
        <div className="grid gap-5 md:grid-cols-3">

          {/* Utilisateurs */}
          <div className="group rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.07]">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10">
              <Users className="text-emerald-400" size={25} />
            </div>

            <p className="text-4xl font-black tracking-tight text-white">
              +100K
            </p>

            <p className="mt-2 text-sm font-medium text-slate-400">
              utilisateurs
            </p>
          </div>

          {/* Avis */}
          <div className="group rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.07]">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400/10">
              <Star className="fill-yellow-400 text-yellow-400" size={25} />
            </div>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  className="fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>

            <p className="mt-3 text-sm font-medium text-slate-400">
              Note moyenne de nos utilisateurs
            </p>
          </div>

          {/* Résultat */}
          <div className="group rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.06] p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10">
              <Trophy className="text-emerald-400" size={25} />
            </div>

            <div className="flex items-center gap-2">
              <p className="text-4xl font-black tracking-tight text-white">
                1M+
              </p>

              <ArrowUpRight
                size={22}
                className="text-emerald-400"
              />
            </div>

            <p className="mt-2 text-sm font-medium text-slate-400">
              FCFA de revenus générés par un utilisateur
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Exemple basé sur un cas réel vérifié
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}