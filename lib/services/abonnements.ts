import { createClient } from "@/lib/client";
import type { Abonnement, AiUsage } from "@/types/database";

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
  if (!data) return null;
  const abonnement = data as Abonnement;
  if (abonnement.status === "trialing" && abonnement.trial_end && new Date(abonnement.trial_end) <= new Date()) {
    return { ...abonnement, plan: "FREE", status: "expired" };
  }
  if (abonnement.expires_at && new Date(abonnement.expires_at) <= new Date()) {
    return { ...abonnement, plan: "FREE", status: "expired" };
  }
  return abonnement;
}

export async function startFreeTrial(): Promise<Abonnement> {
  const { supabase } = await authenticated();
  const { data, error } = await supabase.rpc("start_free_trial_v1");
  if (error) throw error;
  return data as Abonnement;
}

export async function getAiUsage(): Promise<AiUsage> {
  const { supabase, user } = await authenticated();
  const month_start = currentMonthStart();
  const { data, error } = await supabase.from("ai_usage").select("*").eq("user_id", user.id).eq("month_start", month_start).maybeSingle();
  if (error) throw error;
  if (data) return data as AiUsage;
  const now = new Date().toISOString();
  return { user_id: user.id, month_start, message_count: 0, rewarded_bonus_messages: 0, created_at: now, updated_at: now };
}

export async function consumeAiMessage(): Promise<AiUsage> {
  const { supabase } = await authenticated();
  const { data, error } = await supabase.rpc("consume_ai_message_v1");
  if (error) throw error;
  return data as AiUsage;
}