import { createClient } from "@/lib/server";

export async function isAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.log("Admin : utilisateur non authentifié");
    return false;
  }

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