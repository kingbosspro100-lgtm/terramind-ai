import { Tractor, Sprout, LandPlot, MapPinned } from "lucide-react";

type Props = {
  totalFarms?: number;
  totalCrops?: number;
  totalArea?: number;
  totalCities?: number;
};

export default function KpiGrid({
  totalFarms = 12,
  totalCrops = 24,
  totalArea = 150,
  totalCities = 8,
}: Props) {
  const kpis = [
    {
      title: "Exploitations",
      value: `${totalFarms}`,
      icon: Tractor,
    },
    {
      title: "Cultures Actives",
      value: `${totalCrops}`,
      icon: Sprout,
    },
    {
      title: "Superficie Totale",
      value: `${totalArea} ha`,
      icon: LandPlot,
    },
    {
      title: "Villes Couvertes",
      value: `${totalCities}`,
      icon: MapPinned,
    },
  ];

  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <div
            key={index}
            className="cosmic-panel group relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-cyan/40 hover:shadow-brand-cyan/10"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-950/60 text-emerald-300 border border-emerald-800/30 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold text-emerald-100 tracking-wide">
                {kpi.title}
              </span>
            </div>

            <div className="mt-5">
              <p className="text-3xl font-extrabold tracking-tight text-white">
                {kpi.value}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}