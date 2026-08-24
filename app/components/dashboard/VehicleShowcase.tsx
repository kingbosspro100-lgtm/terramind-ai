"use client";

import { Heart, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { useState } from "react";

export default function VehicleShowcase() {
  const [liked, setLiked] = useState(true);

  return (
    <div className="grid gap-6 lg:grid-cols-12">

      {/* Main Vehicle Showcase (Volvo EX30) - 6 Cols */}
      <div className="lg:col-span-6 rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-6 md:p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden group">

        {/* Ambient Stage Glow */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-80 h-32 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Card Header */}
        <div className="flex items-start justify-between z-10">
          <div>
            <h3 className="text-xl font-bold text-white tracking-wide">
              Volvo EX30
            </h3>
            <p className="text-xs text-emerald-300/60 font-medium mt-1">
              Fully electric crossover
            </p>
          </div>

          <button
            onClick={() => setLiked(!liked)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-950/60 border border-emerald-800/30 transition hover:scale-105"
          >
            <Heart
              className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : "text-emerald-300"
                }`}
            />
          </button>
        </div>

        {/* Vehicle 3D Platform Center Visual */}
        <div className="relative my-6 flex flex-col items-center justify-center z-10">

          {/* Stage Platform Ring */}
          <div className="relative w-full max-w-md h-52 flex items-center justify-center">
            {/* Background 3D Podium Oval */}
            <div className="absolute bottom-4 w-72 h-20 rounded-full bg-gradient-to-t from-emerald-950/80 to-emerald-800/30 border border-emerald-500/30 shadow-[0_0_50px_rgba(123,97,255,0.4)] transform rotate-x-60"></div>

            {/* High-res Car Image on Stage */}
            <img
              src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80"
              alt="Volvo EX30"
              className="relative z-10 max-h-44 object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Navigation Controls (< >) */}
          <div className="mt-2 flex items-center gap-1.5 rounded-full bg-[#1A153A] border border-emerald-900/40 p-1">
            <button className="flex h-7 w-7 items-center justify-center rounded-full text-emerald-300 hover:bg-emerald-800/40 hover:text-white transition">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded-full text-emerald-300 hover:bg-emerald-800/40 hover:text-white transition">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="flex items-center justify-end gap-6 border-t border-emerald-900/20 pt-4 z-10">
          <p className="text-xs text-emerald-300/70 font-medium">
            Deals <span className="text-base font-bold text-white ml-1">64</span>
          </p>
          <p className="text-xs text-emerald-300/70 font-medium">
            Rate <span className="text-base font-bold text-white ml-1">4.8</span>
          </p>
          <p className="text-xs text-emerald-300/70 font-medium">
            Seats <span className="text-base font-bold text-white ml-1">5</span>
          </p>
        </div>

      </div>

      {/* Item Card 1: Porche 911 - 3 Cols */}
      <div className="lg:col-span-3 rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-6 shadow-2xl flex flex-col justify-between group">
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-lg font-bold text-white tracking-wide">
                Porche 911
              </h4>
              <p className="text-xs text-emerald-300/60 font-medium mt-0.5">
                2025 Sport Edition
              </p>
            </div>

            <button className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-950/50 text-emerald-300 hover:bg-emerald-900/60 hover:text-white transition">
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#1A1638] border border-emerald-900/30 px-3 py-1 text-[10px] font-semibold text-emerald-300">
              #3110-011-852 Auction
            </span>
            <span className="rounded-full bg-[#1A1638] border border-emerald-900/30 px-3 py-1 text-[10px] font-semibold text-emerald-300">
              $4.590 Shipping
            </span>
          </div>
        </div>

        {/* Car Stage Visual */}
        <div className="relative my-4 flex items-center justify-center h-36">
          <div className="absolute bottom-2 w-48 h-12 rounded-full bg-emerald-950/60 border border-emerald-800/30"></div>
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80"
            alt="Porche 911"
            className="relative z-10 max-h-28 object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Item Card 2: Nissan GT-R - 3 Cols */}
      <div className="lg:col-span-3 rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-6 shadow-2xl flex flex-col justify-between group">
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-lg font-bold text-white tracking-wide">
                Nissan GT- R
              </h4>
              <p className="text-xs text-emerald-300/60 font-medium mt-0.5">
                2025 Sport Edition
              </p>
            </div>

            <button className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-950/50 text-emerald-300 hover:bg-emerald-900/60 hover:text-white transition">
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#1A1638] border border-emerald-900/30 px-3 py-1 text-[10px] font-semibold text-emerald-300">
              #5110-011-853 Auction
            </span>
            <span className="rounded-full bg-[#1A1638] border border-emerald-900/30 px-3 py-1 text-[10px] font-semibold text-emerald-300">
              $4.890 Shipping
            </span>
          </div>
        </div>

        {/* Car Stage Visual */}
        <div className="relative my-4 flex items-center justify-center h-36">
          <div className="absolute bottom-2 w-48 h-12 rounded-full bg-emerald-950/60 border border-emerald-800/30"></div>
          <img
            src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=80"
            alt="Nissan GT-R"
            className="relative z-10 max-h-28 object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

    </div>
  );
}
