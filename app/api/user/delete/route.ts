import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";
import { createAdminClient } from "@/lib/supabase-admin";

async function getSupabaseUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return { supabase, user };
}

export async function POST() {
  try {
    const authenticated = await getSupabaseUser();
    if (!authenticated) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié." },
        { status: 401 }
      );
    }

    const { supabase, user } = authenticated;
    const admin = createAdminClient();
    const requestedAt = new Date();
    const scheduledFor = new Date(requestedAt.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const { error: requestError } = await admin
      .from("account_deletion_requests")
      .upsert({ user_id: user.id, requested_at: requestedAt.toISOString(), scheduled_for: scheduledFor });

    if (requestError) throw requestError;

    const { error: metadataError } = await admin.auth.admin.updateUserById(user.id, {
      app_metadata: {
        ...user.app_metadata,
        pending_deletion_at: scheduledFor,
      },
    });

    if (metadataError) {
      await admin.from("account_deletion_requests").delete().eq("user_id", user.id);
      throw metadataError;
    }

    await supabase.auth.signOut();

    return NextResponse.json({
      success: true,
      scheduledFor,
      message: "La suppression du compte est programmée dans 7 jours. Vous pouvez l’annuler en vous reconnectant avant cette date.",
    });
  } catch (error) {
    console.error("Account deletion route error:", error);
    return NextResponse.json(
      { error: "Impossible de programmer la suppression du compte." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const authenticated = await getSupabaseUser();
    if (!authenticated) {
      return NextResponse.json({ error: "Utilisateur non authentifié." }, { status: 401 });
    }

    const { user } = authenticated;
    const admin = createAdminClient();
    const { data: request, error: requestError } = await admin
      .from("account_deletion_requests")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (requestError) throw requestError;
    if (!request) {
      return NextResponse.json({ error: "Aucune suppression en attente." }, { status: 404 });
    }

    const appMetadata = { ...(user.app_metadata ?? {}) };
    delete appMetadata.pending_deletion_at;
    const { error: metadataError } = await admin.auth.admin.updateUserById(user.id, {
      app_metadata: appMetadata,
    });
    if (metadataError) throw metadataError;

    const { error: deleteError } = await admin
      .from("account_deletion_requests")
      .delete()
      .eq("user_id", user.id);

    if (deleteError) {
      await admin.auth.admin.updateUserById(user.id, {
        app_metadata: { ...appMetadata, pending_deletion_at: new Date().toISOString() },
      });
      throw deleteError;
    }

    return NextResponse.json({ success: true, message: "La suppression du compte a été annulée." });
  } catch (error) {
    console.error("Account deletion cancellation error:", error);
    return NextResponse.json({ error: "Impossible d’annuler la suppression du compte." }, { status: 500 });
  }
}
