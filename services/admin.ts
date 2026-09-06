import { createClient } from "@/lib/server";
import { getCurrentUser } from "@/lib/auth-helper";

export async function isAdmin() {
  const user = await getCurrentUser();

  if (!user || !user.id) {
    console.log("Admin : utilisateur non authentifié");
    return false;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error(
      "Erreur vérification admin :",
      error
    );

    return false;
  }

  return !!data;
}