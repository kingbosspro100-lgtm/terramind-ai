import { createClient } from "@/lib/client";
import type { Transaction } from "@/types/database";

async function authenticated() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!user) throw new Error("Utilisateur non connecté.");
  return { supabase, user };
}

export async function getTransactions(): Promise<Transaction[]> {
  const { supabase, user } = await authenticated();
  const { data, error } = await supabase.from("transactions").select("*").eq("user_id", user.id).order("date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Transaction[];
}

export async function createTransaction(input: Omit<Transaction, "id" | "user_id" | "created_at" | "updated_at">): Promise<Transaction> {
  const { supabase, user } = await authenticated();
  const { data, error } = await supabase.from("transactions").insert({ ...input, user_id: user.id }).select().single();
  if (error) throw error;
  return data as Transaction;
}

export async function updateTransaction(id: string, input: Partial<Omit<Transaction, "id" | "user_id" | "created_at" | "updated_at">>): Promise<Transaction> {
  const { supabase, user } = await authenticated();
  const { data, error } = await supabase.from("transactions").update(input).eq("id", id).eq("user_id", user.id).select().single();
  if (error) throw error;
  return data as Transaction;
}

export async function deleteTransaction(id: string): Promise<void> {
  const { supabase, user } = await authenticated();
  const { error } = await supabase.from("transactions").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw error;
}