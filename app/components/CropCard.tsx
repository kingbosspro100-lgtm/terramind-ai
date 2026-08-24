import {
  Sprout,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Tractor,
} from "lucide-react";

type CropCardProps = {
  crop: {
    id: string;
    name: string;
    sowing_date: string;
    harvest_date: string;
    status?: string;
  };
};

export default function CropCard({
  crop,
}: CropCardProps) {
  const status = crop.status ?? "Inconnu";

  const statusConfig = {
    Semé: {
      color: "bg-amber-950/60 text-amber-400 border-amber-800/40",
      icon: <Sprout size={14} />,
    },
    Croissance: {
      color: "bg-blue-950/60 text-blue-400 border-blue-800/40",
      icon: <Clock3 size={14} />,
    },
    Récolté: {
      color: "bg-emerald-950/60 text-emerald-400 border-emerald-800/40",
      icon: <CheckCircle2 size={14} />,
    },
    Inconnu: {
      color: "bg-[#1A1638] text-emerald-300 border-emerald-800/40",
      icon: <Tractor size={14} />,
    },
  };

  const current =
    statusConfig[status as keyof typeof statusConfig] ??
    statusConfig.Inconnu;

  return (
    <div className="group rounded-3xl bg-[#0A100C] border border-emerald-900/30 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-500/40">

      {/* En-tête */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-900/40 text-emerald-400 border border-emerald-800/50">
            <Sprout size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">
              {crop.name}
            </h3>
            <p className="text-[11px] font-medium text-emerald-300/60">
              Culture agricole
            </p>
          </div>
        </div>

        <span
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${current.color}`}
        >
          {current.icon}
          {status}
        </span>
      </div>

      {/* Dates */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-[#0B0914]/50 border border-emerald-900/20 p-4">
          <div className="mb-2 flex items-center gap-2 text-emerald-400">
            <CalendarDays size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/60">
              Date de Semis
            </span>
          </div>
          <p className="text-sm font-semibold text-white">
            {crop.sowing_date}
          </p>
        </div>

        <div className="rounded-2xl bg-[#0B0914]/50 border border-emerald-900/20 p-4">
          <div className="mb-2 flex items-center gap-2 text-emerald-400">
            <CalendarDays size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/60">
              Date de Récolte
            </span>
          </div>
          <p className="text-sm font-semibold text-white">
            {crop.harvest_date}
          </p>
        </div>
      </div>

    </div>
  );
}