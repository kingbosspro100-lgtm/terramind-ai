"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "TerraMind AI est-il gratuit ?",
    answer:
      "Oui. Vous pouvez commencer gratuitement puis évoluer vers des fonctionnalités avancées plus tard.",
  },
  {
    question: "Puis-je utiliser TerraMind AI sur mon téléphone ?",
    answer:
      "Oui. TerraMind AI fonctionne sur ordinateur, tablette et smartphone.",
  },
  {
    question: "L'IA fonctionne-t-elle pour les agriculteurs africains ?",
    answer:
      "Oui. TerraMind AI est conçu pour répondre aux besoins des exploitations agricoles africaines.",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer:
      "Oui. Toutes vos données sont stockées de manière sécurisée.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="bg-white py-24"
    >
      <div className="mx-auto max-w-4xl px-6">

        <h2 className="text-center text-4xl font-black text-slate-900">
          Questions fréquentes
        </h2>

        <div className="mt-16 space-y-5">

          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-3xl border border-slate-200 bg-slate-50"
            >
              <button
                onClick={() =>
                  setOpen(open === index ? null : index)
                }
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <span className="font-bold text-slate-900">
                  {faq.question}
                </span>

                <ChevronDown
                  className={`transition ${
                    open === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {open === index && (
                <div className="px-6 pb-6 text-slate-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}