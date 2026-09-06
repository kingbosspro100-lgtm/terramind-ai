"use client";

import Logo from "../ui/Logo";
import Link from "next/link";
import { Menu, X, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language-context";

export default function Navbar() {
  const { publicLanguage, setPublicLanguage, publicT } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: publicLanguage === "en" ? "Features" : "Fonctionnalités", href: "/fonctionnalites" },
    { label: publicLanguage === "en" ? "Demo" : "Démo", href: "/demo" },
    { label: publicLanguage === "en" ? "Pricing" : "Tarifs", href: "/tarifs" },
    { label: "FAQ", href: "/faq" },
    { label: publicLanguage === "en" ? "Reviews" : "Avis", href: "/avis" },
  ];

  const togglePublicLanguage = () => {
    setPublicLanguage(publicLanguage === "fr" ? "en" : "fr");
  };

  return (
    <header className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${scrolled ? "border-b border-emerald-900/20 bg-slate-950/80 shadow-lg backdrop-blur-xl" : "bg-transparent"}`}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <Logo width={48} height={48} />
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-white" style={{ fontFamily: "'Times New Roman', Times, serif" }}>TerraMind AI</h1>
            <p className="mt-0.5 text-xs font-bold text-emerald-400 uppercase tracking-widest">{publicT.smartAgri}</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-3 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-4 py-2.5 text-base font-extrabold text-emerald-300 transition hover:bg-emerald-950/60 hover:text-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          {/* Public Language Toggle Button */}
          <button
            type="button"
            onClick={togglePublicLanguage}
            className="flex items-center gap-2 rounded-xl border border-emerald-800/40 bg-[#0A100C] px-3.5 py-2 text-xs font-bold text-emerald-300 hover:text-white hover:border-emerald-500/50 transition"
            title="Changer de langue"
          >
            <Globe className="h-4 w-4 text-emerald-400" />
            <span>{publicLanguage === "fr" ? "EN 🇬🇧" : "FR 🇫🇷"}</span>
          </button>

          <Link href="/login" className="rounded-xl px-5 py-2.5 text-base font-extrabold text-emerald-300 hover:text-white hover:bg-emerald-950/60 transition">
            {publicT.navLogin}
          </Link>
          <Link href="/tarifs" className="rounded-xl bg-gradient-to-r from-emerald-600 via-green-600 to-lime-500 px-6 py-2.5 text-base font-extrabold text-white shadow-xl shadow-emerald-600/30 transition hover:scale-105">
            {publicT.navRegisterFree}
          </Link>
        </div>

        <button aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} onClick={() => setOpen(!open)} className="text-emerald-400 lg:hidden p-2">
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-emerald-900/30 bg-[#0E0C1F] lg:hidden">
          <nav className="flex flex-col p-6 space-y-2">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-lg font-bold text-emerald-300 hover:bg-emerald-950/60 hover:text-white">
                {link.label}
              </Link>
            ))}

            <button
              type="button"
              onClick={() => {
                togglePublicLanguage();
                setOpen(false);
              }}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-emerald-800/40 bg-[#0A100C] py-3 text-sm font-bold text-emerald-300"
            >
              <Globe className="h-4 w-4 text-emerald-400" />
              <span>{publicLanguage === "fr" ? "Passer en English 🇬🇧" : "Switch to French 🇫🇷"}</span>
            </button>

            <Link href="/login" className="mt-4 rounded-xl border border-emerald-800/40 bg-[#0A100C] px-4 py-3 text-center text-base font-bold text-emerald-300">
              {publicT.navLogin}
            </Link>
            <Link href="/tarifs" className="mt-2 rounded-xl bg-gradient-to-r from-emerald-600 via-green-600 to-lime-500 px-4 py-3 text-center text-base font-bold text-white shadow-lg">
              {publicT.navRegisterFree}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
