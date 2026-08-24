import { createClient } from "@/lib/server";
import {
  getSubscription,
  getPlanMonthlyQuota,
  getMaxWeeklyRewardedAds,
  getMaxImagesPerMessage,
  Plan,
} from "@/lib/subscription";
import { AI_QUOTA_CONFIG } from "@/lib/ai-quota-config";
import * as crypto from "crypto";

export interface AiQuotaStatus {
  plan: Plan;
  monthlyQuota: number;
  messagesUsed: number;
  rewardedMessages: number; // Solde de messages bonus actuellement disponibles
  adsWatched: number;       // Nombre de publicités regardées pendant la SEMAINE en cours
  maxWeeklyRewards: number; // Limite hebdomadaire de pubs (Free: 1, Pro: 3, Enterprise: 10)
  rewardedClaimed: number;  // Alias rétrocompatible de adsWatched
  maxMonthlyRewards: number;// Alias rétrocompatible de maxWeeklyRewards
  messagesRemainingInQuota: number;
  totalMessagesAvailable: number;
  canSendMessage: boolean;
  canClaimReward: boolean;  // adsWatched < maxWeeklyRewards
  maxImagesPerMessage: number;
  usageMonth: string;
  monthStart: string;
  weekStart: string;
  nextRenewalDate: string;
}

// Maps de repli en mémoire pour la résilience totale (mode déconnecté / scripts de test / tables non encore créées)
const fallbackWeeklyAdsMap = new Map<string, number>();
const fallbackRewardedMessagesMap = new Map<string, number>();
const fallbackMessagesUsedMap = new Map<string, number>();

/**
 * Normalise n'importe quel identifiant utilisateur (Supabase UUID, NextAuth email ou ID string)
 * en un format UUID v4 valide et déterministe pour PostgreSQL.
 */
export function ensureValidUuid(userId: string): string {
  if (!userId) return "00000000-0000-4000-a000-000000000000";
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(userId)) {
    return userId;
  }
  const hash = crypto.createHash("md5").update(userId).digest("hex");
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

