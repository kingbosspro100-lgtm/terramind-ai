"use client";

import { useEffect, useState } from "react";
import {
  CloudSun,
  Thermometer,
  Droplets,
  Wind,
} from "lucide-react";

import AIAdvice from "./AIAdvice";
import { getWeather } from "@/services/weather";

type Props = {
  latitude: number;
  longitude: number;
  crop: string;
};

export default function WeatherCard({
  latitude,
  longitude,
  crop,
}: Props) {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    async function loadWeather() {
      try {
        const data = await getWeather(latitude, longitude);
        setWeather(data.current);
      } catch (error) {
        console.error(error);
      }
    }

    loadWeather();
  }, [latitude, longitude]);

  if (!weather) {
    return (
      <div className="rounded-3xl bg-[#0A100C] border border-emerald-900/30 p-8 shadow-2xl flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="p-4 rounded-full bg-blue-900/20 border border-blue-800/30">
            <CloudSun className="h-8 w-8 text-blue-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Analyse Météorologique
            </h3>
            <p className="text-xs text-emerald-200/60 mt-1">
              Acquisition des données atmosphériques...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-6 shadow-2xl relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
      
      {/* Glow effect */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-600/20 transition-all"></div>

      {/* En-tête */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CloudSun className="h-5 w-5 text-blue-400" />
            <span>Météo de l'exploitation</span>
          </h2>
          <p className="text-xs font-medium text-emerald-200/60 mt-1">
            Conditions atmosphériques actuelles et alertes.
          </p>
        </div>
      </div>

      {/* Données */}
      <div className="grid grid-cols-3 gap-3 relative z-10">
        <div className="rounded-2xl bg-[#0B0914]/50 border border-emerald-900/20 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/60">
              Temp.
            </span>
            <Thermometer className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">
            {weather.temperature_2m}°C
          </p>
        </div>

        <div className="rounded-2xl bg-[#0B0914]/50 border border-emerald-900/20 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/60">
              Humidité
            </span>
            <Droplets className="h-4 w-4 text-blue-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">
            {weather.relative_humidity_2m}%
          </p>
        </div>

        <div className="rounded-2xl bg-[#0B0914]/50 border border-emerald-900/20 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/60">
              Vent
            </span>
            <Wind className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">
            {weather.wind_speed_10m}
            <span className="text-sm font-semibold text-emerald-300/60 ml-1">km/h</span>
          </p>
        </div>
      </div>

      {/* IA */}
      <div className="mt-6 relative z-10">
        <AIAdvice
          temperature={weather.temperature_2m}
          humidity={weather.relative_humidity_2m}
          crop={crop}
        />
      </div>

    </div>
  );
}