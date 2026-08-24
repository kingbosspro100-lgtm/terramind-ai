"use client";

import { useState, useEffect } from "react";
import {
  CloudSun,
  Droplets,
  Wind,
  CloudRain,
  Sun,
  Eye,
  Gauge,
  MapPin,
  AlertTriangle,
  Radar,
  CloudLightning,
  RefreshCw,
  ChevronDown,
  Loader2,
} from "lucide-react";
import {
  BENIN_DEPARTMENTS,
  fetchLiveDepartmentWeather,
  LiveWeatherData,
  DepartmentConfig,
} from "@/services/weather";
import { useLanguage } from "@/lib/language-context";

export default function WeatherPage() {
  const { t } = useLanguage();
  const [selectedDeptId, setSelectedDeptId] = useState<string>("littoral");
  const [weatherData, setWeatherData] = useState<LiveWeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [lastRefresh, setLastRefresh] = useState<string>("");

  const currentDept: DepartmentConfig =
    BENIN_DEPARTMENTS.find((d) => d.id === selectedDeptId) || BENIN_DEPARTMENTS[7]; // Littoral Cotonou par défaut

  const loadWeather = async (dept: DepartmentConfig) => {
    setLoading(true);
    setError("");
    try {
      const liveData = await fetchLiveDepartmentWeather(dept.lat, dept.lon);
      setWeatherData(liveData);
      setLastRefresh(
        new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(new Date())
      );
    } catch (err: any) {
      console.error("Erreur chargement météo béninoise:", err);
      setError("Impossible de charger les données météo en direct pour ce département.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(currentDept);
    // Rafraîchissement automatique toutes les 10 minutes
    const timer = setInterval(() => loadWeather(currentDept), 10 * 60 * 1000);
    return () => clearInterval(timer);
  }, [selectedDeptId]);

  // Obtenir l'icône météo appropriée selon le weatherCode
  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="h-9 w-9 text-amber-400" />;
    if (code === 1 || code === 2) return <CloudSun className="h-9 w-9 text-blue-300" />;
    if (code >= 61 && code <= 67) return <CloudRain className="h-9 w-9 text-blue-400" />;
    if (code >= 95) return <CloudLightning className="h-9 w-9 text-purple-400" />;
    return <CloudSun className="h-9 w-9 text-blue-300" />;
  };

  // Recommandation agronomique dynamique selon les relevés réels du département
  const getAgroAdvice = (dept: DepartmentConfig, data: LiveWeatherData | null) => {
    if (!data) return "Vérification des conditions en cours...";
    if (data.humidity > 80) {
      return `Forte humidité relative (${data.humidity}%) dans le département de ${dept.name} (${dept.chefLieu}). Risque accru de rouille foliaire et mildiou. Surveillez vos cultures.`;
    }
    if (data.temp > 33) {
      return `Température élevée (${data.temp}°C) dans le département de ${dept.name} (${dept.chefLieu}). Stress hydrique possible. Privilégiez l'irrigation tôt le matin ou en fin de journée.`;
    }
    if (data.precipitation > 0) {
      return `Pluviométrie récente détectée à ${dept.chefLieu}. Excellent créneau pour le semis ou le repiquage des légumes et cultures vivrières.`;
    }
    return `Conditions agricoles stables dans le département de ${dept.name} (${dept.chefLieu}). Climat favorable aux travaux champêtres réguliers.`;
  };

  return (
    <main className="space-y-8 max-w-7xl mx-auto pb-16 text-white">
      {/* En-tête avec Sélecteur des 12 Départements du Bénin */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-emerald-900/30 pb-6 shrink-0">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3 py-1 text-[11px] font-semibold text-emerald-300 mb-3">
            <Radar className="h-3 w-3 text-emerald-400" />
            <span>MÉTÉO AGRICOLE DU BÉNIN (12 DÉPARTEMENTS EN DIRECT)</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            {t.weatherTitle}
          </h1>
          <p className="mt-1 text-sm text-emerald-200/70 font-medium max-w-2xl">
            Données météo réelles en direct et prévisions sur 7 jours pour les 12 départements béninois.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Sélecteur des 12 Départements */}
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400 pointer-events-none" />
            <select
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              className="appearance-none rounded-2xl bg-[#0A100C] border border-emerald-500/40 pl-10 pr-10 py-2.5 text-xs font-bold text-white outline-none focus:border-emerald-400 cursor-pointer shadow-md"
            >
              {BENIN_DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.chefLieu})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400/60 pointer-events-none" />
          </div>

          <button
            onClick={() => loadWeather(currentDept)}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#0A100C] border border-emerald-900/40 px-4 py-2.5 text-xs font-bold text-emerald-300 hover:bg-[#1C183B] hover:text-white transition shadow-sm disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin text-emerald-400" /> : <RefreshCw className="h-4 w-4" />}
            <span>{lastRefresh ? `Actualisé à ${lastRefresh}` : "Actualiser"}</span>
          </button>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-950/40 p-4 text-xs font-semibold text-red-300 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Hero Weather Card (Données Réelles du Département Sélectionné) */}
      <section className="rounded-3xl bg-gradient-to-r from-[#181436] via-[#0D1510] to-[#050A07] border border-emerald-900/30 p-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4 group-hover:bg-blue-600/20 transition-all duration-700"></div>
        <div className="flex flex-col justify-between gap-10 lg:flex-row items-center relative z-10">
          <div>
            <div className="flex items-center gap-2 text-emerald-300/80 mb-2">
              <MapPin className="h-5 w-5 text-blue-400" />
              <span className="font-bold tracking-wide text-lg">
                Département de l'{currentDept.name} ({currentDept.chefLieu}) — Bénin
              </span>
            </div>
            <h2 className="mt-2 text-7xl md:text-8xl font-black text-white tracking-tighter">
              {weatherData ? `${weatherData.temp}°` : "--°"}
              <span className="text-4xl text-emerald-300/40">C</span>
            </h2>
            <p className="mt-4 text-xl font-medium text-emerald-200">
              {weatherData?.conditionText || "Chargement des conditions météo en direct…"}
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-blue-400/20 blur-3xl rounded-full" />
            <Sun className="h-36 w-36 text-amber-400 relative z-10 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Indicateurs Clés Réels (Humidité, Vent, Pluie, Visibilité) */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Humidité Relative",
            value: weatherData ? `${weatherData.humidity}%` : "--%",
            icon: Droplets,
            color: "text-blue-400",
            bg: "bg-blue-900/20",
            border: "border-blue-800/30",
          },
          {
            label: "Vitesse du Vent",
            value: weatherData ? `${weatherData.windSpeed} km/h` : "-- km/h",
            icon: Wind,
            color: "text-emerald-400",
            bg: "bg-emerald-900/20",
            border: "border-emerald-800/30",
          },
          {
            label: "Précipitations Actuelles",
            value: weatherData ? `${weatherData.precipitation} mm` : "-- mm",
            icon: CloudRain,
            color: "text-blue-300",
            bg: "bg-blue-950/30",
            border: "border-blue-800/30",
          },
          {
            label: "Statut Climatologique",
            value: weatherData?.conditionText || "--",
            icon: Eye,
            color: "text-amber-400",
            bg: "bg-amber-900/20",
            border: "border-amber-800/30",
          },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="rounded-3xl bg-[#0A100C] border border-emerald-900/30 p-6 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition"
            >
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/60">
                  {stat.label}
                </p>
                <div className={`p-2.5 rounded-xl ${stat.bg} border ${stat.border} ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight truncate">{stat.value}</h3>
            </div>
          );
        })}
      </section>

      {/* Alerte Agronomique TerraMind Copilot pour le Département Sélectionné */}
      <section className="rounded-3xl bg-gradient-to-r from-red-900/40 via-[#181436] to-amber-900/30 border border-amber-500/40 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
        <div className="flex items-start gap-4 relative z-10">
          <div className="p-3 rounded-xl bg-amber-600/20 text-amber-400 shrink-0 border border-amber-500/30">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white mb-1">
              Conseil & Alerte Agronomique TerraMind ({currentDept.name})
            </h3>
            <p className="text-sm text-emerald-200/90 font-medium leading-relaxed">
              {getAgroAdvice(currentDept, weatherData)}
            </p>
          </div>
        </div>
      </section>

      {/* Prévisions Réelles sur 7 Jours à partir d'Aujourd'hui */}
      <section className="rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-8 shadow-2xl">
        <h2 className="mb-6 text-xl font-bold text-white tracking-tight">
          Prévisions Météo Réelles sur 7 Jours — Département de l'{currentDept.name} ({currentDept.chefLieu})
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-emerald-400 space-y-3">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-xs font-semibold">Chargement des prévisions sur 7 jours…</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
            {weatherData?.forecast.map((day, idx) => {
              const isRain = day.rainProb >= 50;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border p-4 text-center transition duration-300 hover:-translate-y-1 shadow-sm ${
                    isRain
                      ? "bg-blue-950/30 border-blue-800/40 hover:border-blue-500/60"
                      : "bg-[#0B0914]/50 border-emerald-900/20 hover:border-emerald-500/40"
                  }`}
                >
                  <p className="text-[11px] font-bold text-emerald-200/80 uppercase tracking-wider mb-2 min-h-[32px] flex items-center justify-center">
                    {day.dayName}
                  </p>
                  <div className="flex justify-center mb-3">
                    {getWeatherIcon(day.weatherCode)}
                  </div>
                  <h3 className="text-2xl font-black text-white mb-1">
                    {day.tempMax}°<span className="text-xs text-slate-400 font-normal"> / {day.tempMin}°</span>
                  </h3>
                  <p className="text-[10px] text-slate-300 font-medium mb-1 truncate">{day.conditionText}</p>
                  <p className={`text-xs font-bold ${isRain ? "text-blue-400 font-extrabold" : "text-slate-400"}`}>
                    <Droplets className="inline-block h-3 w-3 mr-0.5" />
                    {day.rainProb}% pluie
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
