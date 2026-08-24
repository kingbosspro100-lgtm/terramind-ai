import { createClient } from "@/lib/client";

export interface ProductItem {
  id: string;
  user_id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  description?: string;
  image_url?: string;
  visits: number;
  sales: number;
  status: "active" | "draft" | "out_of_stock";
  created_at?: string;
}

export async function getMarketplaceProducts(): Promise<ProductItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Erreur Supabase marketplace products:", error.message);
      return [];
    }
    return (data || []) as ProductItem[];
  } catch (err) {
    console.error("Erreur récupération produits marketplace:", err);
    return [];
  }
}

export async function createMarketplaceProduct(product: {
  name: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  description?: string;
  image_url?: string;
}): Promise<ProductItem | null> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Utilisateur non connecté.");

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          ...product,
          user_id: user.id,
          visits: 0,
          sales: 0,
          status: "active",
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as ProductItem;
  } catch (err) {
    console.error("Erreur création produit marketplace:", err);
    throw err;
  }
}

export async function updateProductStatus(
  id: string,
  status: "active" | "draft" | "out_of_stock"
) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Erreur mise à jour statut produit:", err);
    throw err;
  }
}

export async function deleteMarketplaceProduct(id: string) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
  } catch (err) {
    console.error("Erreur suppression produit:", err);
    throw err;
  }
}
