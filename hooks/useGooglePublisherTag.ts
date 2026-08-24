"use client";

import { useEffect, useState } from "react";

export function useGooglePublisherTag() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initialiser window.googletag selon les spécifications officielles Google
    window.googletag = window.googletag || ({ cmd: [] } as any);

    const GPT_SCRIPT_ID = "gpt-js-sdk";
    const existingScript = document.getElementById(GPT_SCRIPT_ID);

    if (existingScript) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.id = GPT_SCRIPT_ID;
    script.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
    script.async = true;
    script.onload = () => {
      window.googletag.cmd.push(() => {
        setIsLoaded(true);
      });
    };
    script.onerror = (err) => {
      console.error("Erreur de chargement du SDK Google Publisher Tag (GPT):", err);
    };

    document.head.appendChild(script);
  }, []);

  return { isLoaded, googletag: typeof window !== "undefined" ? window.googletag : undefined };
}
