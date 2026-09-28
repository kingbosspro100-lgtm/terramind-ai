"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { createClient } from "@/lib/client";
import { SUPPORTED_COUNTRIES } from "@/lib/services/exploitations";
import type { MarketPrice, SupportedCountry } from "@/types/database";

export default function MarketsPage() {
  const [country, setCountry] = useState<SupportedCountry | "all">("all");
  const [search, setSearch] = useState("");
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true); setError("");
      const supabase = createClient();
      let query = supabase.from("market_prices").select("*").order("recorded_at", { ascending: false });
      if (country !== "all") query = query.eq("country", country);
      const { data, error: queryError } = await query;
      if (!active) return;
      if (queryError) setError(queryError.message);
      setPrices((data ?? []) as MarketPrice[]);
      setLoading(false);
    }
    void load();
    return () => { active = false; };
  }, [country]);

  const filtered = prices.filter((price) => `${price.product_name} ${price.market_name} ${price.country}`.toLocaleLowerCase("fr").includes(search.toLocaleLowerCase("fr")));

  return (
    <main className="mx-auto max-w-6xl space-y-7 pb-12">
      <header className="border-b border-emerald-900/40 pb-5"><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">Observations enregistrées</p><h1 className="text-3xl font-bold text-white">Prix des marchés</h1><p className="mt-2 text-sm text-slate-300">Consultez les derniers relevés disponibles dans les pays V1.</p></header>
      <section className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1"><span className="sr-only">Rechercher un produit ou un marché</span><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Produit ou marché" className="w-full rounded-lg border border-slate-700 bg-[#100E18] py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:border-emerald-500" /></label>
        <label className="text-sm text-slate-300">Pays <select value={country} onChange={(event) => setCountry(event.target.value as SupportedCountry | "all")} className="ml-2 rounded-lg border border-slate-700 bg-[#100E18] px-3 py-2.5 text-white"><option value="all">Tous les pays</option>{SUPPORTED_COUNTRIES.map((name) => <option key={name}>{name}</option>)}</select></label>
      </section>
      {error && <p role="alert" className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-200">Les relevés n&apos;ont pas pu être chargés : {error}</p>}
      {loading ? <p className="py-12 text-center text-sm text-slate-400">Chargement des relevés…</p> : filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-700 px-6 py-14 text-center"><h2 className="font-semibold text-white">Aucun relevé disponible</h2><p className="mx-auto mt-2 max-w-lg text-sm text-slate-400">Aucun prix n&apos;est encore enregistré pour ce filtre. Les valeurs affichées ici proviennent de la table des observations de marché, pas de données estimées.</p></div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-800 bg-[#100E18]"><table className="w-full min-w-[620px] text-left text-sm"><thead className="border-b border-slate-800 text-xs uppercase text-slate-400"><tr><th className="px-4 py-3 font-medium">Produit</th><th className="px-4 py-3 font-medium">Marché</th><th className="px-4 py-3 font-medium">Pays</th><th className="px-4 py-3 font-medium">Prix</th><th className="px-4 py-3 font-medium">Relevé</th></tr></thead><tbody className="divide-y divide-slate-800">{filtered.map((price) => <tr key={price.id}><td className="px-4 py-3 font-medium text-white">{price.product_name}</td><td className="px-4 py-3 text-slate-300">{price.market_name}</td><td className="px-4 py-3 text-slate-300">{price.country}</td><td className="px-4 py-3 font-semibold text-amber-300">{price.price_fcfa.toLocaleString("fr-FR")} FCFA / {price.unit}</td><td className="px-4 py-3 text-slate-400">{new Date(price.recorded_at).toLocaleDateString("fr-FR")}</td></tr>)}</tbody></table></div>
      )}
    </main>
  );
}