import { createClient } from "@/lib/server";
import { AI_QUOTA_CONFIG } from "@/lib/ai-quota-config";

export type Plan = "free" | "pro" | "enterprise";

export type SubscriptionStatus =
  | "active"
  | "pending"
  | "cancelled"
  | "expired";

export type Subscription = {
  plan: Plan;
  status: SubscriptionStatus;
};

/**
 * Récupère l'abonnement de l'utilisateur connecté.
 */
export async function getSubscription(): Promise<Subscription | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const metaPlan = user.user_metadata?.plan as Plan | undefined;

  // 1. Interroger la table subscriptions
  const { data: subData } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", user.id)
    .maybeSingle();

  // 2. Interroger la table users_profile
  const { data: userProfile } = await supabase
    .from("users_profile")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const rawPlan = subData?.plan || (userProfile as any)?.plan || metaPlan || "free";
  const plan: Plan =
    rawPlan === "enterprise"
      ? "enterprise"
      : rawPlan === "pro"
      ? "pro"
      : "free";

  const rawStatus = subData?.status || "active";
  const status: SubscriptionStatus =
    rawStatus === "active" ||
    rawStatus === "pending" ||
    rawStatus === "cancelled" ||
    rawStatus === "expired"
      ? rawStatus
      : "active";

  return {
    plan,
    status,
  };
}

/**
 * Retourne le quota mensuel d'un plan selon AI_QUOTA_CONFIG.
 */
export function getPlanMonthlyQuota(plan: Plan, customEnterpriseQuota?: number): number {
  if (plan === "enterprise") {
    return customEnterpriseQuota && customEnterpriseQuota > 0
      ? customEnterpriseQuota
      : AI_QUOTA_CONFIG.ENTERPRISE_MONTHLY_AI_MESSAGES;
  }
  if (plan === "pro") return AI_QUOTA_CONFIG.PRO_MONTHLY_AI_MESSAGES;
  return AI_QUOTA_CONFIG.FREE_MONTHLY_AI_MESSAGES;
}

/**
 * Retourne le nombre maximal de publicités récompensées autorisées par SEMAINE.
 * - Free : 1 pub/semaine
 * - Pro : 3 pubs/semaine
 * - Entreprise : 10 pubs/semaine
 */
export function getMaxWeeklyRewardedAds(plan: Plan): number {
  if (plan === "enterprise") return AI_QUOTA_CONFIG.ENTERPRISE_MAX_WEEKLY_REWARDED_ADS;
  if (plan === "pro") return AI_QUOTA_CONFIG.PRO_MAX_WEEKLY_REWARDED_ADS;
  return AI_QUOTA_CONFIG.FREE_MAX_WEEKLY_REWARDED_ADS;
}

export function getMaxMonthlyRewardedAds(plan: Plan): number {
  return getMaxWeeklyRewardedAds(plan);
}

/**
 * Retourne le nombre maximal d'images autorisées par message.
 * - Free : max 1 image
 * - Pro : max 2 images
 * - Entreprise : max 5 images
 */
export function getMaxImagesPerMessage(plan: Plan): number {
  if (plan === "enterprise") return AI_QUOTA_CONFIG.ENTERPRISE_MAX_IMAGES_PER_MESSAGE;
  if (plan === "pro") return AI_QUOTA_CONFIG.PRO_MAX_IMAGES_PER_MESSAGE;
  return AI_QUOTA_CONFIG.FREE_MAX_IMAGES_PER_MESSAGE;
}

export async function isPro(): Promise<boolean> {
  const subscription = await getSubscription();
  return (
    (subscription?.plan === "pro" || subscription?.plan === "enterprise") &&
    subscription?.status === "active"
  );
}

export async function isEnterprise(): Promise<boolean> {
  const subscription = await getSubscription();
  return (
    subscription?.plan === "enterprise" &&
    subscription?.status === "active"
  );
}

export async function isFree(): Promise<boolean> {
  const subscription = await getSubscription();
  return !subscription || subscription.plan === "free" || subscription.status !== "active";
}

export async function getCurrentPlan(): Promise<Plan> {
  const subscription = await getSubscription();
  if (!subscription || subscription.status !== "active") return "free";
  return subscription.plan;
}