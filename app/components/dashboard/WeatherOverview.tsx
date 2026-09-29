"use client";

import { useEffect, useState } from "react";
import {
  CloudSun,
  Thermometer,
  Droplets,
  Wind,
  MapPin,
} from "lucide-react";

type Weather = {
  temperature_2m: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
};

export default function WeatherOverview() {
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    async function loadWeather() {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=6.37&longitude=2.43&current=temperature_2m,relative_humidity_2m,wind_speed_10m"
        );

        const data = await response.json();

        setWeather(data.current);
      } catch (error) {
        console.error(error);
      }
    }

    loadWeather();
  }, []);

  return (
    <div className="rounded-3xl border border-emerald-900/30 bg-gradient-to-br from-[#181436] via-[#101a2b] to-[#050A07] p-6 text-white shadow-2xl shadow-slate-950/20 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-sky-500/15 p-2 text-sky-300">
              <CloudSun className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold">Météo</h2>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-sky-100/90">
            <MapPin size={16} className="text-emerald-300" />
            Cotonou, Bénin
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm">
          <CloudSun className="h-10 w-10 text-emerald-300" />
        </div>
      </div>

      {!weather ? (
        <div className="mt-10 rounded-2xl border border-white/10 bg-slate-900/30 p-4 text-sm text-slate-200">
          Chargement...
        </div>
      ) : (
        <>
          <h3 className="mt-10 text-5xl font-black tracking-tight sm:text-6xl">{weather.temperature_2m}°</h3>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
              <Thermometer className="mb-3 h-5 w-5 text-sky-300" />
              <p className="text-sm text-sky-100/80">Température</p>
              <h4 className="mt-2 text-2xl font-bold">{weather.temperature_2m}°C</h4>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
              <Droplets className="mb-3 h-5 w-5 text-cyan-300" />
              <p className="text-sm text-sky-100/80">Humidité</p>
              <h4 className="mt-2 text-2xl font-bold">{weather.relative_humidity_2m}%</h4>
            </div>

            <div className="col-span-2 rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
              <Wind className="mb-3 h-5 w-5 text-emerald-300" />
              <p className="text-sm text-sky-100/80">Vent</p>
              <h4 className="mt-2 text-2xl font-bold">{weather.wind_speed_10m} km/h</h4>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
            🤖 TerraMind AI recommande une irrigation légère demain matin.
          </div>
        </>
      )}
    </div>
  );
}