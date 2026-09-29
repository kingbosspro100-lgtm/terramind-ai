import { NextResponse } from "next/server";
import { isAdmin } from "@/services/admin";
import { getAdminUserDirectory } from "@/services/adminUsers";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Accès réservé aux administrateurs." }, { status: 403 });
  }

  try {
    const users = await getAdminUserDirectory();
    return NextResponse.json({ users }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Chargement de l’annuaire administrateur impossible:", error);
    return NextResponse.json(
      { error: "Les données utilisateurs ne sont pas disponibles. Vérifiez la configuration Supabase serveur." },
      { status: 503 }
    );
  }
}