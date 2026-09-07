import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as any;
  const next = searchParams.get("next") ?? "/dashboard";

  if (token_hash && type) {
    const response = NextResponse.redirect(`${origin}${next}`);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zjqepfcahnvlxyexymer.supabase.co";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_vR7j-YWPlqEM54Ems6W74w_dmnIc0qQ";

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      return response;
    }
  }

  // If no token or error, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=verification_failed`);
}
