import { createClient } from "@/lib/client";

export async function createTransaction(transaction: {
  farm_id: string;
  type: "income" | "expense";
  category: string;
  description: string;
  amount: number;
  transaction_date: string;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Utilisateur non connecté.");
  }

  const { data, error } = await supabase
    .from("transactions")
    .insert([
      {
        ...transaction,
        user_id: user.id,
      },
    ])
    .select();

  if (error) throw error;

  return data;
}

export async function updateTransaction(
  id: string,
  transaction: {
    type: "income" | "expense";
    category: string;
    description: string;
    amount: number;
    transaction_date: string;
  }
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transactions")
    .update(transaction)
    .eq("id", id)
    .select();

  if (error) throw error;

  return data;
}

export async function deleteTransaction(id: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id);

  if (error) throw error;
}