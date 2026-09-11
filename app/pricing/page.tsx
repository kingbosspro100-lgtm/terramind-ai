use client";

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
    
