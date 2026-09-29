// app/admin/utilisateurs/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Users } from "lucide-react";

type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  country: string;
  role: string;
  plan: "Free" | "Pro" | "Entreprise";
  status: "Actif" | "Suspendu" | "Suppression prévue";
  createdAt: string;
  counts: {
    exploitations: number;
    cultures: number;
    stockItems: number;
    transactions: number;
    payments: number;
    products: number;
    aiMessages: number;
  };
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("Tous");
  const [status, setStatus] = useState("Tous");

  async function loadUsers(signal?: AbortSignal) {
    setLoading(true);
    setLoadError("");
    try {
      const response = await fetch("/api/admin/users", { cache: "no-store", signal });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Impossible de charger les utilisateurs.");
      setUsers(result.users as User[]);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setLoadError(error instanceof Error ? error.message : "Impossible de charger les utilisateurs.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    async function loadInitialUsers() {
      try {
        const response = await fetch("/api/admin/users", {
          cache: "no-store",
          signal: controller.signal,
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Impossible de charger les utilisateurs.");
        setUsers(result.users as User[]);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLoadError(error instanceof Error ? error.message : "Impossible de charger les utilisateurs.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadInitialUsers();
    return () => controller.abort();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        `${user.fullName} ${user.email} ${user.phone} ${user.companyName}`
          .toLocaleLowerCase("fr")
          .includes(search.toLocaleLowerCase("fr"));

      const matchesPlan =
        plan === "Tous" || user.plan === plan;

      const matchesStatus =
        status === "Tous" || user.status === status;

      return matchesSearch && matchesPlan && matchesStatus;
    });
  }, [users, search, plan, status]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="text-sm text-emerald-400 hover:text-emerald-300"
            >
              ← Administration
            </Link>

            <h1 className="mt-3 flex items-center gap-3 text-3xl font-bold">
              <Users className="h-7 w-7 text-emerald-400" /> Utilisateurs & données
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Profils inscrits, coordonnées et activité enregistrée dans TerraMind.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <p className="text-xs text-slate-500">Comptes enregistrés</p>
              <p className="mt-1 text-xl font-bold">{users.length}</p>
            </div>
            <button
              type="button"
              onClick={() => void loadUsers()}
              disabled={loading}
              title="Actualiser les données"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-slate-300 transition hover:border-emerald-500/40 hover:text-white disabled:opacity-50"
            >
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {loadError && (
          <div role="alert" className="mb-6 flex items-start gap-3 rounded-xl border border-red-800/50 bg-red-950/30 p-4 text-sm text-red-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{loadError}</span>
          </div>
        )}

        {/* FILTERS */}
        <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Rechercher
              </label>

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nom, téléphone, e-mail ou entreprise..."
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-emerald-400/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Abonnement
              </label>

              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-emerald-400/50"
              >
                <option>Tous</option>
                <option>Free</option>
                <option>Pro</option>
                <option>Entreprise</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Statut
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-emerald-400/50"
              >
                <option>Tous</option>
                <option>Actif</option>
                <option>Suspendu</option>
                <option>Suppression prévue</option>
              </select>
            </div>
          </div>
        </section>

        {/* TABLE */}
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Profil</th>
                  <th className="px-6 py-4">Coordonnées</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4">Données</th>
                  <th className="px-6 py-4">Inscription</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-16 text-center text-sm text-slate-400">Chargement des comptes et de leurs données…</td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-20 text-center"
                    >
                      <div className="mx-auto max-w-sm">
                        <h2 className="font-semibold">
                          {users.length ? "Aucun résultat pour ces filtres" : "Aucun compte enregistré"}
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                          {users.length ? "Modifiez la recherche ou les filtres." : "Les comptes Supabase apparaîtront ici dès que la configuration serveur sera disponible."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-white/5 transition hover:bg-white/[0.03]"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-white">{user.fullName}</p>
                        <p className="mt-1 text-xs text-slate-500">{user.companyName || user.role}{user.country ? ` · ${user.country}` : ""}</p>
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        <p>{user.email || "—"}</p>
                        <p className="mt-1 text-xs text-slate-500">{user.phone || "Téléphone non renseigné"}</p>
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-white/5 px-3 py-1 text-xs">
                          {user.plan}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs ${
                            user.status === "Actif"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : user.status === "Suspendu"
                                ? "bg-red-500/10 text-red-400"
                                : "bg-amber-500/10 text-amber-300"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-medium text-white">{user.counts.exploitations} exploitation(s) · {user.counts.cultures} culture(s)</p>
                        <p className="mt-1 text-xs text-slate-400">{user.counts.stockItems} stock · {user.counts.transactions} transaction(s) · {user.counts.payments} paiement(s)</p>
                        <p className="mt-1 text-xs text-slate-500">{user.counts.products} produit(s) · {user.counts.aiMessages} message(s) IA</p>
                      </td>

                      <td className="px-6 py-4 text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString("fr-FR")}
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