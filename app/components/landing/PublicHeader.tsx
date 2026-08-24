"use client";

import Logo from "../ui/Logo";
import Link from "next/link";
import { Globe, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function PublicHeader() {
  const { publicLanguage, setPublicLanguage, publicT } = useLanguage();

  const togglePublicLanguage = () => {
    setPublicLanguage(publicLanguage === "fr" ? "en" : "fr");
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-emerald-900/20 bg-slate-950/80 shadow-lg backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <Logo width={42} height={42} />
          <div>
            <h1 className="text-lg md:text-xl font-extrabold text-white" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
              TerraMind AI
            </h1>
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{publicT.smartAgri}</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {/* Public Language Toggle Button */}
          <button
            type="button"
            onClick={togglePublicLanguage}
            className="flex items-center gap-2 rounded-xl border border-emerald-800/40 bg-[#0A100C] px-4 py-2.5 text-xs font-bold text-emerald-300 hover:text-white hover:border-emerald-500/50 hover:bg-[#1C183B] transition shadow-md"
            title="Changer de langue / Change language"
          >
            <Globe className="h-4 w-4 text-emerald-400" />
            <span>{publicLanguage === "fr" ? "EN 🇬🇧" : "FR 🇫🇷"}</span>
          </button>

          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-emerald-900/40 bg-[#120E2B] px-4 py-2.5 text-xs font-bold text-emerald-300 hover:text-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{publicLanguage === "en" ? "Home" : "Accueil"}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
