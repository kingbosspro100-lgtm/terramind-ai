export default function DashboardSection() {
  return (
    <section
      id="dashboard"
      className="bg-white py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-center text-4xl font-black text-slate-900">
          Aperçu du Dashboard
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">
          Découvrez l'interface moderne de TerraMind AI.
        </p>

        <div className="mt-16 rounded-3xl border bg-slate-50 p-10 shadow-xl">

          <div className="grid gap-6 md:grid-cols-4">

            <div className="rounded-2xl bg-emerald-50 p-6">
              <h3 className="text-3xl font-black text-emerald-700">24</h3>
              <p className="mt-2 text-slate-600">
                Exploitations
              </p>
            </div>

            <div className="rounded-2xl bg-lime-50 p-6">
              <h3 className="text-3xl font-black text-lime-700">132</h3>
              <p className="mt-2 text-slate-600">
                Cultures
              </p>
            </div>

            <div className="rounded-2xl bg-sky-50 p-6">
              <h3 className="text-3xl font-black text-sky-700">95%</h3>
              <p className="mt-2 text-slate-600">
                Précision IA
              </p>
            </div>

            <div className="rounded-2xl bg-orange-50 p-6">
              <h3 className="text-3xl font-black text-orange-700">
                2,45 M
              </h3>
              <p className="mt-2 text-slate-600">
                Revenus FCFA
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}