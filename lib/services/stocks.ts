import { createClient } from "@/lib/client";
import type { Stock } from "@/types/database";

async function authenticated() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!user) throw new Error("Utilisateur non connecté.");
  return { supabase, user };
}

export async function getStocks(): Promise<Stock[]> {
  const { supabase, user } = await authenticated();
  const { data, error } = await supabase.from("stocks").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Stock[];
}

export async function createStock(input: Omit<Stock, "id" | "user_id" | "created_at" | "updated_at">): Promise<Stock> {
  const { supabase, user } = await authenticated();
  const { data, error } = await supabase.from("stocks").insert({ ...input, user_id: user.id }).select().single();
  if (error) throw error;
  return data as Stock;
}

export async function updateStock(id: string, input: Partial<Omit<Stock, "id" | "user_id" | "created_at" | "updated_at">>): Promise<Stock> {
  const { supabase, user } = await authenticated();
  const { data, error } = await supabase.from("stocks").update(input).eq("id", id).eq("user_id", user.id).select().single();
  if (error) throw error;
  return data as Stock;
}

export async function deleteStock(id: string): Promise<void> {
  const { supabase, user } = await authenticated();
  const { error } = await supabase.from("stocks").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw error;
}