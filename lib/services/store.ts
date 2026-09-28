import { createClient } from "@/lib/client";
import type { StoreProduct, StoreProductCategory } from "@/types/database";

export const STORE_CATEGORIES: StoreProductCategory[] = ["semences", "engrais", "phytosanitaire", "matériel", "produits"];

export async function getStoreProducts(category?: StoreProductCategory): Promise<StoreProduct[]> {
  const supabase = createClient();
  let query = supabase.from("store_products").select("*").eq("is_active", true).order("created_at", { ascending: false });
  if (category) query = query.eq("category", category);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as StoreProduct[];
}

export async function createStoreProduct(input: Omit<StoreProduct, "id" | "seller_id" | "created_at" | "updated_at">): Promise<StoreProduct> {
  if (!STORE_CATEGORIES.includes(input.category)) throw new Error("Catégorie de produit non autorisée.");
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) throw new Error("Utilisateur non connecté.");
  const { data, error } = await supabase.from("store_products").insert({ ...input, seller_id: user.id }).select().single();
  if (error) throw error;
  return data as StoreProduct;
}

export async function deleteStoreProduct(id: string): Promise<void> {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) throw new Error("Utilisateur non connecté.");
  const { error } = await supabase.from("store_products").delete().eq("id", id).eq("seller_id", user.id);
  if (error) throw error;
}