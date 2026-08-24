import {
  Bot,
  Sparkles,
  TrendingUp,
  CloudRain,
  Leaf,
  CircleAlert,
} from "lucide-react";

type Props = {
  totalFarms: number;
  totalCrops: number;
  totalArea: number;
};

export default function AIWidget({
  totalFarms,
  totalCrops,
  totalArea,
}: Props) {
  const advice =
    totalFarms === 0
      ? "Commencez par ajouter votre première exploitation."
      : totalCrops === 0
      ? "Ajoutez des cultures afin que l'IA puisse effectuer des analyses."
      : totalArea < 10
      ? "Vous pouvez augmenter votre superficie pour améliorer votre rendement."
      : "Vos données sont cohérentes. Continuez à mettre vos informations à jour.";

  return (
    <div className="rounded-3xl bg-gradient-to-br from-emerald-700 via-green-600 to-lime-500 p-8 text-white shadow-xl">

      <div className="flex items-center gap-4">

        <div className="rounded-2xl bg-white p-4">

          <Bot className="h-10 w-10 text-emerald-700" />

        </div>

        <div>

          <h2 className="text-3xl font-bold">
            TerraMind AI
          </h2>

          <p className="text-green-100">
            Assistant intelligent
          </p>

        </div>

      </div>

      <div className="mt-8 space-y-5">

        <div className="rounded-2xl bg-white/10 p-5">

          <div className="flex items-center gap-3">

            <Sparkles />

            <span className="font-semibold">
              Conseil du jour
            </span>

          </div>

          <p className="mt-3 text-green-50">
            {advice}
          </p>

        </div>

        <div className="rounded-2xl bg-white/10 p-5">

          <div className="flex items-center gap-3">

            <TrendingUp />

            <span className="font-semibold">
              Productivité
            </span>

          </div>

          <p className="mt-3">
            Les données montrent une évolution positive de vos exploitations.
          </p>

        </div>

        <div className="rounded-2xl bg-white/10 p-5">

          <div className="flex items-center gap-3">

            <CloudRain />

            <span className="font-semibold">
              Météo
            </span>

          </div>

          <p className="mt-3">
            Pensez à consulter les prévisions avant vos travaux agricoles.
          </p>

        </div>

        <div className="rounded-2xl bg-white/10 p-5">

          <div className="flex items-center gap-3">

            <Leaf />

            <span className="font-semibold">
              Agriculture durable
            </span>

          </div>

          <p className="mt-3">
            Alternez les cultures afin de préserver la fertilité du sol.
          </p>

        </div>

        <div className="rounded-2xl bg-yellow-300 p-5 text-black">

          <div className="flex items-center gap-3">

            <CircleAlert />

            <span className="font-bold">
              Recommandation
            </span>

          </div>

          <p className="mt-3">
            Complétez régulièrement vos données pour obtenir des analyses IA encore plus précises.
          </p>

        </div>

      </div>

    </div>
  );
}