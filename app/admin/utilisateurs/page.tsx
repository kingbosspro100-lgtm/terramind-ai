// app/admin/utilisateurs/page.tsx

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type User = {
  id: string;
  name: string;
  contact: string;
  plan: "Free" | "Pro" | "Entreprise";
  status: "Actif" | "Suspendu";
  messages: number;
  joinedAt: string;
};

const users: User[] = [];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("Tous");
  const [status, setStatus] = useState("Tous");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.contact.toLowerCase().includes(search.toLowerCase());

      const matchesPlan =
        plan === "Tous" || user.plan === plan;

      const matchesStatus =
        status === "Tous" || user.status === status;

      return matchesSearch && matchesPlan && matchesStatus;
    });
  }, [search, plan, status]);

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

            <h1 className="mt-3 text-3xl font-bold">
              Utilisateurs
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Rechercher et surveiller les utilisateurs de TerraMind AI.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <p className="text-xs text-slate-500">
              Utilisateurs affichés
            </p>
            <p className="mt-1 text-xl font-bold">
              {filteredUsers.length}
            </p>
          </div>
        </div>

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
                placeholder="Nom, téléphone ou email..."
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
                  <th className="px-6 py-4">Utilisateur</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4">Messages IA</th>
                  <th className="px-6 py-4">Inscription</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-20 text-center"
                    >
                      <div className="mx-auto max-w-sm">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-xl">
                          👤
                        </div>

                        <h2 className="font-semibold">
                          Aucun utilisateur
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                          Les utilisateurs réels apparaîtront ici lorsque
                          les données Supabase seront connectées.
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
                      <td className="px-6 py-4 font-medium">
                        {user.name}
                      </td>

                      <td className="px-6 py-4 text-slate-400">
                        {user.contact}
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
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {user.messages}
                      </td>

                      <td className="px-6 py-4 text-slate-400">
                        {user.joinedAt}
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