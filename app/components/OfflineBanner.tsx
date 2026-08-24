"use client";

import { useState, useEffect } from "react";
import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

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

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 w-[90%] max-w-md rounded-2xl border border-amber-500/40 bg-[#0E0A1F]/95 p-3.5 shadow-2xl backdrop-blur-md text-white animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-500/20 p-2 text-amber-400 border border-amber-500/30">
            <WifiOff className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-amber-300">Mode Hors Ligne Activé</p>
            <p className="text-[10px] text-slate-300">
              Accès en cache local. La synchronisation reprendra automatiquement dès la reconnexion.
            </p>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          title="Réessayer la connexion"
          className="rounded-xl border border-amber-500/30 bg-amber-950/60 p-2 text-amber-300 hover:text-white transition shrink-0"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
