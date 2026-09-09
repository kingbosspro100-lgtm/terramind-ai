
      "use client";

import Link from "next/link";
import { Check, Sparkles, ArrowRight, Building } from "lucide-react";
import PublicHeader from "@/app/components/landing/PublicHeader";
import Footer from "@/app/components/landing/Footer";
import { AI_QUOTA_CONFIG } from "@/lib/ai-quota-config";
import { useLanguage } from "@/lib/language-context";

export default function PricingPage() {
  const { publicLanguage, publicT } = useLanguage();
  const isEn = publicLanguage === "en";

  const freeFeatures = isEn
    ? [
      `${AI_QUOTA_CONFIG.FREE_MONTHLY_AI_MESSAGES} TerraMind Copilot AI messages / month`,
      "Single farm & parcel management",
      "Benin 12 departments weather forecast",
      "Crop & seeding tracking",
      "PWA offline access for saved data",
      "Ad rewards (+1 bonus message per video)",
    ]
    : [
      `${AI_QUOTA_CONFIG.FREE_MONTHLY_AI_MESSAGES} messages IA TerraMind Copilot / mois`,
      "Gestion d'une seule exploitation (1 ferme)",
      "Prévisions météo réelles du Bénin",
      "Suivi des cultures & semis",
      "Gestion du stock",
      "Suivi des transactions et des finances",
      "Accès PWA hors-ligne aux données sauvées",
      "Récompenses publicitaires (+1 message bonus par vidéo)",
    ];

  const proFeatures = isEn
    ? [
      `${AI_QUOTA_CONFIG.PRO_MONTHLY_AI_MESSAGES} TerraMind Copilot AI messages / month`,
      "Up to 10 farms & parcel management with GPS",
      "Pro Benin weather & agronomic alerts",
      "Complete financial & transaction tracking",
      "Smart inventory & stock threshold alerts",
      "Disease diagnosis by photo AI",
      "Voice dictation in field",
      "PWA Offline mode with sync",
      "Priority 7/7 support",
    ]
    : [
      `${AI_QUOTA_CONFIG.PRO_MONTHLY_AI_MESSAGES} messages IA TerraMind Copilot / mois`,
      "Gestion jusqu'à 10 exploitations agricoles (10 fermes)",
      "Suivi des cultures et des semis",
      "Prévisions météo réelles du Bénin",
      "Gestion du stock & alertes",
      "Suivi des transactions et des finances",
      "Analyse des images de cultures par IA",
      "Accès PWA hors-ligne",
      "3 publicités récompensées / semaine → +3 messages IA",
      "Support prioritaire",
    ];

  const enterpriseFeatures = isEn
    ? [
      `${AI_QUOTA_CONFIG.ENTERPRISE_MONTHLY_AI_MESSAGES} TerraMind Copilot AI messages / month`,
      "Unlimited farms & cooperatives (multi-user)",
      "Advanced agronomic analytics & yield forecasts",
      "Full inventory & financial audit logs",
      "Dedicated agronomic support & training",
    ]
    : [
      `${AI_QUOTA_CONFIG.ENTERPRISE_MONTHLY_AI_MESSAGES} messages IA TerraMind Copilot / mois`,
      "Exploitations & coopératives illimitées (multi-utilisateurs)",
      "Analyses agronomiques avancées & suivi du rendement",
      "Gestion complète des stocks & bilans financiers",
    ];

  const handlePlanSubscribe = async (targetPlan: "free" | "pro" | "enterprise") => {
    if (targetPlan === "free") {
      window.location.href = "/register?plan=free";
      return;
    }

    // Récupération des deux liens de paiement Saspay configurés sur Vercel
    const saspayProUrl = process.env.NEXT_PUBLIC_SASPAY_PAYMENT_URL;
    const saspayEnterpriseUrl = process.env.NEXT_PUBLIC_SASPAY_PAYMENT_URL_2;

    try {
      const res = await fetch("/api/payments/saspay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: targetPlan }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
          return;
        }
      }
    } catch (e) {
      console.error("Erreur API Paiement, redirection directe vers Saspay", e);
    }

    // Redirection directe selon l'offre et le lien Vercel associé
    if (targetPlan === "pro" && saspayProUrl) {
      window.location.href = saspayProUrl;
    } else if (targetPlan === "enterprise" && saspayEnterpriseUrl) {
      window.location.href = saspayEnterpriseUrl;
    } else {
      window.location.href = `/register?plan=${targetPlan}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0914] text-white flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
      {/* Top Header with Language Switcher */}
      <PublicHeader />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden pt-28 pb-16">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-6xl w-full space-y-12 relative z-10">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-4 py-1 text-xs font-bold text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>{isEn ? "TerraMind AI Pricing Plans" : "Sélection de votre Formule TerraMind AI"}</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl text-white">
              {isEn ? "Choose the plan that fits your farm" : "Choisissez la formule adaptée à votre activité"}
            </h1>

            <p className="text-sm md:text-base text-emerald-100/70 max-w-2xl mx-auto font-medium">
              {isEn
                ? "Every plan includes a monthly AI question quota with TerraMind Copilot, weather alerts, and offline access."
                : "Chaque plan comprend un quota mensuel de questions agronomiques auprès de TerraMind Copilot pour optimiser vos rendements."}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* FREE PLAN */}
            <div className="rounded-3xl border border-emerald-900/30 bg-gradient-to-b from-[#181436] to-[#050A07] p-8 shadow-2xl flex flex-col justify-between hover:border-emerald-500/30 transition duration-300">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-extrabold text-white">{isEn ? "Discovery" : "Découverte"}</h2>
                  <span className="rounded-full bg-emerald-950 border border-emerald-800/40 px-3 py-1 text-xs font-bold text-emerald-400">
                    FREE
                  </span>
                </div>

                <p className="mt-2 text-xs text-emerald-200/70 font-medium">
                  {isEn ? "To discover TerraMind AI and test our advice." : "Pour découvrir TerraMind AI et tester nos conseils IA."}
                </p>

                <div className="mt-6 flex items-baseline">
                  <span className="text-5xl font-black text-white">0</span>
                  <span className="ml-2 text-sm text-emerald-200/60 font-semibold">{isEn ? "FCFA / month" : "FCFA / mois"}</span>
                </div>

                <ul className="mt-8 space-y-3.5">
                  {freeFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-xs font-medium text-emerald-100/80">
                      <Check className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/register?plan=free"
                className="mt-10 flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/30 bg-[#0A100C] py-4 text-xs font-extrabold text-white hover:bg-emerald-950/60 hover:border-emerald-400 transition shadow-lg"
              >
                <span>{isEn ? "Choose FREE Plan" : "Choisir l'offre FREE"}</span>
                <ArrowRight className="h-4 w-4 text-emerald-400" />
              </Link>
            </div>

            {/* PRO PLAN */}
            <div className="relative rounded-3xl border-2 border-emerald-500/50 bg-gradient-to-b from-[#1E1742] via-[#0D1510] to-[#050A07] p-8 shadow-2xl shadow-emerald-950/50 flex flex-col justify-between">
              <div className="absolute -top-3.5 right-6 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-1 text-xs font-extrabold text-white shadow-lg">
                <Sparkles className="h-3.5 w-3.5 fill-white" />
                <span>{isEn ? "POPULAR • PRO" : "POPULAIRE • PRO"}</span>
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-white">TerraMind PRO</h2>

                <p className="mt-2 text-xs text-emerald-200/80 font-medium">
                  {isEn ? "For professional farmers and producers." : "Pour les producteurs et agriculteurs professionnels."}
                </p>

                <div className="mt-6 flex items-baseline">
                  <span className="text-5xl font-black text-emerald-400">2 500</span>
                  <span className="ml-2 text-sm text-emerald-200/70 font-semibold">{isEn ? "FCFA / month" : "FCFA / mois"}</span>
                </div>

                <ul className="mt-8 space-y-3.5">
                  {proFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-xs font-semibold text-white">
                      <Check className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handlePlanSubscribe("pro")}
                className="mt-10 w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-4 text-xs font-extrabold text-white shadow-xl shadow-emerald-600/30 hover:opacity-95 transition cursor-pointer"
              >
                <span>{isEn ? "Subscribe to PRO (2,500 FCFA)" : "Souscrire à TerraMind PRO (2 500 FCFA)"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* ENTERPRISE PLAN */}
            <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-b from-[#24153B] to-[#050A07] p-8 shadow-2xl flex flex-col justify-between hover:border-purple-400/50 transition duration-300">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-extrabold text-white">ENTREPRISE</h2>
                  <Building className="h-5 w-5 text-purple-400" />
                </div>

                <p className="mt-2 text-xs text-purple-200/70 font-medium">
                  {isEn ? "For large cooperatives and farm groups." : "Pour les grandes coopératives et groupements d'exploitants."}
                </p>

                <div className="mt-6 flex items-baseline">
                  <span className="text-5xl font-black text-purple-300">25 000</span>
                  <span className="ml-2 text-sm text-purple-200/60 font-semibold">{isEn ? "FCFA / month" : "FCFA / mois"}</span>
                </div>

                <ul className="mt-8 space-y-3.5">
                  {enterpriseFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-xs font-medium text-purple-100/90">
                      <Check className="h-4 w-4 shrink-0 text-purple-400 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handlePlanSubscribe("enterprise")}
                className="mt-10 w-full flex items-center justify-center gap-2 rounded-2xl border border-purple-500/40 bg-purple-950/60 py-4 text-xs font-extrabold text-white hover:bg-purple-900/80 transition shadow-lg cursor-pointer"
              >
                <span>{isEn ? "Choose ENTERPRISE (25,000 FCFA)" : "Choisir l'offre ENTREPRISE (25 000 FCFA)"}</span>
                <ArrowRight className="h-4 w-4 text-purple-300" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
    }
