export interface DepartmentConfig {
  id: string;
  name: string;
  chefLieu: string;
  lat: number;
  lon: number;
}

export const BENIN_DEPARTMENTS: DepartmentConfig[] = [
  { id: "alibori", name: "Alibori", chefLieu: "Kandi", lat: 11.13, lon: 2.93 },
  { id: "atacora", name: "Atacora", chefLieu: "Natitingou", lat: 10.30, lon: 1.38 },
  { id: "atlantique", name: "Atlantique", chefLieu: "Allada", lat: 6.66, lon: 2.15 },
  { id: "borgou", name: "Borgou", chefLieu: "Parakou", lat: 9.35, lon: 2.62 },
  { id: "collines", name: "Collines", chefLieu: "Dassa-Zoumè", lat: 7.78, lon: 2.18 },
  { id: "couffo", name: "Couffo", chefLieu: "Dogbo-Tota", lat: 6.98, lon: 1.78 },
  { id: "donga", name: "Donga", chefLieu: "Djougou", lat: 9.70, lon: 1.67 },
  { id: "littoral", name: "Littoral", chefLieu: "Cotonou", lat: 6.37, lon: 2.43 },
  { id: "mono", name: "Mono", chefLieu: "Lokossa", lat: 6.64, lon: 1.72 },
  { id: "oueme", name: "Ouémé", chefLieu: "Porto-Novo", lat: 6.50, lon: 2.60 },
  { id: "plateau", name: "Plateau", chefLieu: "Pobè", lat: 6.98, lon: 2.68 },
  { id: "zou", name: "Zou", chefLieu: "Abomey", lat: 7.18, lon: 1.99 },
];

export interface LiveWeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  weatherCode: number;
  conditionText: string;
  forecast: Array<{
    date: string;
    dayName: string;
    tempMax: number;
    tempMin: number;
    rainProb: number;
    weatherCode: number;
    conditionText: string;
  }>;
}

export function getWeatherConditionText(code: number): string {
  if (code === 0) return "Ensoleillé / Ciel dégagé";
  if (code === 1 || code === 2) return "Partiellement nuageux";
  if (code === 3) return "Ciel couvert";
  if (code >= 45 && code <= 48) return "Brouillard matinal";
  if (code >= 51 && code <= 57) return "Bruine légère";
  if (code >= 61 && code <= 65) return "Pluie modérée";
  if (code >= 66 && code <= 67) return "Pluie verglacée";
  if (code >= 80 && code <= 82) return "Averses de pluie";
  if (code >= 95 && code <= 99) return "Orages violents";
  return "Conditions changeantes";
}

export async function getWeather(latitude: number, longitude: number) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`
  );

  if (!response.ok) {
    throw new Error("Impossible de récupérer la météo");
  }

  return response.json();
}

export async function fetchLiveDepartmentWeather(lat: number, lon: number): Promise<LiveWeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Erreur de récupération météo Open-Meteo");
  }

  const data = await res.json();
  const current = data.current;
  const daily = data.daily;

  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  const forecast = (daily.time || []).slice(0, 7).map((timeStr: string, idx: number) => {
    const d = new Date(timeStr);
    const dayName = idx === 0 ? "Aujourd'hui" : dayNames[d.getDay()];
    const dateFormatted = d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

    return {
      date: dateFormatted,
      dayName: `${dayName} (${dateFormatted})`,
      tempMax: Math.round(daily.temperature_2m_max[idx] ?? 30),
      tempMin: Math.round(daily.temperature_2m_min[idx] ?? 22),
      rainProb: daily.precipitation_probability_max?.[idx] ?? Math.round((daily.precipitation_sum?.[idx] || 0) * 10),
      weatherCode: daily.weather_code[idx] ?? 0,
      conditionText: getWeatherConditionText(daily.weather_code[idx] ?? 0),
    };
  });

  return {
    temp: Math.round(current.temperature_2m ?? 28),
    humidity: Math.round(current.relative_humidity_2m ?? 70),
    windSpeed: Math.round(current.wind_speed_10m ?? 15),
    precipitation: current.precipitation ?? 0,
    weatherCode: current.weather_code ?? 0,
    conditionText: getWeatherConditionText(current.weather_code ?? 0),
    forecast,
  };
}