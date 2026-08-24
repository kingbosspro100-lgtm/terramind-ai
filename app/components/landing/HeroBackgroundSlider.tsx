"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const SLIDES = [
  {
    src: "/hero-slide-1.jpg",
    alt: "Agriculteur africain avec technologie mobile dans son champ",
  },
  {
    src: "/hero-slide-2.jpg",
    alt: "Vue aérienne d'une exploitation agricole irriguée en Afrique",
  },
  {
    src: "/hero-slide-3.jpg",
    alt: "Récoltes abondantes et coopérative agricole africaine",
  },
  {
    src: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=80",
    alt: "Champs d'or et agriculture de précision",
  },
  {
    src: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1920&q=80",
    alt: "Technologie agricole et capteurs intelligents dans le sol",
  },
  {
    src: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1920&q=80",
    alt: "Irrigation moderne et gestion durable des sols",
  },
  {
    src: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1920&q=80",
    alt: "Cultures vivrières et verdure luxuriante",
  },
  {
    src: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1920&q=80",
    alt: "Technologie de drone et surveillance de récoltes",
  },
  {
    src: "https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=1920&q=80",
    alt: "Tracteur autonome et mécanisation agricole",
  },
  {
    src: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=1920&q=80",
    alt: "Agriculteurs africains experts et production locale",
  },
];

export default function HeroBackgroundSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {SLIDES.map((slide, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-90" : "opacity-0"
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={idx === 0}
              unoptimized={slide.src.startsWith("http")}
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
        );
      })}

      {/* Overlays for dark contrast and readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-slate-950/20 to-slate-950/50" />
      <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[1px]" />
    </div>
  );
}
