"use client";

import { useState } from "react";
import PublicHeader from "@/app/components/landing/PublicHeader";
import Footer from "@/app/components/landing/Footer";
import { useLanguage } from "@/lib/language-context";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

export default function FAQPage() {
  const { publicLanguage } = useLanguage();
  const isEn = publicLanguage === "en";
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = isEn
    ? [
        {
          question: "What is TerraMind AI?",
          answer:
            "TerraMind AI is an agricultural management platform helping farmers track farms, crops, finances, inventory, Benin weather, and get expert agronomic AI recommendations.",
        },
        {
          question: "Does TerraMind AI work offline without internet?",
          answer:
            "Yes! TerraMind AI includes PWA offline support. All your saved farm records, stock inventories, and crop data remain accessible in your field even without network connection.",
        },
        {
          question: "How do crop photo analysis and voice dictation work?",
          answer:
            "In TerraMind Copilot AI, you can take a photo of a diseased leaf or crop and send it directly for visual diagnosis. You can also tap the microphone button to dictate questions using voice transcription.",
        },
        {
          question: "Is there a Free Plan?",
          answer:
            "Yes. A Free discovery plan is available with 5 monthly AI Copilot messages and core farm management features. You can also watch rewarded videos for bonus messages (1/week on Free).",
        },
        {
          question: "How much does the PRO plan cost?",
          answer:
            "The TerraMind PRO plan costs 2,500 FCFA / month and includes 50 AI Copilot messages, full weather & financial modules, multi-parcel management, and 3 rewarded ad bonuses / week.",
        },
        {
          question: "Are my farm data and finances secure?",
          answer:
            "Yes. All data is protected with industry-standard encryption and Supabase Auth security protocol.",
        },
      ]
    : [
        {
          question: "Qu'est-ce que TerraMind AI ?",
          answer:
            "TerraMind AI est une plateforme d'assistance et de gestion agricole qui aide les agriculteurs à piloter leurs exploitations, leurs cultures, leurs finances, leurs stocks, la météo réelle du Bénin et à obtenir des conseils par IA.",
        },
        {
          question: "L'application fonctionne-t-elle hors connexion internet ?",
          answer:
            "Oui ! TerraMind AI dispose d'un mode PWA hors-ligne avec Service Worker. Vos données d'exploitations, de stocks et de parcelles mises en cache restent consultables directement dans vos champs sans connexion internet.",
        },
        {
          question: "Comment fonctionnent l'analyse d'images et le transcripteur vocal ?",
          answer:
            "Dans TerraMind Copilot IA, vous pouvez envoyer une photo de feuille ou plante touchée pour obtenir un diagnostic phytosanitaire. Vous pouvez également cliquer sur le bouton microphone pour dicter vos questions à la voix.",
        },
        {
          question: "Existe-t-il une offre gratuite ?",
          answer:
            "Oui. Une offre Découverte gratuite est disponible avec 5 messages IA mensuels et les fonctionnalités de base. Vous pouvez aussi regarder 1 vidéo publicitaire par semaine pour débloquer un message bonus.",
        },
        {
          question: "Combien coûte la formule PRO ?",
          answer:
            "La formule TerraMind PRO coûte 2 500 FCFA / mois et inclut 50 messages IA, les modules météo pro, la gestion multi-parcelles, les finances et jusqu'à 3 pubs récompensées par semaine.",
        },
        {
          question: "Mes données agricoles sont-elles sécurisées ?",
          answer:
            "Oui. Toutes vos données sont chiffrées et protégées par les standards de sécurité Supabase Auth.",
        },
      ];

  return (
    <div className="min-h-screen bg-[#0B0914] text-white flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
      {/* Top Header with Language Switcher */}
      <PublicHeader />

      {/* Main Content */}
      <main className="flex-1 pt-28 pb-16 px-6 max-w-4xl mx-auto w-full space-y-8">
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-4 py-1 text-xs font-bold text-emerald-300">
            <HelpCircle className="h-4 w-4 text-emerald-400" />
            <span>{isEn ? "Frequently Asked Questions" : "Foire Aux Questions"}</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-white">
            {isEn ? "Questions & Answers" : "Questions fréquentes"}
          </h1>

          <p className="text-sm text-emerald-200/70 max-w-xl mx-auto font-medium">
            {isEn
              ? "Find fast answers about TerraMind AI features, PWA offline mode, PRO pricing, and AI Copilot."
              : "Retrouvez rapidement toutes les réponses concernant TerraMind AI, le mode hors-ligne, le tarif PRO à 2 500 FCFA et Copilot IA."}
          </p>
        </section>

        <section className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="overflow-hidden rounded-3xl border border-emerald-900/30 bg-gradient-to-b from-[#181436] to-[#050A07] shadow-2xl transition duration-300 hover:border-emerald-500/40"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <h2 className="text-base font-extrabold text-white pr-4">{faq.question}</h2>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-emerald-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-emerald-900/30 p-6 text-xs text-emerald-200/80 leading-relaxed font-medium bg-[#0A100C]/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}