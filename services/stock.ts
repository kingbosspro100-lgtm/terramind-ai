import { createClient } from "@/lib/client";

const supabase = createClient();

export type StockItem = {
  id?: string;
  user_id?: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minimum: number;
  price: number;
  supplier: string;
};

/* ==========================
   Récupérer le stock
========================== */

export async function getStock() {
  const { data, error } = await supabase
    .from("stock")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
}

/* ==========================
   Ajouter un produit
========================== */

export async function createStock(item: StockItem) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Utilisateur non connecté.");
  }

  const { data, error } = await supabase
    .from("stock")
    .insert({
      ...item,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

/* ==========================
   Modifier un produit
========================== */

export async function updateStock(
  id: string,
  item: Partial<StockItem>
) {
  const { data, error } = await supabase
    .from("stock")
    .update(item)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/* ==========================
   Supprimer un produit
========================== */

export async function deleteStock(id: string) {
  const { error } = await supabase
    .from("stock")
    .delete()
    .eq("id", id);

  if (error) throw error;
}