"use client";

import dynamic from "next/dynamic";
import {
  MapPinned,
  Navigation,
  ExternalLink,
} from "lucide-react";

const FarmMap = dynamic(() => import("./FarmMap"), {
  ssr: false,
});

type Props = {
  latitude: number;
  longitude: number;
  name: string;
};

export default function FarmMapWrapper({
  latitude,
  longitude,
  name,
}: Props) {
  return (
    <div className="overflow-hidden rounded-3xl bg-[#0A100C] border border-emerald-900/30 shadow-2xl flex flex-col h-full group hover:border-emerald-500/40 transition-all duration-300">

      {/* En-tête */}
      <div className="flex items-center justify-between border-b border-emerald-900/30 bg-[#0B0914]/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-900/40 text-emerald-400 border border-emerald-800/50">
            <MapPinned size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              Géolocalisation
            </h2>
            <p className="text-[11px] text-emerald-300/60 font-medium">
              {name}
            </p>
          </div>
        </div>

        <a
          href={`https://www.google.com/maps?q=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl bg-[#1C183B] border border-emerald-800/40 px-3 py-1.5 text-[11px] font-bold text-emerald-200 transition hover:bg-emerald-900/50 hover:text-white"
        >
          <span>Google Maps</span>
          <ExternalLink size={14} />
        </a>
      </div>

      {/* Carte */}
      <div className="h-[250px] md:h-[300px] lg:flex-1 relative w-full overflow-hidden">
        {/* Filtre assombrissant par dessus la carte Leaflet pour l'harmoniser avec le thème sombre */}
        <div className="absolute inset-0 bg-[#0B0914]/20 pointer-events-none z-[400] mix-blend-multiply"></div>
        <FarmMap
          latitude={latitude}
          longitude={longitude}
          name={name}
        />
      </div>

      {/* Coordonnées */}
      <div className="border-t border-emerald-900/30 bg-[#0B0914]/80 px-6 py-3">
        <div className="flex items-center gap-4 text-[11px] font-semibold text-emerald-300/80">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Navigation size={14} />
            <span>GPS Fix</span>
          </div>
          <div className="flex gap-3">
            <span>
              Lat: <strong className="text-white font-mono">{latitude}</strong>
            </span>
            <span>
              Lng: <strong className="text-white font-mono">{longitude}</strong>
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}