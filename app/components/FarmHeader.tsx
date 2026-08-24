import {
  ShieldCheck,
  Building2,
} from "lucide-react";

type FarmHeaderProps = {
  farm: {
    name: string;
    city: string;
    country: string;
    main_crop: string;
    area: number;
  };
};

export default function FarmHeader({
  farm,
}: FarmHeaderProps) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">

      {/* Informations */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3 py-1 text-[10px] font-semibold text-emerald-300 mb-3">
          <Building2 className="h-3 w-3 text-emerald-400" />
          <span>Fiche Exploitation</span>
        </div>

        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          {farm.name}
        </h2>

        <p className="mt-1 text-xs font-medium text-emerald-200/70">
          Exploitation agricole certifiée sur le réseau TerraMind AI.
        </p>
      </div>

      {/* Statut */}
      <div className="flex justify-start lg:justify-end">
        <div className="flex items-center gap-2 rounded-full bg-emerald-950/60 border border-emerald-800/40 px-4 py-2 text-emerald-400 shadow-xl shadow-emerald-900/10 backdrop-blur-md">
          <ShieldCheck size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">
            Système Actif
          </span>
        </div>
      </div>

    </div>
  );
}