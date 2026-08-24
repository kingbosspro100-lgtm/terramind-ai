import { ReactNode } from "react";

type StatsCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
  description?: string;
};

export default function StatsCard({
  title,
  value,
  icon,
  color = "bg-green-100",
  description,
}: StatsCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-green-50 transition-all duration-500 group-hover:scale-125" />

      <div className="relative flex items-center justify-between">

        <div className="space-y-3">

          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
            {title}
          </p>

          <h2 className="text-4xl font-extrabold text-gray-900">
            {value}
          </h2>

          {description && (
            <p className="text-sm text-gray-500">
              {description}
            </p>
          )}

        </div>

        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl ${color}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}