"use client";

import { useEffect, useState } from "react";
import { PackagePlus, Trash2 } from "lucide-react";
import { createStoreProduct, deleteStoreProduct, getStoreProducts, STORE_CATEGORIES } from "@/lib/services/store";
import { createClient } from "@/lib/client";
import type { StoreProduct, StoreProductCategory } from "@/types/database";

const fieldClass = "w-full rounded-lg border border-emerald-900/50 bg-[#0B0914] px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500";
const categoryLabels: Record<StoreProductCategory, string> = { semences: "Semences", engrais: "Engrais", phytosanitaire: "Phytosanitaire", "matériel": "Matériel", produits: "Produits" };

export default function StorePage() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [filter, setFilter] = useState<StoreProductCategory | "all">("all");
  const [sellerId, setSellerId] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", description: "", category: "semences" as StoreProductCategory, price: "", quantity: "", unit: "kg", city: "" });

  async function loadProducts() {
    try { setProducts(await getStoreProducts(filter === "all" ? undefined : filter)); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Catalogue indisponible."); }
  }

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => setSellerId(data.user?.id ?? ""));
  }, []);
  useEffect(() => {
    let active = true;
    getStoreProducts(filter === "all" ? undefined : filter).then((result) => {
      if (active) setProducts(result);
    }).catch((cause: unknown) => {
      if (active) setError(cause instanceof Error ? cause.message : "Catalogue indisponible.");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [filter]);

  async function publish(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError("");
    try {
      await createStoreProduct({ title: form.title.trim(), description: form.description.trim() || null, category: form.category,
        price_fcfa: Number(form.price), available_quantity: Number(form.quantity), unit: form.unit.trim(), location_city: form.city.trim(), is_active: true });
      setForm({ title: "", description: "", category: "semences", price: "", quantity: "", unit: "kg", city: "" });
      await loadProducts();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Publication impossible."); }
    finally { setBusy(false); }
  }

  async function remove(id: string) {
    setBusy(true);
    try { await deleteStoreProduct(id); await loadProducts(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Suppression impossible."); }
    finally { setBusy(false); }
  }

  return (
    <main className="mx-auto max-w-6xl space-y-8 pb-12">
      <header className="border-b border-emerald-900/40 pb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">TerraMind AI · Commerce agricole</p>
        <h1 className="text-3xl font-bold text-white">TerraMind Store</h1>
        <p className="mt-2 text-sm text-slate-300">Découvrez les offres et publiez les produits de votre exploitation.</p>
      </header>
      {error && <p role="alert" className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-200">{error}</p>}

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.8fr)]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">Catalogue</h2>
            <label className="text-sm text-slate-300">Catégorie <select value={filter} onChange={(event) => setFilter(event.target.value as StoreProductCategory | "all")} className="ml-2 rounded-lg border border-slate-700 bg-[#0B0914] px-3 py-2 text-white"><option value="all">Toutes</option>{STORE_CATEGORIES.map((category) => <option key={category} value={category}>{categoryLabels[category]}</option>)}</select></label>
          </div>
          {loading ? <p className="rounded-lg border border-slate-800 p-10 text-center text-sm text-slate-400">Chargement du catalogue…</p> : products.length === 0 ? <div className="rounded-lg border border-dashed border-slate-700 p-10 text-center"><p className="font-medium text-white">Aucune offre pour ce filtre</p><p className="mt-1 text-sm text-slate-400">Les nouvelles publications apparaîtront ici.</p></div> : (
            <div className="divide-y divide-slate-800 rounded-lg border border-slate-800 bg-[#100E18]">
              {products.map((product) => <article key={product.id} className="flex items-start justify-between gap-4 p-4">
                <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-white">{product.title}</h3><span className="rounded border border-emerald-900 px-2 py-0.5 text-xs text-emerald-200">{categoryLabels[product.category]}</span></div>
                  {product.description && <p className="mt-1 text-sm text-slate-300">{product.description}</p>}
                  <p className="mt-2 text-xs text-slate-400">{product.available_quantity} {product.unit} · {product.location_city}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2"><strong className="text-sm text-amber-300">{product.price_fcfa.toLocaleString("fr-FR")} FCFA</strong>{product.seller_id === sellerId && <button title="Supprimer mon annonce" disabled={busy} onClick={() => void remove(product.id)} className="rounded-md p-2 text-slate-400 hover:bg-red-950/40 hover:text-red-300"><Trash2 size={16} /></button>}</div>
              </article>)}
            </div>
          )}
        </div>

        <form onSubmit={publish} className="h-fit space-y-3 rounded-lg border border-emerald-900/40 bg-[#100E18] p-5">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white"><PackagePlus size={18} />Publier un produit</h2>
          <input required aria-label="Titre" placeholder="Nom du produit" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className={fieldClass} />
          <textarea aria-label="Description" placeholder="Description" rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className={fieldClass} />
          <select aria-label="Catégorie" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as StoreProductCategory })} className={fieldClass}>{STORE_CATEGORIES.map((category) => <option key={category} value={category}>{categoryLabels[category]}</option>)}</select>
          <div className="grid grid-cols-2 gap-3"><input required min="0" type="number" aria-label="Prix FCFA" placeholder="Prix FCFA" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className={fieldClass} /><input required min="0" step="0.01" type="number" aria-label="Quantité disponible" placeholder="Quantité" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} className={fieldClass} /></div>
          <div className="grid grid-cols-2 gap-3"><input required aria-label="Unité" placeholder="Unité (kg, sac…)" value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value })} className={fieldClass} /><input required aria-label="Ville" placeholder="Ville" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} className={fieldClass} /></div>
          <button disabled={busy || !sellerId} className="min-h-11 w-full rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50">{busy ? "Publication…" : sellerId ? "Publier l'offre" : "Connectez-vous pour publier"}</button>
        </form>
      </section>
    </main>
  );
}