"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

const DYNAMIC_WORDS_FR = [
  "agriculture",
  "patrimoine",
  "organisation",
  "ONG",
  "entreprise",
  "activité",
];

const DYNAMIC_WORDS_EN = [
  "agriculture",
  "heritage",
  "organization",
  "NGO",
  "business",
  "activity",
];

export default function HeroContent() {
  const { language, t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const words = language === "en" ? DYNAMIC_WORDS_EN : DYNAMIC_WORDS_FR;

  useEffect(() => {
    const timer = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setIsFading(false);
      }, 350);
    }, 2800);

    return () => clearInterval(timer);
  }, [words]);

  return (
    <div className="text-center">
      {/* Badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-4 py-2 text-sm font-semibold text-emerald-300 backdrop-blur-md">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        {t.heroBadge}
      </div>

      {/* Headline with dynamic text */}
      <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl leading-tight">
        TerraMind AI
        <span className="block mt-2 font-black text-white">
          {t.heroPrefix}{" "}
          <span className="inline-block relative min-w-[200px] sm:min-w-[300px] text-center align-bottom">
            <span
              className={`inline-block text-emerald-400 transition-all duration-700 ease-in-out transform motion-reduce:transition-none ${
                isFading
                  ? "opacity-0 translate-y-3 scale-95"
                  : "opacity-100 translate-y-0 scale-100"
              }`}
            >
              {words[index]}
            </span>
          </span>
        </span>
      </h1>

      {/* Proposition de valeur */}
      <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-emerald-100/80 sm:text-xl font-medium">
        {t.heroDesc}
      </p>

      {/* Promesse */}
      <div className="mx-auto mt-7 flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-semibold text-white">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="text-emerald-400" size={18} />
          {t.heroPromise1}
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle2 className="text-emerald-400" size={18} />
          {t.heroPromise2}
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle2 className="text-emerald-400" size={18} />
          {t.heroPromise3}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link
          href="/tarifs"
          className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 px-7 py-4 text-base font-bold text-white shadow-xl shadow-emerald-600/30 transition-all duration-300 hover:-translate-y-1 hover:opacity-95"
        >
          <span>{t.heroCTAStart}</span>
          <ArrowRight
            size={20}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>

        <Link
          href="/fonctionnalites"
          className="inline-flex items-center rounded-2xl border border-emerald-500/30 bg-[#0A100C]/60 px-7 py-4 text-base font-bold text-emerald-200 backdrop-blur-md transition-all duration-300 hover:bg-emerald-950/60 hover:text-white"
        >
          {t.heroCTAFeatures}
        </Link>
      </div>

      {/* Confiance */}
      <p className="mt-5 text-sm text-emerald-200/60 font-medium">
        {t.heroTrustText}
      </p>
    </div>
  );
}