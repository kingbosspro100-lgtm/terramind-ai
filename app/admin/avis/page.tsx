"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Trash2, User, MessageSquare, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/client";

interface ReviewItem {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  created_at?: string;
  date?: string;
}

export default function AdminAvisPage() {
  const supabase = createClient();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState("");

  const loadReviews = async () => {
    setLoading(true);
    let loadedData: ReviewItem[] = [];

    try {
      const res = await fetch("/api/reviews");
      if (res.ok) {
        const json = await res.json();
        if (json.reviews) {
          loadedData = json.reviews.map((r: any) => ({
            id: r.id,
            name: r.name || "Agriculteur",
            location: r.location || "Bénin",
            rating: r.rating || 5,
            comment: r.comment || "",
            date: r.created_at
              ? new Date(r.created_at).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Récemment",
          }));
        }
      }
    } catch (e) {
      console.warn("Notice loading DB reviews via API:", e);
    }

    setReviews(loadedData);
    setLoading(false);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet avis de Supabase ?")) return;

    try {
      await fetch(`/api/reviews?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      await supabase.from("user_reviews").delete().eq("id", id);
    } catch (e) {}

    const updated = reviews.filter((r) => r.id !== id);
    setReviews(updated);

    setMsg("Avis supprimé avec succès de Supabase.");
    setTimeout(() => setMsg(""), 3000);
  };

  const filteredReviews = reviews.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/admin" className="text-sm text-emerald-400 hover:text-emerald-300">
              ← Administration
            </Link>
            <h1 className="mt-3 text-3xl font-bold flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-emerald-400" />
              <span>Avis & Témoignages</span>
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Modérer et surveiller l'ensemble des retours déposés par la communauté.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <p className="text-xs text-slate-500">Avis publiés</p>
            <p className="mt-1 text-2xl font-extrabold text-emerald-400">{reviews.length}</p>
          </div>
        </div>

        {msg && (
          <div className="mb-6 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 p-4 text-xs font-bold text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{msg}</span>
          </div>
        )}

        {/* Filter */}
        <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div>
            <label className="mb-2 block text-sm text-slate-400">Rechercher dans les avis</label>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Auteur, commentaire ou commune..."
              className="w-full max-w-md rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-emerald-400/50"
            />
          </div>
        </section>

        {/* Table */}
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Auteur / Localisation</th>
                  <th className="px-6 py-4">Note</th>
                  <th className="px-6 py-4">Témoignage / Commentaire</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      Chargement des avis...
                    </td>
                  </tr>
                ) : filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                      Aucun avis trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map((r) => (
                    <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                      <td className="px-6 py-4 font-medium">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-bold text-white">{r.name}</p>
                            <p className="text-xs text-slate-400">{r.location}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < r.rating ? "text-amber-400 fill-amber-400" : "text-slate-700"
                              }`}
                            />
                          ))}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-200 max-w-md">
                        « {r.comment} »
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-400">
                        {r.date}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-red-900/40 bg-red-950/40 px-3 py-1.5 text-xs font-bold text-red-300 hover:bg-red-900/80 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Supprimer</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
