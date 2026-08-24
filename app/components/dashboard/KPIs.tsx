import {
  Tractor,
  Sprout,
  LandPlot,
  MapPinned,
} from "lucide-react";

import StatCard from "./StatCard";

type Props = {
  totalFarms: number;
  totalCrops: number;
  totalArea: number;
  totalCities: number;
};

export default function KPIs({
  totalFarms,
  totalCrops,
  totalArea,
  totalCities,
}: Props) {
  return (
    <section className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">

      <StatCard
        title="Exploitations"
        value={totalFarms}
        evolution={18}
        icon={<Tractor size={34} />}
        color="bg-emerald-600"
      />

      <StatCard
        title="Cultures"
        value={totalCrops}
        evolution={9}
        icon={<Sprout size={34} />}
        color="bg-yellow-500"
      />

      <StatCard
        title="Superficie"
        value={`${totalArea} ha`}
        evolution={14}
        icon={<LandPlot size={34} />}
        color="bg-blue-600"
      />

      <StatCard
        title="Villes"
        value={totalCities}
        evolution={4}
        icon={<MapPinned size={34} />}
        color="bg-emerald-600"
      />

    </section>
  );
}