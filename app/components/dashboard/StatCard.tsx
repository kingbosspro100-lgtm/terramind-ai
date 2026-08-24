import { ArrowUpRight } from "lucide-react";

type Props = {
  title: string;
  value: string | number;
  evolution: number;
  icon: React.ReactNode;
  color: string;
};

export default function StatCard({
  title,
  value,
  evolution,
  icon,
  color,
}: Props) {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-[#181436] border border-emerald-900/30 p-7 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-emerald-900/20">

      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-900/10 transition group-hover:scale-125 blur-xl"></div>

      <div className="relative flex items-start justify-between">

        <div>

          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-200/80">
            {title}
          </p>

          <h2 className="mt-4 text-4xl font-black text-white">
            {value}
          </h2>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-950/50 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-400">

            <ArrowUpRight size={14} />

            +{evolution}%

          </div>

        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg shadow-${color}-900/50 ${color}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}