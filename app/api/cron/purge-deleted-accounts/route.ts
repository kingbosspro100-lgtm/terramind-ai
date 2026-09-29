import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

const OPTIONAL_USER_TABLES = [
  { name: "ai_weekly_ads", column: "user_id" },
  { name: "user_reviews", column: "user_id" },
  { name: "admin_users", column: "user_id" },
] as const;

async function removeAvatarFiles(admin: ReturnType<typeof createAdminClient>, folderPath: string) {
  const bucket = admin.storage.from("avatars");
  let offset = 0;

  while (true) {
    const { data: files, error } = await bucket.list(folderPath, { limit: 1000, offset });
    if (error) throw error;
    if (!files?.length) return;

    const paths = files.filter((file) => file.id).map((file) => `${folderPath}/${file.name}`);
    if (paths.length) {
      const { error: removeError } = await bucket.remove(paths);
      if (removeError) throw removeError;
    }

    if (files.length < 1000) return;
    offset += files.length;
  }
}

async function removeUserAvatars(admin: ReturnType<typeof createAdminClient>, userId: string) {
  await removeAvatarFiles(admin, `avatars/${userId}`);
  await removeAvatarFiles(admin, userId);
}

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: "CRON_SECRET n’est pas configuré." }, { status: 500 });
  }
  if (request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const admin = createAdminClient();
    const { data: dueRequests, error: queryError } = await admin
      .from("account_deletion_requests")
      .select("user_id")
      .lte("scheduled_for", new Date().toISOString())
      .order("scheduled_for", { ascending: true })
      .limit(50);

    if (queryError) throw queryError;

    const deleted: string[] = [];
    const failed: string[] = [];

    for (const deletionRequest of dueRequests ?? []) {
      try {
        await removeUserAvatars(admin, deletionRequest.user_id);

        for (const table of OPTIONAL_USER_TABLES) {
          const { error } = await admin
            .from(table.name)
            .delete()
            .eq(table.column, deletionRequest.user_id);

          if (error && error.code !== "42P01" && error.code !== "PGRST205") {
            throw error;
          }
        }

        const { error: deleteError } = await admin.auth.admin.deleteUser(deletionRequest.user_id, false);
        if (deleteError) throw deleteError;
        deleted.push(deletionRequest.user_id);
      } catch (error) {
        console.error(`Échec de suppression définitive du compte ${deletionRequest.user_id}:`, error);
        failed.push(deletionRequest.user_id);
      }
    }

    return NextResponse.json({ processed: deleted.length, failed: failed.length });
  } catch (error) {
    console.error("Account deletion purge failed:", error);
    return NextResponse.json({ error: "La purge des comptes n’a pas pu être exécutée." }, { status: 500 });
  }
}