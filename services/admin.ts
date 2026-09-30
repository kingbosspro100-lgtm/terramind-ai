import { createClient } from "@/lib/server";
import { getCurrentUser } from "@/lib/auth-helper";

export async function isAdmin() {
  const user = await getCurrentUser();

  if (!user || !user.id) {
    console.log("Admin : utilisateur non authentifié");
    return false;
  }

  const allowedEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  if (user.email && allowedEmails.includes(user.email.toLowerCase())) {
    return true;
  }

  const supabase = await createClient();

  const { data: adminRecord, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminError && adminRecord) return true;
  if (adminError) console.error("Erreur vérification admin_users:", adminError);

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) console.error("Erreur vérification du rôle administrateur:", profileError);
  return ["admin", "superadmin"].includes(String(profile?.role || "").toLowerCase());
}