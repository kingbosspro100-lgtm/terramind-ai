"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { createClient } from "@/lib/client";
import { useLanguage } from "@/lib/language-context";

type Item = { label: string; detail: string; href: string; type: string };

export default function Header({ toggleSidebar }: { toggleSidebar?: () => void }) {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [accountItems, setAccountItems] = useState<Item[]>([]);

  const pages: Item[] = [
    { label: t.navHome, detail: "Guide TerraMind", href: "/home", type: "Page" },
    { label: t.navDashboard, detail: "Vue d'ensemble", href: "/dashboard", type: "Page" },
    { label: t.navFarms, detail: "Vos parcelles", href: "/farms", type: "Page" },
    { label: t.navCrops, detail: "Semis et récoltes", href: "/crops", type: "Page" },
    { label: t.navStock, detail: "Inventaire", href: "/stock", type: "Page" },
    { label: t.navWeather, detail: "Prévisions", href: "/weather", type: "Page" },
    { label: t.navFinance, detail: "Revenus et dépenses", href: "/finance", type: "Page" },
    { label: t.navAI, detail: "TerraMind Copilot", href: "/ai", type: "Page" },
    { label: t.navSettings, detail: "Compte et préférences", href: "/settings", type: "Page" },
  ];

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("farms").select("name,city"),
      supabase.from("crops").select("name,status"),
      supabase.from("stock").select("name,category"),
    ]).then(([farms, crops, stock]) =>
      setAccountItems([
        ...(farms.data ?? []).map((x: any) => ({ label: x.name, detail: x.city || "Exploitation", href: "/farms", type: "Exploitation" })),
        ...(crops.data ?? []).map((x: any) => ({ label: x.name, detail: x.status || "Culture", href: "/crops", type: "Culture" })),
        ...(stock.data ?? []).map((x: any) => ({ label: x.name, detail: x.category || "Produit en stock", href: "/stock", type: "Stock" })),
      ])
    );
  }, []);

  const results = [...pages, ...accountItems]
    .filter((item) => `${item.label} ${item.detail} ${item.type}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
    .slice(0, 8);

  return (
    <header className="sticky top-0 z-30 border-b border-emerald-900/20 bg-[#0B0914]/80 px-4 py-4 backdrop-blur-xl md:px-8">
      <div className="relative flex h-16 items-center gap-4">
        <button onClick={toggleSidebar} className="rounded-xl p-2 text-emerald-200 hover:bg-emerald-900/40 lg:hidden">
          <Menu className="h-6 w-6" />
        </button>

        <div className="relative hidden w-full max-w-lg sm:block">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-300/60" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-2xl border border-emerald-900/30 bg-[#0A100C] py-3 pl-11 pr-5 text-sm text-white outline-none placeholder:text-emerald-300/40 focus:border-emerald-500/50"
          />

          {focused && query && (
            <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-2xl border border-emerald-900/30 bg-[#181436] p-2 shadow-2xl">
              <p className="px-2 py-1 text-xs font-bold text-emerald-400">Résultats pour « {query} »</p>
              {results.length ? (
                results.map((item, index) => (
                  <Link key={`${item.href}-${item.label}-${index}`} href={item.href} className="block rounded-xl px-3 py-2 hover:bg-emerald-900/20">
                    <span className="flex justify-between text-sm text-slate-200">
                      <span>{item.label}</span>
                      <span className="rounded-full bg-emerald-950 px-2 py-0.5 text-[10px] text-emerald-400">{item.type}</span>
                    </span>
                    <span className="mt-1 block text-[11px] text-emerald-200/60">{item.detail}</span>
                  </Link>
                ))
              ) : (
                <p className="px-3 py-4 text-xs text-emerald-200/60">Aucun résultat correspondant.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
