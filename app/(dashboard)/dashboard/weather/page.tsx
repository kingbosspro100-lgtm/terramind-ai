"use client";

import { useEffect, useState } from "react";
import { CloudRain, LocateFixed, MapPin, RefreshCw, Sun, Thermometer, Wind } from "lucide-react";
import { fetchLiveDepartmentWeather, type LiveWeatherData } from "@/services/weather";
import { SUPPORTED_COUNTRIES } from "@/lib/services/exploitations";
import type { SupportedCountry } from "@/types/database";

const capitals: Record<SupportedCountry, { city: string; latitude: number; longitude: number }> = {
  "Bénin": { city: "Cotonou", latitude: 6.37, longitude: 2.43 },
  "Côte d'Ivoire": { city: "Abidjan", latitude: 5.36, longitude: -4.01 },
  "Cameroun": { city: "Yaoundé", latitude: 3.87, longitude: 11.52 },
  "Sénégal": { city: "Dakar", latitude: 14.69, longitude: -17.45 },
};

export default function DashboardWeatherPage() {
  const [country, setCountry] = useState<SupportedCountry>("Bénin");
  const [city, setCity] = useState(capitals.Bénin.city);
  const [coords, setCoords] = useState({ latitude: capitals.Bénin.latitude, longitude: capitals.Bénin.longitude });
  const [weather, setWeather] = useState<LiveWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refresh() {
    setLoading(true); setError("");
    try { setWeather(await fetchLiveDepartmentWeather(coords.latitude, coords.longitude)); }
    catch { setError("Open-Meteo n'a pas pu fournir les données météo. Réessayez dans quelques instants."); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    let active = true;
    fetchLiveDepartmentWeather(coords.latitude, coords.longitude).then((result) => {
      if (active) setWeather(result);
    }).catch(() => {
      if (active) setError("Open-Meteo n'a pas pu fournir les données météo. Réessayez dans quelques instants.");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [coords.latitude, coords.longitude]);

  function changeCountry(value: SupportedCountry) {
    setCountry(value);
    setCity(capitals[value].city);
    setWeather(null);
    setLoading(true);
    setCoords({ latitude: capitals[value].latitude, longitude: capitals[value].longitude });
  }

  function locate() {
    if (!navigator.geolocation) { setError("La géolocalisation n'est pas disponible."); return; }
    navigator.geolocation.getCurrentPosition(({ coords: position }) => {
      setWeather(null);
      setLoading(true);
      setCoords({ latitude: position.latitude, longitude: position.longitude });
      setCity("Ma position");
    }, () => setError("Position inaccessible. Vérifiez l'autorisation du navigateur."));
  }

  return (
    <main className="mx-auto max-w-6xl space-y-7 pb-12">
      <header className="flex flex-col justify-between gap-4 border-b border-emerald-900/40 pb-5 sm:flex-row sm:items-end">
        <div><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">Données en direct · Open-Meteo</p><h1 className="text-3xl font-bold text-white">Météo agricole</h1><p className="mt-2 text-sm text-slate-300">Conditions actuelles et prévisions pour les quatre pays V1.</p></div>
        <button onClick={() => void refresh()} disabled={loading} title="Actualiser la météo" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-emerald-800 px-3 text-sm text-emerald-200 hover:bg-emerald-950/50 disabled:opacity-50"><RefreshCw size={16} className={loading ? "animate-spin" : ""} />Actualiser</button>
      </header>

      <section className="flex flex-wrap items-end gap-3">
        <label className="min-w-48 flex-1 space-y-1.5 text-sm text-slate-300">Pays<select value={country} onChange={(event) => changeCountry(event.target.value as SupportedCountry)} className="w-full rounded-lg border border-slate-700 bg-[#100E18] px-3 py-2.5 text-white">{SUPPORTED_COUNTRIES.map((name) => <option key={name}>{name}</option>)}</select></label>
        <label className="min-w-48 flex-1 space-y-1.5 text-sm text-slate-300">Ville de référence<input value={city} onChange={(event) => setCity(event.target.value)} onBlur={() => { if (!city.trim()) setCity(capitals[country].city); }} className="w-full rounded-lg border border-slate-700 bg-[#100E18] px-3 py-2.5 text-white" /></label>
        <button onClick={locate} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-700 px-3 text-sm text-slate-200 hover:bg-slate-800"><LocateFixed size={16} />Ma position</button>
      </section>

      {error && <p role="alert" className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-200">{error}</p>}
      <section className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-lg border border-emerald-900/40 bg-[#100E18] p-6">
          <p className="flex items-center gap-2 text-sm text-slate-300"><MapPin size={16} className="text-emerald-400" />{city}, {country}</p>
          <div className="mt-8 flex items-center gap-4">{weather?.weatherCode === 0 ? <Sun className="text-amber-300" size={48} /> : <CloudRain className="text-sky-300" size={48} />}<strong className="text-6xl font-semibold text-white">{loading ? "…" : `${weather?.temp ?? "--"}°`}</strong></div>
          <p className="mt-3 text-slate-300">{loading ? "Chargement des relevés…" : weather?.conditionText}</p>
          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-slate-800 pt-5 text-sm">
            <p className="text-slate-400"><Thermometer size={16} className="mb-2 text-rose-300" />Humidité<strong className="mt-1 block text-white">{weather?.humidity ?? "--"}%</strong></p>
            <p className="text-slate-400"><Wind size={16} className="mb-2 text-teal-300" />Vent<strong className="mt-1 block text-white">{weather?.windSpeed ?? "--"} km/h</strong></p>
            <p className="text-slate-400"><CloudRain size={16} className="mb-2 text-sky-300" />Pluie<strong className="mt-1 block text-white">{weather?.precipitation ?? "--"} mm</strong></p>
          </div>
        </div>
        <section className="rounded-lg border border-slate-800 bg-[#100E18] p-5">
          <h2 className="mb-4 text-lg font-semibold text-white">Prévisions sur 7 jours</h2>
          {weather?.forecast.length ? <div className="divide-y divide-slate-800">{weather.forecast.map((day) => <div key={day.date} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-3 text-sm"><span className="text-slate-300">{day.dayName}</span><span className="text-sky-300">{day.rainProb}% pluie</span><strong className="text-white">{day.tempMax}° / {day.tempMin}°</strong></div>)}</div> : <p className="py-10 text-center text-sm text-slate-400">{loading ? "Prévisions en cours…" : "Aucune prévision disponible."}</p>}
        </section>
      </section>
    </main>
  );
}