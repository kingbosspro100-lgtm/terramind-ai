import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";
import { getCurrentUser } from "@/lib/auth-helper";
import { isAdmin } from "@/services/admin";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_reviews")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase user_reviews GET notice:", error.message);
      return NextResponse.json({ reviews: [] });
    }

    return NextResponse.json({ reviews: data || [] });
  } catch (err: any) {
    console.error("GET /api/reviews error:", err);
    return NextResponse.json({ reviews: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, location, rating, comment } = body;

    if (!name || !comment) {
      return NextResponse.json(
        { error: "Le nom et le commentaire sont obligatoires." },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();
    const supabase = await createClient();

    const newReview = {
      user_id: user?.id || null,
      name: name.trim(),
      location: (location || "Bénin").trim(),
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      comment: comment.trim(),
      is_public: true,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("user_reviews")
      .insert([newReview])
      .select();

    if (error) {
      console.error("Supabase user_reviews POST error:", error.message);
      return NextResponse.json(
        { error: `Erreur lors de l'enregistrement de l'avis: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      review: data ? data[0] : newReview,
    });
  } catch (err: any) {
    console.error("POST /api/reviews error:", err);
    return NextResponse.json(
      { error: "Impossible de publier l'avis." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Accès non autorisé." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID de l'avis requis." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { error } = await supabase.from("user_reviews").delete().eq("id", id);

    if (error) {
      console.error("Supabase user_reviews DELETE error:", error.message);
      return NextResponse.json(
        { error: `Erreur lors de la suppression: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Avis supprimé définitivement de Supabase.",
    });
  } catch (err: any) {
    console.error("DELETE /api/reviews error:", err);
    return NextResponse.json(
      { error: "Impossible de supprimer l'avis." },
      { status: 500 }
    );
  }
}
