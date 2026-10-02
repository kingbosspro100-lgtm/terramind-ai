"use client";

import { useEffect, useState } from "react";
import { CloudRain, LocateFixed, MapPin, RefreshCw, Sun, Thermometer, Wind } from "lucide-react";
import {
  COUNTRY_SUBDIVISIONS,
  fetchLiveDepartmentWeather,
  geocodeSubdivision,
  getAgriculturalWeatherAlerts,
  type LiveWeatherData,
} from "@/services/weather";
import { SUPPORTED_COUNTRIES } from "@/lib/services/exploitations";
import type { SupportedCountry } from "@/types/database";

const capitals: Record<SupportedCountry, { city: string; latitude: number; longitude: number }> = {
  "Bénin": { city: "Cotonou", latitude: 6.37, longitude: 2.43 },
  "Côte d'Ivoire": { city: "Abidjan", latitude: 5.36, longitude: -4.01 },
  "Cameroun": { city: "Yaoundé", latitude: 3.87, longitude: 11.52 },
  "Sénégal": { city: "Dakar", latitude: 14.69, longitude: -17.45 },
};
const countryCodes: Record<SupportedCountry, string> = { "Bénin": "BJ", "Côte d'Ivoire": "CI", "Cameroun": "CM", "Sénégal": "SN" };
const defaultSubdivisions: Record<SupportedCountry, string> = {
  "Bénin": "Littoral",
  "Côte d'Ivoire": "Abidjan",
  "Cameroun": "Centre",
  "Sénégal": "Dakar",
};

interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;
}

