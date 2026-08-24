"use client";

import Link from "next/link";
import { Plus, Wheat, Wallet, Sprout } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      title: "Nouvelle exploitation",
      subtitle: "Créer une parcelle agricole",
      href: "/farms",
      icon: Wheat,
      color: "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40",
    },
    {
      title: "Ajouter une culture",
      subtitle: "Enregistrer des semences",
      href: "/crops",
      icon: Sprout,
      color: "bg-yellow-950/60 text-yellow-400 border border-yellow-800/40",
    },
    {
      title: "Nouvelle transaction",
      subtitle: "Saisir une dépense/vente",
      href: "/finance",
      icon: Wallet,
      color: "bg-blue-950/60 text-blue-400 border border-blue-800/40",
    },
  ];

  return (
    <div className="rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-6 md:p-8 shadow-2xl">
      <h2 className="text-xl font-bold text-white tracking-wide mb-6 flex items-center gap-2">
        ⚡ Actions rapides
      </h2>

      <div className="space-y-3.5">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group flex items-center justify-between rounded-2xl border border-emerald-900/30 bg-[#0A100C] p-4 transition-all duration-300 hover:border-emerald-500/50 hover:bg-[#1C183B] hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${action.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-emerald-200/80 font-medium">
                    {action.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-950/50 text-emerald-300 group-hover:bg-emerald-600 group-hover:text-white transition">
                <Plus className="h-4 w-4" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}