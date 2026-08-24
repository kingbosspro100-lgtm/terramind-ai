"use client";

import { useState, useEffect } from "react";
import PublicHeader from "@/app/components/landing/PublicHeader";
import Footer from "@/app/components/landing/Footer";
import { useLanguage } from "@/lib/language-context";
import { Star, MessageSquare, Send, CheckCircle2, User } from "lucide-react";
import { createClient } from "@/lib/client";

interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
}

export default function AvisPage() {
  const { publicLanguage } = useLanguage();
  const isEn = publicLanguage === "en";
  const supabase = createClient();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch("/api/reviews");
        if (res.ok) {
          const json = await res.json();
          if (json.reviews) {
            const formatted = json.reviews.map((r: any) => ({
              id: r.id,
              name: r.name || "Agriculteur",
              location: r.location || "Bénin",
              rating: r.rating || 5,
              comment: r.comment || "",
              date: r.created_at
                ? new Date(r.created_at).toLocaleDateString(isEn ? "en-US" : "fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Récemment",
            }));
            setReviews(formatted);
            return;
          }
        }
      } catch (e) {}

      // Fallback
      const saved = localStorage.getItem("terramind_user_reviews");
      if (saved) {
        try {
          setReviews(JSON.parse(saved));
        } catch (e) {}
      }
    }

    loadReviews();
  }, [isEn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setSubmitting(true);
    const reviewPayload = {
      name: name.trim(),
      location: location.trim() || "Bénin",
      rating,
      comment: comment.trim(),
    };

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewPayload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.review) {
          const createdRev: Review = {
            id: data.review.id || "rev_" + Date.now(),
            name: data.review.name,
            location: data.review.location,
            rating: data.review.rating,
            comment: data.review.comment,
            date: new Date().toLocaleDateString(isEn ? "en-US" : "fr-FR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
          };
          setReviews((prev) => [createdRev, ...prev]);
        }
      }
    } catch (e) {
      console.warn("Public review POST error:", e);
    }

    setSubmitting(false);
    setSubmitted(true);
    setName("");
    setLocation("");
    setComment("");
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#0B0914] text-white flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
      <PublicHeader />

      <main className="flex-1 pt-28 pb-16 px-4 md:px-8 max-w-5xl mx-auto w-full space-y-10">
        {/* Header */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-4 py-1.5 text-xs font-bold text-emerald-300">
            <MessageSquare className="h-4 w-4 text-emerald-400" />
            <span>{isEn ? "Community Feedback" : "Avis Utilisateurs & Agriculteurs"}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white">
            {isEn ? "What Farmers Say About TerraMind AI" : "Vos avis sur TerraMind AI"}
          </h1>

          <p className="text-xs md:text-sm text-emerald-200/80 max-w-2xl mx-auto font-medium leading-relaxed">
            {isEn
              ? "Share your experience with TerraMind AI and read feedback from other farmers across Benin."
              : "Partagez votre retour d'expérience et découvrez l'avis des exploitants agricoles qui utilisent la plateforme."}
          </p>
        </section>

        {/* Leave Review Form */}
        <section className="rounded-3xl border border-emerald-900/30 bg-gradient-to-b from-[#181436] to-[#050A07] p-8 shadow-2xl space-y-6">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2 border-b border-emerald-900/30 pb-4">
            <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
            <span>{isEn ? "Leave Your Feedback" : "Donner mon avis"}</span>
          </h2>

          {submitted && (
            <div className="rounded-2xl bg-emerald-950/80 border border-emerald-500/40 p-4 text-xs text-emerald-300 font-bold flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>{isEn ? "Thank you for your feedback! Your review has been added." : "Merci pour votre avis ! Votre témoignage a été publié avec succès."}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1">
                  {isEn ? "Your Name *" : "Votre nom complet *"}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isEn ? "e.g. Jean K." : "ex: Koffi Mensah"}
                  className="w-full rounded-2xl bg-[#0A100C] border border-emerald-900/40 px-4 py-3 text-sm text-white placeholder-emerald-300/30 outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1">
                  {isEn ? "Location / Region" : "Commune / Département"}
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={isEn ? "e.g. Bohicon" : "ex: Bohicon, Zou"}
                  className="w-full rounded-2xl bg-[#0A100C] border border-emerald-900/40 px-4 py-3 text-sm text-white placeholder-emerald-300/30 outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">
                {isEn ? "Rating (1 to 5 stars)" : "Note d'appréciation"}
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-2 transition hover:scale-110"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= rating ? "text-amber-400 fill-amber-400" : "text-slate-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">
                {isEn ? "Your Review / Feedback *" : "Votre témoignage / avis *"}
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  isEn
                    ? "Tell us how TerraMind AI helped your farm management..."
                    : "Expliquez comment TerraMind vous aide dans vos activités agricoles..."
                }
                className="w-full rounded-2xl bg-[#0A100C] border border-emerald-900/40 px-4 py-3 text-sm text-white placeholder-emerald-300/30 outline-none focus:border-emerald-500/50 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3.5 text-xs font-bold text-white shadow-xl shadow-emerald-600/30 hover:opacity-95 transition disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>{submitting ? "Publication..." : isEn ? "Submit Review" : "Publier mon avis"}</span>
            </button>
          </form>
        </section>

        {/* Existing Reviews List */}
        <section className="space-y-4">
          <h3 className="text-lg font-extrabold text-white">
            {isEn ? "Community Reviews" : "Avis de la communauté"} ({reviews.length})
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="rounded-3xl border border-emerald-900/30 bg-gradient-to-b from-[#181436] to-[#050A07] p-6 shadow-xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white">{rev.name}</h4>
                      <p className="text-[11px] text-emerald-300/60 font-medium">{rev.location}</p>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < rev.rating ? "text-amber-400 fill-amber-400" : "text-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-emerald-100/80 leading-relaxed font-medium">
                  « {rev.comment} »
                </p>

                <div className="text-[10px] text-emerald-300/40 font-semibold border-t border-emerald-900/30 pt-2 text-right">
                  {rev.date}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
