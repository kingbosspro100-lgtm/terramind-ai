import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";
import { getCurrentUser } from "@/lib/auth-helper";

export async function POST() {
  try {
    const user = await getCurrentUser();

    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié." },
        { status: 401 }
      );
    }

    const supabase = await createClient();
    const userId = user.id;

    // 1. Clean up user database records across all user tables
    try {
      await supabase.from("crops").delete().eq("user_id", userId);
      await supabase.from("transactions").delete().eq("user_id", userId);
      await supabase.from("stock").delete().eq("user_id", userId);
      await supabase.from("farms").delete().eq("user_id", userId);
      await supabase.from("subscriptions").delete().eq("user_id", userId);
      await supabase.from("payments").delete().eq("user_id", userId);
      await supabase.from("ai_usage").delete().eq("user_id", userId);
      await supabase.from("ai_weekly_ads").delete().eq("user_id", userId);
      await supabase.from("users_profile").delete().eq("id", userId);
    } catch (dbErr) {
      console.warn("Notice during user tables cleanup:", dbErr);
    }

    // 2. Invalidate user auth credentials so logging back in fails
    try {
      await supabase.auth.updateUser({
        email: `deleted_${Date.now()}_${userId}@deleted.invalid`,
        password: `DELETED_${Date.now()}_${Math.random()}`,
      });
    } catch (authErr) {
      console.warn("Auth update notice on deletion:", authErr);
    }

    // 3. Sign out session
    await supabase.auth.signOut();

    return NextResponse.json({
      success: true,
      message: "Compte supprimé définitivement.",
    });
  } catch (error: any) {
    console.error("Account deletion route error:", error);
    return NextResponse.json(
      { error: error?.message || "Impossible de supprimer le compte." },
      { status: 500 }
    );
  }
}
