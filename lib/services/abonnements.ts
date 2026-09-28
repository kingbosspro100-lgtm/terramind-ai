import { createClient } from "@/lib/client";
import type { Abonnement, AbonnementPlan, AiUsage } from "@/types/database";

const MONTHLY_QUOTAS: Record<AbonnementPlan, number> = { FREE: 5, PRO: 50, ENTREPRISE: 500 };

function currentMonthStart() {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-01`;
}

async function authenticated() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!user) throw new Error("Utilisateur non connecté.");
  return { supabase, user };
}

export async function getAbonnement(): Promise<Abonnement | null> {
  const { supabase, user } = await authenticated();
  const { data, error } = await supabase.from("abonnements").select("*").eq("user_id", user.id).maybeSingle();
  if (error) throw error;
  return data as Abonnement | null;
}

export async function startFreeTrial(): Promise<Abonnement> {
  const { supabase, user } = await authenticated();
  const { data: profile, error: profileError } = await supabase.from("profiles").select("trial_used").eq("id", user.id).maybeSingle();
  if (profileError) throw profileError;
  if (profile?.trial_used) throw new Error("L'essai gratuit a déjà été utilisé.");

  const trialStart = new Date();
  const trialEnd = new Date(trialStart.getTime() + 7 * 24 * 60 * 60 * 1000);
  const { data, error } = await supabase.from("abonnements").upsert({
    user_id: user.id,
    plan: "PRO",
    status: "trialing",
    trial_start: trialStart.toISOString(),
    trial_end: trialEnd.toISOString(),
    expires_at: trialEnd.toISOString(),
  }, { onConflict: "user_id" }).select().single();
  if (error) throw error;

  const { error: updateError } = await supabase.from("profiles").upsert({ id: user.id, email: user.email ?? "", trial_used: true });
  if (updateError) throw updateError;
  return data as Abonnement;
}

export async function setAbonnementPlan(plan: AbonnementPlan): Promise<Abonnement> {
  const { supabase, user } = await authenticated();
  const { data, error } = await supabase.from("abonnements").upsert({ user_id: user.id, plan, status: "active" }, { onConflict: "user_id" }).select().single();
  if (error) throw error;
  return data as Abonnement;
}

export async function getAiUsage(): Promise<AiUsage> {
  const { supabase, user } = await authenticated();
  const month_start = currentMonthStart();
  const { data, error } = await supabase.from("ai_usage").select("*").eq("user_id", user.id).eq("month_start", month_start).maybeSingle();
  if (error) throw error;
  if (data) return data as AiUsage;
  const { data: created, error: insertError } = await supabase.from("ai_usage").insert({ user_id: user.id, month_start }).select().single();
  if (insertError) throw insertError;
  return created as AiUsage;
}

export async function consumeAiMessage(): Promise<AiUsage> {
  const { supabase, user } = await authenticated();
  const month_start = currentMonthStart();
  const [abonnement, usage] = await Promise.all([getAbonnement(), getAiUsage()]);
  const plan = abonnement?.plan ?? "FREE";
  const message_count = usage.message_count < MONTHLY_QUOTAS[plan] ? usage.message_count + 1 : usage.message_count;
  const rewarded_bonus_messages = usage.message_count >= MONTHLY_QUOTAS[plan]
    ? Math.max(0, usage.rewarded_bonus_messages - 1)
    : usage.rewarded_bonus_messages;
  if (usage.message_count >= MONTHLY_QUOTAS[plan] && usage.rewarded_bonus_messages <= 0) {
    throw new Error("Quota mensuel de messages IA épuisé.");
  }
  const { data, error } = await supabase.from("ai_usage").upsert({ user_id: user.id, month_start, message_count, rewarded_bonus_messages }, { onConflict: "user_id,month_start" }).select().single();
  if (error) throw error;
  return data as AiUsage;
}

export async function addRewardedBonusMessages(amount = 1): Promise<AiUsage> {
  if (!Number.isInteger(amount) || amount < 1) throw new Error("Le nombre de crédits doit être un entier positif.");
  const { supabase, user } = await authenticated();
  const usage = await getAiUsage();
  const { data, error } = await supabase.from("ai_usage").upsert({
    user_id: user.id,
    month_start: currentMonthStart(),
    message_count: usage.message_count,
    rewarded_bonus_messages: usage.rewarded_bonus_messages + amount,
  }, { onConflict: "user_id,month_start" }).select().single();
  if (error) throw error;
  return data as AiUsage;
}