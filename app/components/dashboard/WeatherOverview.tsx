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
    <div className="rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-6 md:p-8 text-white shadow-2xl">

      <div className="flex items-center justify-between">

        <div>

          <div className="flex items-center gap-2">

            <CloudSun className="h-8 w-8" />

            <h2 className="text-3xl font-bold">

              Météo

            </h2>

          </div>

          <div className="mt-2 flex items-center gap-2 text-sky-100">

            <MapPin size={18} />

            Cotonou, Bénin

          </div>

        </div>

        <div className="rounded-3xl bg-white/20 p-5 backdrop-blur">

          <CloudSun className="h-14 w-14" />

        </div>

      </div>

      {!weather ? (
        <div className="mt-10">

          Chargement...

        </div>
      ) : (
        <>
          <h3 className="mt-10 text-6xl font-black">

            {weather.temperature_2m}°

          </h3>

          <div className="mt-8 grid grid-cols-2 gap-5">

            <div className="rounded-2xl bg-white/15 p-5 backdrop-blur">

              <Thermometer className="mb-3" />

              <p className="text-sm text-sky-100">

                Température

              </p>

              <h4 className="mt-2 text-2xl font-bold">

                {weather.temperature_2m}°C

              </h4>

            </div>

            <div className="rounded-2xl bg-white/15 p-5 backdrop-blur">

              <Droplets className="mb-3" />

              <p className="text-sm text-sky-100">

                Humidité

              </p>

              <h4 className="mt-2 text-2xl font-bold">

                {weather.relative_humidity_2m}%

              </h4>

            </div>

            <div className="col-span-2 rounded-2xl bg-white/15 p-5 backdrop-blur">

              <Wind className="mb-3" />

              <p className="text-sm text-sky-100">

                Vent

              </p>

              <h4 className="mt-2 text-2xl font-bold">

                {weather.wind_speed_10m} km/h

              </h4>

            </div>

          </div>

          <div className="mt-8 rounded-2xl bg-white/20 p-5 backdrop-blur">

            🤖 TerraMind AI recommande une irrigation légère demain matin.

          </div>
        </>
      )}
    </div>
  );
}