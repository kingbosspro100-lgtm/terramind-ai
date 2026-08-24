type Props = {
  temperature: number;
  humidity: number;
  crop: string;
};

export default function AIAdvice({
  temperature,
  humidity,
  crop,
}: Props) {
  let advice = "Conditions normales.";

  if (temperature > 35) {
    advice =
      "🔥 Température élevée : arrosez tôt le matin ou en fin de journée.";
  } else if (humidity > 80) {
    advice =
      "🌧️ Humidité importante : surveillez les maladies fongiques.";
  } else if (crop.toLowerCase().includes("maïs")) {
    advice =
      "🌽 Le maïs apprécie ces conditions. Vérifiez régulièrement l'humidité du sol.";
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-4">
      <h3 className="font-bold text-green-700">
        🤖 Conseil TerraMind AI
      </h3>

      <p className="mt-2">{advice}</p>
    </div>
  );
}