export default function DashboardWeatherPage() {
  const [country, setCountry] = useState<SupportedCountry>("Bénin");
  const [subdivision, setSubdivision] = useState(defaultSubdivisions.Bénin);
  const [city, setCity] = useState(capitals.Bénin.city);
  const [cityQuery, setCityQuery] = useState(capitals.Bénin.city);
  const [cityResults, setCityResults] = useState<GeocodingResult[]>([]);
  const [searchingCity, setSearchingCity] = useState(false);
  const [coords, setCoords] = useState({ latitude: capitals.Bénin.latitude, longitude: capitals.Bénin.longitude });
  const [weather, setWeather] = useState<LiveWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const agriculturalAlerts = weather ? getAgriculturalWeatherAlerts(weather) : [];

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

  async function changeCountry(value: SupportedCountry) {
    setCountry(value);
    const region = defaultSubdivisions[value];
    setSubdivision(region);
    setCity(region);
    setCityQuery(region);
    setCityResults([]);
    setWeather(null);
    setLoading(true);
    setError("");
    try {
      const location = await geocodeSubdivision(value, region);
      setCity(location.name);
      setCityQuery(location.name);
      setCoords({ latitude: location.latitude, longitude: location.longitude });
    } catch (cause) {
      setCoords({ latitude: capitals[value].latitude, longitude: capitals[value].longitude });
      setError(cause instanceof Error ? cause.message : "Géocodage de la région indisponible.");
    }
    setLoading(false);
  }

  async function changeSubdivision(value: string) {
    setSubdivision(value);
    setCity(value);
    setCityQuery(value);
    setCityResults([]);
    setWeather(null);
    setLoading(true);
    setError("");
    try {
      const location = await geocodeSubdivision(country, value);
      setCity(location.name);
      setCityQuery(location.name);
      setCoords({ latitude: location.latitude, longitude: location.longitude });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : `Coordonnées indisponibles pour ${value}.`);
    } finally {
      setLoading(false);
    }
  }

  function locate() {
    if (!navigator.geolocation) { setError("La géolocalisation n'est pas disponible."); return; }
    navigator.geolocation.getCurrentPosition(({ coords: position }) => {
      setWeather(null);
      setLoading(true);
      setCoords({ latitude: position.latitude, longitude: position.longitude });
      setCity("Ma position");
      setCityQuery("Ma position");
      setCityResults([]);
    }, () => setError("Position inaccessible. Vérifiez l'autorisation du navigateur."));
  }

  async function searchCity() {
    const query = cityQuery.trim();
    if (query.length < 2) { setError("Saisissez au moins deux caractères pour rechercher une ville."); return; }
    setSearchingCity(true);
    setError("");
    try {
      const params = new URLSearchParams({ name: query, count: "8", language: "fr", format: "json", countryCode: countryCodes[country] });
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`);
      if (!response.ok) throw new Error("Le service de géocodage est indisponible.");
      const payload: { results?: GeocodingResult[] } = await response.json();
      const results = (payload.results ?? []).filter((result) => result.country_code === countryCodes[country]);
      setCityResults(results);
      if (results.length === 0) setError(`Aucune ville trouvée au ${country}.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Recherche de ville impossible.");
      setCityResults([]);
    } finally {
      setSearchingCity(false);
    }
  }

  function chooseCity(result: GeocodingResult) {
    setCity(result.name);
    setCityQuery(result.name);
    setCityResults([]);
    setWeather(null);
    setLoading(true);
    setCoords({ latitude: result.latitude, longitude: result.longitude });
  }

  return (
    <main className="mx-auto max-w-6xl space-y-7 pb-12">
      <header className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end">
        <div><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-cyan">Données en direct · Open-Meteo</p><h1 className="text-3xl font-bold text-white">Météo agricole</h1><p className="mt-2 text-sm text-slate-300">Conditions actuelles et prévisions pour les quatre pays V1.</p></div>
        <button onClick={() => void refresh()} disabled={loading} title="Actualiser la météo" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 text-sm text-brand-cyan hover:bg-white/10 disabled:opacity-50"><RefreshCw size={16} className={loading ? "animate-spin" : ""} />Actualiser</button>
      </header>

      <section className="flex flex-wrap items-end gap-3">
        <label className="min-w-48 flex-1 space-y-1.5 text-sm text-slate-300">Pays<select value={country} onChange={(event) => void changeCountry(event.target.value as SupportedCountry)} className="w-full rounded-lg border border-white/10 bg-brand-card px-3 py-2.5 text-white focus:border-brand-cyan">{SUPPORTED_COUNTRIES.map((name) => <option key={name}>{name}</option>)}</select></label>
        <label className="min-w-48 flex-1 space-y-1.5 text-sm text-slate-300">Département / région<select value={subdivision} onChange={(event) => void changeSubdivision(event.target.value)} className="w-full rounded-lg border border-white/10 bg-brand-card px-3 py-2.5 text-white focus:border-brand-cyan">{COUNTRY_SUBDIVISIONS[country].map((name) => <option key={name}>{name}</option>)}</select></label>
        <label className="min-w-48 flex-1 space-y-1.5 text-sm text-slate-300">Rechercher une ville<input value={cityQuery} onChange={(event) => setCityQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void searchCity(); } }} className="w-full rounded-lg border border-slate-700 bg-[#100E18] px-3 py-2.5 text-white" /></label>
        <button onClick={() => void searchCity()} disabled={searchingCity} className="min-h-10 rounded-lg bg-gradient-gemini px-3 text-sm font-semibold text-white shadow-lg shadow-brand-purple/20 hover:brightness-110 disabled:opacity-50">{searchingCity ? "Recherche…" : "Chercher"}</button>
        <button onClick={locate} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-700 px-3 text-sm text-slate-200 hover:bg-slate-800"><LocateFixed size={16} />Ma position</button>
      </section>

      {cityResults.length > 0 && <section aria-label="Résultats de villes" className="divide-y divide-slate-800 rounded-lg border border-slate-800 bg-[#100E18]">{cityResults.map((result) => <button key={result.id} onClick={() => chooseCity(result)} className="block w-full px-4 py-3 text-left text-sm text-slate-200 hover:bg-emerald-950/40">{result.name}{result.admin1 ? `, ${result.admin1}` : ""} · {result.country}</button>)}</section>}

      {error && <p role="alert" className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-200">{error}</p>}
      {agriculturalAlerts.length > 0 && <section aria-label="Alertes agricoles personnalisées" className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Alertes agricoles · {subdivision}</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {agriculturalAlerts.map((alert) => <article key={alert.id} className={`rounded-xl border bg-brand-card/90 p-4 shadow-lg backdrop-blur-md ${alert.severity === "critical" ? "border-brand-pink/50 shadow-brand-pink/10" : "border-brand-gold/30 shadow-brand-gold/5"}`}>
            <p className="text-xs font-semibold text-brand-cyan">{alert.day}</p>
            <h3 className="mt-1 font-semibold text-white">{alert.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{alert.recommendation}</p>
          </article>)}
        </div>
      </section>}
      <section className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-xl border border-white/10 bg-brand-card/85 p-6 shadow-[0_0_32px_rgb(0_198_255/6%)] backdrop-blur-md">
          <p className="flex items-center gap-2 text-sm text-slate-300"><MapPin size={16} className="text-brand-cyan" />{city}, {country}</p>
          <div className="mt-8 flex items-center gap-4">{weather?.weatherCode === 0 ? <Sun className="text-amber-300" size={48} /> : <CloudRain className="text-sky-300" size={48} />}<strong className="text-6xl font-semibold text-white">{loading ? "…" : `${weather?.temp ?? "--"}°`}</strong></div>
          <p className="mt-3 text-slate-300">{loading ? "Chargement des relevés…" : weather?.conditionText}</p>
          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-slate-800 pt-5 text-sm">
            <p className="text-slate-400"><Thermometer size={16} className="mb-2 text-rose-300" />Humidité<strong className="mt-1 block text-white">{weather?.humidity ?? "--"}%</strong></p>
            <p className="text-slate-400"><Wind size={16} className="mb-2 text-teal-300" />Vent<strong className="mt-1 block text-white">{weather?.windSpeed ?? "--"} km/h</strong></p>
            <p className="text-slate-400"><CloudRain size={16} className="mb-2 text-sky-300" />Pluie<strong className="mt-1 block text-white">{weather?.precipitation ?? "--"} mm</strong></p>
          </div>
        </div>
        <section className="rounded-xl border border-white/10 bg-brand-card/85 p-5 shadow-[0_0_32px_rgb(138_43_226/6%)] backdrop-blur-md">
          <h2 className="mb-4 text-lg font-semibold text-white">Prévisions sur 7 jours</h2>
          {weather?.forecast.length ? <div className="divide-y divide-slate-800">{weather.forecast.map((day) => <div key={day.date} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-3 text-sm"><span className="text-slate-300">{day.dayName}</span><span className="text-sky-300">{day.rainProb}% pluie</span><strong className="text-white">{day.tempMax}° / {day.tempMin}°</strong></div>)}</div> : <p className="py-10 text-center text-sm text-slate-400">{loading ? "Prévisions en cours…" : "Aucune prévision disponible."}</p>}
        </section>
      </section>
    </main>
  );
}