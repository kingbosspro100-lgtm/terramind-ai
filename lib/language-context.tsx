"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations } from "./translations";

interface LanguageContextType {
  language: Language; // Backward compatibility for dashboard
  dashboardLanguage: Language;
  publicLanguage: Language;
  setLanguage: (lang: Language) => void;
  setDashboardLanguage: (lang: Language) => void;
  setPublicLanguage: (lang: Language) => void;
  t: typeof translations.fr;
  publicT: typeof translations.fr;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "fr",
  dashboardLanguage: "fr",
  publicLanguage: "fr",
  setLanguage: () => {},
  setDashboardLanguage: () => {},
  setPublicLanguage: () => {},
  t: translations.fr,
  publicT: translations.fr,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [dashboardLanguage, setDashboardLanguageState] = useState<Language>("fr");
  const [publicLanguage, setPublicLanguageState] = useState<Language>("fr");

  useEffect(() => {
    const savedDash = localStorage.getItem("terramind_dashboard_language") || localStorage.getItem("terramind_language");
    if (savedDash && (savedDash === "fr" || savedDash === "en")) {
      setDashboardLanguageState(savedDash as Language);
    }
    const savedPub = localStorage.getItem("terramind_public_language");
    if (savedPub && (savedPub === "fr" || savedPub === "en")) {
      setPublicLanguageState(savedPub as Language);
    }
  }, []);

  const setDashboardLanguage = (lang: Language) => {
    setDashboardLanguageState(lang);
    localStorage.setItem("terramind_dashboard_language", lang);
    localStorage.setItem("terramind_language", lang);
  };

  const setPublicLanguage = (lang: Language) => {
    setPublicLanguageState(lang);
    localStorage.setItem("terramind_public_language", lang);
  };

  const setLanguage = (lang: Language) => {
    setDashboardLanguage(lang);
  };

  const t = translations[dashboardLanguage] || translations.fr;
  const publicT = translations[publicLanguage] || translations.fr;

  return (
    <LanguageContext.Provider
      value={{
        language: dashboardLanguage,
        dashboardLanguage,
        publicLanguage,
        setLanguage,
        setDashboardLanguage,
        setPublicLanguage,
        t,
        publicT,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

