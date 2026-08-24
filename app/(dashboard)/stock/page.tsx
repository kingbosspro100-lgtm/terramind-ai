import {
  Package,
  TriangleAlert,
  Boxes,
  Wallet,
  Search,
  Filter,
} from "lucide-react";

import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";

import StockForm from "@/app/components/stock/StockForm";
import StockCard from "@/app/components/stock/StockCard";
import StockChart from "@/app/components/stock/StockChart";
import { getCurrentUser } from "@/lib/auth-helper";

export default async function StockPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();

  let stock: any[] = [];
  try {
    const { data } = await supabase
      .from("stock")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) stock = data;
  } catch (err) {
    console.error("Stock fetch error:", err);
  }

  const items = stock ?? [];

  const totalProducts = items.length;
  const totalValue = items.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.price),
    0
  );
  const lowStock = items.filter(
    (item) => Number(item.quantity) <= Number(item.minimum)
  ).length;
  const categories = new Set(
    items.map((item) => item.category)
  ).size;

  return (
    <main className="space-y-8 max-w-7xl mx-auto pb-16 text-white">

      {/* Header */}
      <section className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 border-b border-emerald-900/30 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3 py-1 text-[11px] font-semibold text-emerald-300 mb-3">
            <Boxes className="h-3 w-3 text-emerald-400" />
            <span>Gestion de Stock</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Inventaire & Matériels
          </h1>
          <p className="mt-1 text-sm text-emerald-200/70 font-medium max-w-2xl">
            Gérez votre stock de semences, engrais et équipements agricoles en temps réel.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StockForm />
        </div>
      </section>

      {/* Barre de Recherche */}
      <section className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400/50" />
          <input
            type="text"
            placeholder="Rechercher un produit, une catégorie..."
            className="w-full rounded-2xl bg-[#0B0914] border border-emerald-900/40 py-3 pl-11 pr-4 text-sm text-white placeholder-emerald-300/30 outline-none transition focus:border-emerald-500/50 shadow-inner"
          />
        </div>

      </section>

      {/* KPI Cards & Chart */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {[
          { label: "Produits", value: totalProducts, icon: Package, color: "text-emerald-400", bg: "bg-emerald-900/20", border: "border-emerald-800/30" },
          { label: "Valeur Totale", value: `${totalValue.toLocaleString()} FCFA`, icon: Wallet, color: "text-blue-400", bg: "bg-blue-900/20", border: "border-blue-800/30" },
          { label: "Stock Faible", value: lowStock, icon: TriangleAlert, color: "text-red-400", bg: "bg-red-900/20", border: "border-red-800/30" },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-6 shadow-2xl relative overflow-hidden group hover:border-emerald-500/40 transition">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-600/5 rounded-full blur-2xl group-hover:bg-emerald-600/10 transition-all duration-500"></div>
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/60">{kpi.label}</p>
                <div className={`p-2.5 rounded-xl ${kpi.bg} border ${kpi.border} ${kpi.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">{kpi.value}</h2>
            </div>
          )
        })}

        <div className="rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-6 shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/60">Catégories</p>
            <div className="p-2.5 rounded-xl bg-amber-900/20 border border-amber-800/30 text-amber-400">
              <Boxes className="h-5 w-5" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">{categories}</h2>
          <div className="h-16 w-full opacity-60 pointer-events-none">
            <StockChart items={items} />
          </div>
        </div>

      </section>

      {/* Cartes Stock */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 border-b border-emerald-900/30 pb-4">
          📋 Détails de l'Inventaire
        </h2>

        {items.length === 0 ? (
          <div className="rounded-3xl bg-[#0A100C] border border-dashed border-emerald-900/50 p-16 text-center shadow-xl space-y-4">
            <Package className="mx-auto text-emerald-400/50" size={64} />
            <h3 className="text-xl font-bold text-white">Aucun produit en stock</h3>
            <p className="text-sm text-emerald-200/60 max-w-sm mx-auto font-medium">
              Ajoutez vos produits (engrais, semences, carburant) pour suivre l'état de votre inventaire.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {items.map((item) => (
              <StockCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

    </main>
  );
}