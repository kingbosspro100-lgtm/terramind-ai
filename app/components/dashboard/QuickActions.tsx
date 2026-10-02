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
      color: "bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/25",
    },
    {
      title: "Ajouter une culture",
      subtitle: "Enregistrer des semences",
      href: "/crops",
      icon: Sprout,
      color: "bg-brand-gold/10 text-brand-gold border border-brand-gold/25",
    },
    {
      title: "Nouvelle transaction",
      subtitle: "Saisir une dépense/vente",
      href: "/finance",
      icon: Wallet,
      color: "bg-brand-purple/10 text-brand-purple border border-brand-purple/25",
    },
  ];

  return (
    <div className="cosmic-panel rounded-2xl p-6 md:p-8">
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
              className="group flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-cyan/40 hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${action.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white transition-colors group-hover:text-brand-cyan">
                    {action.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-400">
                    {action.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-cyan/10 text-brand-cyan transition group-hover:bg-gradient-gemini group-hover:text-white">
                <Plus className="h-4 w-4" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}