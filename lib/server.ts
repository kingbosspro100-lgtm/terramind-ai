import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const DEFAULT_SUPABASE_URL = "https://zjqepfcahnvlxyexymer.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_vR7j-YWPlqEM54Ems6W74w_dmnIc0qQ";

export async function createClient() {
  let cookieStore: any = null;
  try {
    cookieStore = await cookies();
  } catch (e) {
    // Tolérance lorsque appelé hors d'un contexte de requête Next.js HTTP
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore ? cookieStore.getAll() : [];
        },
        setAll() {
          // Les cookies sont gérés par le middleware.
        },
      },
    }
  );
}