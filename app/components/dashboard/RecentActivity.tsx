"use client";

type Activity = {
  id: string;
  type: "farm" | "crop" | "income" | "expense";
  title: string;
  description: string;
  date: string;
  amount?: number;
};

type Props = {
  activities?: Activity[];
};

function formatDate(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getActivityStyle(type: Activity["type"]) {
  switch (type) {
    case "farm":
      return {
        border: "border-emerald-500",
      };

    case "crop":
      return {
        border: "border-yellow-500",
      };

    case "income":
      return {
        border: "border-blue-500",
      };

    case "expense":
      return {
        border: "border-red-500",
      };

    default:
      return {
        border: "border-slate-500",
      };
  }
}

export default function RecentActivity({
  activities = [],
}: Props) {
  return (
    <div className="rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-6 md:p-8 shadow-2xl">

      <h2 className="text-xl font-bold text-white tracking-wide mb-6 flex items-center gap-2">
        📋 Activité récente
      </h2>

      {activities.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-[#0A100C] p-6 text-center">
          <p className="text-sm text-slate-400">
            Aucune activité récente.
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Vos nouvelles actions apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const style = getActivityStyle(activity.type);

            return (
              <div
                key={activity.id}
                className={`border-l-4 ${style.border} pl-4 py-1.5 bg-[#0A100C] rounded-r-2xl border-y border-r border-emerald-900/20`}
              >
                <p className="font-bold text-white text-sm">
                  {activity.title}
                </p>

                <p className="text-xs text-emerald-200/80 font-medium mt-0.5">
                  {formatDate(activity.date)} •{" "}
                  {activity.description}
                  {activity.amount !== undefined
                    ? ` • ${activity.amount.toLocaleString(
                      "fr-FR"
                    )} FCFA`
                    : ""}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}