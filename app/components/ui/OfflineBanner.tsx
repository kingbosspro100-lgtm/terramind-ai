"use client";

import { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    // Service Worker Registration
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("Service Worker enregistré avec succès:", reg.scope))
        .catch((err) => console.warn("Erreur lors de l'enregistrement du Service Worker:", err));
    }

    const handleOffline = () => {
      setIsOffline(true);
      setShowRestored(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowRestored(true);
      setTimeout(() => setShowRestored(false), 4000);
    };

    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      window.addEventListener("offline", handleOffline);
      window.addEventListener("online", handleOnline);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("offline", handleOffline);
        window.removeEventListener("online", handleOnline);
      }
    };
  }, []);

  if (!isOffline && !showRestored) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      {isOffline ? (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/90 to-[#181436] p-4 text-xs font-bold text-amber-200 shadow-2xl backdrop-blur-md">
          <div className="rounded-xl bg-amber-900/50 p-2 text-amber-400">
            <WifiOff className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <p className="font-extrabold text-white text-sm">Mode Hors-Ligne Actif (PWA)</p>
            <p className="text-amber-200/80 font-medium text-[11px]">
              Vos données mises en cache restent accessibles sans réseau internet.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/90 to-[#181436] p-4 text-xs font-bold text-emerald-200 shadow-2xl backdrop-blur-md">
          <div className="rounded-xl bg-emerald-900/50 p-2 text-emerald-400">
            <Wifi className="h-5 w-5" />
          </div>
          <div>
            <p className="font-extrabold text-white text-sm">Connexion Rétablie</p>
            <p className="text-emerald-200/80 font-medium text-[11px]">
              TerraMind AI est de nouveau synchronisé en ligne.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
