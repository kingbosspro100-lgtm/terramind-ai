import { ReactNode } from "react";

type FinanceStatCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
};

export default function FinanceStatCard({
  title,
  value,
  icon,
  color,
}: FinanceStatCardProps) {
  return (
    <div className="rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-bold text-gray-900">
            {value}
          </h2>

        </div>

        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center ${color}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}