import CropCard from "./CropCard";
import FarmActions from "./FarmActions";
import FarmHeader from "./FarmHeader";
import WeatherCard from "./WeatherCard";
import FarmMapWrapper from "./FarmMapWrapper";
import FarmChart from "./FarmChart";
import CropForm from "./CropForm";
import {
  MapPin,
  Sprout,
  Ruler,
  Wheat,
} from "lucide-react";

type FarmCardProps = {
  farm: any;
  farms: any[];
};

export default function FarmCard({
  farm,
  farms,
}: FarmCardProps) {
  return (
    <div className="overflow-hidden rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 shadow-2xl transition-all duration-300 hover:border-emerald-500/50">

      {/* Bandeau Supérieur */}
      <div className="relative border-b border-emerald-900/30 bg-[#0A100C] p-6 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <FarmHeader farm={farm} />

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          
          <div className="rounded-2xl bg-[#0B0914]/50 border border-emerald-900/40 p-4">
            <MapPin className="mb-2 h-5 w-5 text-emerald-400" />
            <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-300/60 mb-1">
              Ville
            </p>
            <p className="font-extrabold text-white">
              {farm.city}
            </p>
          </div>

          <div className="rounded-2xl bg-[#0B0914]/50 border border-emerald-900/40 p-4">
            <Ruler className="mb-2 h-5 w-5 text-blue-400" />
            <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-300/60 mb-1">
              Superficie
            </p>
            <p className="font-extrabold text-white">
              {farm.area} ha
            </p>
          </div>

          <div className="rounded-2xl bg-[#0B0914]/50 border border-emerald-900/40 p-4">
            <Wheat className="mb-2 h-5 w-5 text-amber-400" />
            <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-300/60 mb-1">
              Culture princ.
            </p>
            <p className="font-extrabold text-white">
              {farm.main_crop}
            </p>
          </div>

          <div className="rounded-2xl bg-[#0B0914]/50 border border-emerald-900/40 p-4">
            <Sprout className="mb-2 h-5 w-5 text-emerald-400" />
            <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-300/60 mb-1">
              Cultures
            </p>
            <p className="font-extrabold text-white">
              {farm.crops?.length ?? 0}
            </p>
          </div>

        </div>
      </div>

      {/* Contenu */}
      <div className="p-6 space-y-8">

        <div className="grid gap-6 lg:grid-cols-2">
          <WeatherCard
            latitude={farm.latitude}
            longitude={farm.longitude}
            crop={farm.main_crop}
          />

          <FarmMapWrapper
            latitude={farm.latitude}
            longitude={farm.longitude}
            name={farm.name}
          />
        </div>

        {/* Note: CropForm could be restyled similarly if needed */}
        <CropForm farmId={farm.id} />

        <div>
          <h2 className="mb-4 text-xl font-bold text-white flex items-center gap-2">
            🌱 Cultures
          </h2>

          {farm.crops?.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-emerald-900/50 bg-[#0A100C] p-8 text-center shadow-inner">
              <p className="text-sm font-medium text-emerald-300/60">
                Aucune culture enregistrée pour cette exploitation.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {farm.crops.map((crop: any) => (
                <CropCard
                  key={crop.id}
                  crop={crop}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-4 text-xl font-bold text-white flex items-center gap-2">
            📈 Statistiques de Performance
          </h2>
          <FarmChart farms={farms} />
        </div>

        <FarmActions farm={farm} />

      </div>

    </div>
  );
}