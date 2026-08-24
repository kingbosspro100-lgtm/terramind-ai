import { createClient } from "@/lib/server";
import { auth } from "@/auth";

export interface AppUser {
  id: string;
  email: string;
  phone?: string;
  name: string;
  image?: string | null;
  provider: "supabase" | "nextauth";
}

/**
 * Utility to retrieve the current user from either Supabase Auth or NextAuth.
 * This guarantees seamless authentication support across Google OAuth, 
 * Social Providers, Email/Password, and Phone OTP sign-ins.
 */
export async function getCurrentUser(): Promise<AppUser | null> {
  // 1. Try Supabase Auth first
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      if (user.email?.endsWith("@deleted.invalid") || user.email?.startsWith("deleted_")) {
        return null;
      }
      return {
        id: user.id,
        email: user.email || "",
        phone: user.phone || "",
        name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.phone ||
          user.email?.split("@")[0] ||
          "Utilisateur TerraMind",
        image: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
        provider: "supabase",
      };
    }
  } catch (err) {
    // Ignore error and fall through to NextAuth check
  }

  // 2. Fallback to NextAuth (Google / Facebook / Microsoft OAuth)
  try {
    const session = await auth();
    if (session?.user) {
      return {
        id: session.user.id || session.user.email || "google-user-id",
        email: session.user.email || "",
        name: session.user.name || "Utilisateur TerraMind",
        image: session.user.image || null,
        provider: "nextauth",
      };
    }
  } catch (err) {
    // Ignore error
  }

  return null;
}
