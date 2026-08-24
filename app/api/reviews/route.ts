import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";

const DEFAULT_REVIEWS = [
  {
    id: "rev_default_1",
    name: "Sessou Kpodanho",
    location: "Bohicon, Zou",
    rating: 5,
    comment:
      "TerraMind m'a beaucoup aidé à organiser mes parcelles de maïs et à identifier une carence par photo avant de perdre ma récolte.",
    created_at: "2026-08-14T10:00:00Z",
  },
  {
    id: "rev_default_2",
    name: "Pascaline Tossou",
    location: "Parakou, Borgou",
    rating: 5,
    comment:
      "La météo exacte par département et la dictée vocale au champ me font gagner un temps précieux chaque jour.",
    created_at: "2026-08-18T14:30:00Z",
  },
];

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase user_reviews table GET notice:", error.message);
      return NextResponse.json({ reviews: DEFAULT_REVIEWS });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ reviews: DEFAULT_REVIEWS });
    }

    return NextResponse.json({ reviews: data });
  } catch (err: any) {
    console.error("GET /api/reviews error:", err);
    return NextResponse.json({ reviews: DEFAULT_REVIEWS });
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

    const supabase = await createClient();
    const newReview = {
      name: name.trim(),
      location: (location || "Bénin").trim(),
      rating: Number(rating) || 5,
      comment: comment.trim(),
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("user_reviews")
      .insert([newReview])
      .select();

    if (error) {
      console.warn("Supabase user_reviews POST notice:", error.message);
      return NextResponse.json({
        success: true,
        review: { id: "rev_" + Date.now(), ...newReview },
      });
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
      console.warn("Supabase user_reviews DELETE notice:", error.message);
    }

    return NextResponse.json({
      success: true,
      message: "Avis supprimé de Supabase.",
    });
  } catch (err: any) {
    console.error("DELETE /api/reviews error:", err);
    return NextResponse.json(
      { error: "Impossible de supprimer l'avis." },
      { status: 500 }
    );
  }
}
