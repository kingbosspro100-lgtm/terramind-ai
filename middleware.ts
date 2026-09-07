import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { auth } from "@/auth";

const protectedRoutes = [
  "/dashboard",
  "/admin",
  "/farms",
  "/crops",
  "/stock",
  "/finance",
  "/marketplace",
  "/notifications",
  "/profile",
  "/settings",
  "/weather",
  "/ai",
  "/home",
  "/checkout"
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and favicon
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 1. Check Supabase Auth and refresh cookies
  let hasSupabaseUser = false;
  let currentUserId: string | null = null;

  try {
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
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value);
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (user && !user.email?.endsWith("@deleted.invalid") && !user.email?.startsWith("deleted_")) {
      hasSupabaseUser = true;
      currentUserId = user.id;
    }
  } catch (e) {
    // ignore
  }

  // 2. Check NextAuth Session
  let hasNextAuthSession = false;
  try {
    const session = await auth();
    if (session?.user) {
      hasNextAuthSession = true;
    }
  } catch (e) {
    // ignore
  }

  const isAuthenticated = hasSupabaseUser || hasNextAuthSession;

  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login/register pages
  if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};