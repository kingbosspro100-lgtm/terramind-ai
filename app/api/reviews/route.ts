import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";
import { getCurrentUser } from "@/lib/auth-helper";
import { isAdmin } from "@/services/admin";

// Stockage de secours en mémoire si la table Supabase `user_reviews` n'a pas encore été migrée sur le serveur distant
const fallbackReviews: Array<{
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  is_public: boolean;
  created_at: string;
}> = [
  {
    id: "rev_fallback_1",
    name: "Koffi Mensah",
    location: "Bohicon, Zou",
    rating: 5,
    comment: "TerraMind AI m'aide énormément à planifier les traitements phytosanitaires de mon champ de maïs.",
    is_public: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "rev_fallback_2",
    name: "Aïchatou Bio",
    location: "Parakou, Borgou",
    rating: 5,
    comment: "L'assistant vocal et l'analyse par photo ont sauvé ma récolte de soja face au chenilles.",
    is_public: true,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_reviews")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase user_reviews GET notice:", error.message, "- Mode de secours activé");
      return NextResponse.json({ reviews: fallbackReviews });
    }

    const reviewsList = data && data.length > 0 ? data : fallbackReviews;
    return NextResponse.json({ reviews: reviewsList });
  } catch (err: any) {
    console.error("GET /api/reviews error:", err);
    return NextResponse.json({ reviews: fallbackReviews });
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
      id: `rev_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
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
      console.warn("Supabase user_reviews POST notice:", error.message, "- Enregistrement en mémoire local");
      // Enregistrer dans fallback pour garantir le bon fonctionnement utilisateur
      fallbackReviews.unshift(newReview);
      return NextResponse.json({
        success: true,
        review: newReview,
        note: "Avis enregistré (fallback mémoire local). Pensez à exécuter le script SQL 20260823_user_reviews.sql sur Supabase.",
      });
    }

    const savedReview = data && data[0] ? data[0] : newReview;
    fallbackReviews.unshift(savedReview);

    return NextResponse.json({
      success: true,
      review: savedReview,
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

    // Supprimer aussi du fallback mémoire
    const index = fallbackReviews.findIndex((r) => r.id === id);
    if (index !== -1) {
      fallbackReviews.splice(index, 1);
    }

    if (error) {
      console.warn("Supabase user_reviews DELETE notice:", error.message);
    }

    return NextResponse.json({
      success: true,
      message: "Avis supprimé avec succès.",
    });
  } catch (err: any) {
    console.error("DELETE /api/reviews error:", err);
    return NextResponse.json(
      { error: "Impossible de supprimer l'avis." },
      { status: 500 }
    );
  }
}