export function getMonthStartDateString(d: Date = new Date()): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-01`;
}

export function getCurrentMonthString(d: Date = new Date()): string {
  return d.toISOString().slice(0, 7);
}

/**
 * Calcule la date du lundi (début de semaine ISO YYYY-MM-DD) pour la date donnée.
 */
export function getWeekStartDateString(d: Date = new Date()): string {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = date.getUTCDay(); // 0 = Dimanche, 1 = Lundi, ...
  const diff = date.getUTCDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setUTCDate(diff));
  return monday.toISOString().slice(0, 10);
}

export function getNextRenewalDateString(d: Date = new Date()): string {
  const nextMonth = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1));
  return nextMonth.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Récupère le statut complet du quota IA et des publicités récompensées hebdomadaires.
 */
export async function getAiQuota(userId: string, targetDate: Date = new Date()): Promise<AiQuotaStatus> {
  const monthStart = getMonthStartDateString(targetDate);
  const weekStart = getWeekStartDateString(targetDate);
  const monthStr = getCurrentMonthString(targetDate);
  const nextRenewalDate = getNextRenewalDateString(targetDate);
  const dbUserId = ensureValidUuid(userId);

  const sub = await getSubscription();
  const userPlan: Plan = sub && sub.status === "active" ? sub.plan : "free";

  const monthlyQuota = getPlanMonthlyQuota(userPlan);
  const maxWeeklyRewards = getMaxWeeklyRewardedAds(userPlan);
  const maxImagesPerMessage = getMaxImagesPerMessage(userPlan);

  const monthKey = `${dbUserId}_${monthStart}`;
  const weekKey = `${dbUserId}_${weekStart}`;

  let messagesUsed = fallbackMessagesUsedMap.get(monthKey) ?? 0;
  let rewardedMessages = fallbackRewardedMessagesMap.get(monthKey) ?? 0;
  let adsWatched = fallbackWeeklyAdsMap.get(weekKey) ?? 0;

  try {
    const supabase = await createClient();

    // 1. Lire les messages utilisés et le solde de bonus dans ai_usage
    let { data: usageData, error: usageError } = await supabase
      .from("ai_usage")
      .select("message_count, rewarded_messages, rewarded_claimed")
      .eq("user_id", dbUserId)
      .eq("month_start", monthStart)
      .maybeSingle();

    if (usageError) {
      const fallback = await supabase
        .from("ai_usage")
        .select("message_count, rewarded_messages")
        .eq("user_id", dbUserId)
        .eq("month_start", monthStart)
        .maybeSingle();
      usageData = fallback.data as any;
    }

    if (usageData) {
      if (usageData.message_count !== undefined && usageData.message_count !== null) {
        messagesUsed = Number(usageData.message_count) || 0;
        fallbackMessagesUsedMap.set(monthKey, messagesUsed);
      }
      if (usageData.rewarded_messages !== undefined && usageData.rewarded_messages !== null) {
        rewardedMessages = Number(usageData.rewarded_messages) || 0;
        fallbackRewardedMessagesMap.set(monthKey, rewardedMessages);
      }
      if (!fallbackWeeklyAdsMap.has(weekKey) && (usageData as any).rewarded_claimed !== undefined && (usageData as any).rewarded_claimed !== null) {
        adsWatched = Number((usageData as any).rewarded_claimed) || 0;
      }
    }

    // 2. Lire le nombre de publicités regardées cette SEMAINE dans ai_weekly_ads
    const { data: weeklyData, error: weeklyError } = await supabase
      .from("ai_weekly_ads")
      .select("ads_watched")
      .eq("user_id", dbUserId)
      .eq("week_start", weekStart)
      .maybeSingle();

    if (!weeklyError && weeklyData && weeklyData.ads_watched !== undefined && weeklyData.ads_watched !== null) {
      adsWatched = Number(weeklyData.ads_watched) || 0;
      fallbackWeeklyAdsMap.set(weekKey, adsWatched);
    }
  } catch (err) {
    console.warn("Erreur d'accès aux tables de quotas (repli mode dégradé):", err);
  }

  const messagesRemainingInQuota = Math.max(0, monthlyQuota - messagesUsed);
  const totalMessagesAvailable = messagesRemainingInQuota + rewardedMessages;
  const canSendMessage = totalMessagesAvailable > 0;
  const canClaimReward = adsWatched < maxWeeklyRewards;

  return {
    plan: userPlan,
    monthlyQuota,
    messagesUsed,
    rewardedMessages,
    adsWatched,
    maxWeeklyRewards,
    rewardedClaimed: adsWatched,
    maxMonthlyRewards: maxWeeklyRewards,
    messagesRemainingInQuota,
    totalMessagesAvailable,
    canSendMessage,
    canClaimReward,
    maxImagesPerMessage,
    usageMonth: monthStr,
    monthStart,
    weekStart,
    nextRenewalDate,
  };
}

/**
 * Consomme 1 message lors d'un envoi réussi.
 * Règle de gestion :
 * - s'il possède un message bonus (rewardedMessages > 0), décrémenter 1 bonus ;
 * - sinon incrémenter 1 message du quota mensuel (messagesUsed + 1).
 * IMPÉRATIF : adsWatched (nombre de pubs regardées la semaine) NE DIMINUE JAMAIS !
 */
export async function incrementAiUsage(userId: string): Promise<AiQuotaStatus> {
  const monthStart = getMonthStartDateString();
  const dbUserId = ensureValidUuid(userId);
  const monthKey = `${dbUserId}_${monthStart}`;

  const currentQuota = await getAiQuota(userId);
  let currentCount = currentQuota.messagesUsed;
  let rewardedMessages = currentQuota.rewardedMessages;

  // 2. Règle de priorité de consommation :
  // - L'utilisateur consomme d'abord son quota mensuel normal (messagesUsed < monthlyQuota).
  // - Le bonus (rewardedMessages) n'est consommé QUE lorsque le quota normal est totalement épuisé.
  if (currentCount < currentQuota.monthlyQuota) {
    currentCount += 1;
  } else if (rewardedMessages > 0) {
    rewardedMessages = Math.max(0, rewardedMessages - 1);
  }

  // Mettre à jour les maps de repli immédiatement
  fallbackMessagesUsedMap.set(monthKey, currentCount);
  fallbackRewardedMessagesMap.set(monthKey, rewardedMessages);

  try {
    const supabase = await createClient();
    const nowIso = new Date().toISOString();

    // Sauvegarder dans ai_usage (sans toucher à ads_watched / ai_weekly_ads)
    await supabase
      .from("ai_usage")
      .upsert(
        {
          user_id: dbUserId,
          month_start: monthStart,
          message_count: currentCount,
          rewarded_messages: rewardedMessages,
          updated_at: nowIso,
        },
        { onConflict: "user_id,month_start" }
      );
  } catch (err) {
    console.error("Erreur mise à jour quota IA:", err);
  }

  return getAiQuota(userId);
}

/**
 * Crédite +1 message bonus après validation serveur d'une publicité réellement terminée.
 * Incrémente ads_watched (+1 pour la semaine) ET rewarded_messages (+1 au solde).
 */
export async function claimAdReward(userId: string): Promise<{
  success: boolean;
  message: string;
  quota: AiQuotaStatus;
}> {
  const currentQuota = await getAiQuota(userId);
  const dbUserId = ensureValidUuid(userId);
  const weekStart = currentQuota.weekStart;
  const monthStart = currentQuota.monthStart;

  // Contrôle serveur strict : vérification de la limite hebdomadaire de pubs
  if (currentQuota.adsWatched >= currentQuota.maxWeeklyRewards) {
    return {
      success: false,
      message: `Limite hebdomadaire de ${currentQuota.maxWeeklyRewards} publicité(s) récompensée(s) atteinte pour la formule ${currentQuota.plan.toUpperCase()}.`,
      quota: currentQuota,
    };
  }

  const newAdsWatched = currentQuota.adsWatched + 1;
  const newRewardBalance = currentQuota.rewardedMessages + AI_QUOTA_CONFIG.REWARDED_MESSAGE_AMOUNT;
  const nowIso = new Date().toISOString();

  const weekKey = `${dbUserId}_${weekStart}`;
  const monthKey = `${dbUserId}_${monthStart}`;

  // 1. Enregistrer immédiatement dans les maps de repli en mémoire
  fallbackWeeklyAdsMap.set(weekKey, newAdsWatched);
  fallbackRewardedMessagesMap.set(monthKey, newRewardBalance);

  try {
    const supabase = await createClient();

    // 2. Tenter d'incrémenter les pubs regardées pour la SEMAINE dans ai_weekly_ads
    try {
      await supabase
        .from("ai_weekly_ads")
        .upsert(
          {
            user_id: dbUserId,
            week_start: weekStart,
            ads_watched: newAdsWatched,
            updated_at: nowIso,
          },
          { onConflict: "user_id,week_start" }
        );
    } catch (e) {
      // Ignorer si la table n'existe pas encore
    }

    // 3. Tenter d'enregistrer dans ai_usage avec rewarded_claimed
    const { error: err1 } = await supabase
      .from("ai_usage")
      .upsert(
        {
          user_id: dbUserId,
          month_start: monthStart,
          message_count: currentQuota.messagesUsed,
          rewarded_messages: newRewardBalance,
          rewarded_claimed: newAdsWatched,
          updated_at: nowIso,
        },
        { onConflict: "user_id,month_start" }
      );

    // 4. Si err1 (ex: colonne rewarded_claimed manquante), repli sans la colonne rewarded_claimed
    if (err1) {
      await supabase
        .from("ai_usage")
        .upsert(
          {
            user_id: dbUserId,
            month_start: monthStart,
            message_count: currentQuota.messagesUsed,
            rewarded_messages: newRewardBalance,
            updated_at: nowIso,
          },
          { onConflict: "user_id,month_start" }
        );
    }
  } catch (err) {
    console.error("Erreur enregistrement publicité récompensée:", err);
  }

  const updatedQuota = await getAiQuota(userId);

  return {
    success: true,
    message: `+${AI_QUOTA_CONFIG.REWARDED_MESSAGE_AMOUNT} message bonus débloqué avec succès !`,
    quota: updatedQuota,
  };
}