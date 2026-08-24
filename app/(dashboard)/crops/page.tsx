import Link from "next/link";
import { createClient } from "@/lib/server";
import { getCurrentUser } from "@/lib/auth-helper";
import { redirect } from "next/navigation";
import { Activity, Calendar, Clock, Image as ImageIcon, Plus, Sprout, Wheat } from "lucide-react";
import CropCard from "@/app/components/CropCard";
import CropForm from "@/app/components/CropForm";
import PhotoGallery from "@/app/components/crops/PhotoGallery";

type Props = { searchParams: Promise<{ view?: string }> };

// Suppression exclusive de l'onglet "Historique IA" dans le module Cultures conformément au cahier des charges
const tabs = [
  { value: "active", label: "Cultures actives", icon: Sprout },
  { value: "calendar", label: "Calendrier des semis", icon: Calendar },
  { value: "harvests", label: "Prévisions récoltes", icon: Wheat },
  { value: "gallery", label: "Galerie photos", icon: ImageIcon },
];

export default async function CropsPage({ searchParams }: Props) {
  const view = (await searchParams).view ?? "active";
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const supabase = await createClient();
  const [{ data: crops }, { data: farms }] = await Promise.all([
    supabase.from("crops").select("*, farms(name)").order("created_at", { ascending: false }),
    supabase.from("farms").select("id, name").eq("user_id", user.id),
  ]);
  const cropList = crops ?? [];
  const farmList = farms ?? [];

  const content =
    view === "new" ? (
      farmList[0] ? (
        <CropForm farmId={farmList[0].id} />
      ) : (
        <p className="rounded-3xl border border-amber-700/30 bg-amber-950/20 p-6 text-amber-200">
          Ajoutez d&apos;abord une exploitation avant de créer une culture.
        </p>
      )
    ) : view === "calendar" ? (
      <section className="rounded-3xl border border-emerald-900/30 bg-gradient-to-b from-[#181436] to-[#050A07] p-6 shadow-2xl">
        <h2 className="text-xl font-bold">Calendrier des semis</h2>
        <div className="mt-5 space-y-3">
          {cropList.length ? (
            cropList.map((crop: any) => (
              <div key={crop.id} className="rounded-2xl border border-emerald-900/20 bg-[#0B0914]/60 p-4">
                <b>{crop.name}</b>
                <p className="mt-1 text-sm text-emerald-200/70">
                  Semis : {crop.sowing_date ?? "Date non renseignée"} · Exploitation : {crop.farms?.name ?? "—"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-emerald-200/60">Aucun semis planifié.</p>
          )}
        </div>
      </section>
    ) : view === "harvests" ? (
      <section className="rounded-3xl border border-emerald-900/30 bg-gradient-to-b from-[#181436] to-[#050A07] p-6 shadow-2xl">
        <h2 className="text-xl font-bold">Prévisions de récolte</h2>
        <div className="mt-5 space-y-3">
          {cropList.length ? (
            cropList.map((crop: any) => (
              <div key={crop.id} className="rounded-2xl border border-emerald-900/20 bg-[#0B0914]/60 p-4">
                <b>{crop.name}</b>
                <p className="mt-1 text-sm text-emerald-200/70">
                  Récolte estimée : {crop.harvest_date ?? "À définir"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-emerald-200/60">Aucune prévision disponible.</p>
          )}
        </div>
      </section>
    ) : view === "gallery" ? (
      <PhotoGallery />
    ) : (
      <section className="space-y-6">
        {cropList.length ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {cropList.map((crop: any) => (
              <CropCard key={crop.id} crop={crop} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-emerald-900/50 p-12 text-center text-emerald-200/60">
            Aucune culture enregistrée.
          </div>
        )}
      </section>
    );

  return (
    <main className="mx-auto max-w-7xl space-y-8 pb-16 text-white">
      <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3 py-1 text-[11px] font-bold text-emerald-300">
            <Activity className="h-3 w-3" />
            SUIVI AGRONOMIQUE
          </p>
          <h1 className="mt-3 text-3xl font-extrabold">Cultures & récoltes</h1>
          <p className="mt-1 text-sm text-emerald-200/70">Planifiez, observez et analysez vos cultures.</p>
        </div>
        <Link
          href="/crops?view=new"
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-xs font-bold shadow-xl shadow-emerald-600/30"
        >
          <Plus className="h-4 w-4" />
          Nouvelle culture
        </Link>
      </header>

      <nav className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map(({ value, label, icon: Icon }) => (
          <Link
            key={value}
            href={`/crops?view=${value}`}
            className={`inline-flex whitespace-nowrap items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-bold ${
              view === value
                ? "border-emerald-500 bg-emerald-600 text-white"
                : "border-emerald-900/30 bg-[#0A100C] text-emerald-300 hover:bg-[#1C183B]"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total cultures", value: cropList.length, icon: Sprout },
          { label: "Semées", value: 4, icon: Calendar },
          { label: "En croissance", value: 4, icon: Clock },
          { label: "Récoltées", value: cropList.filter((crop: any) => crop.status === "Récolté").length, icon: Wheat },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-3xl border border-emerald-900/30 bg-gradient-to-b from-[#181436] to-[#050A07] p-6">
            <Icon className="h-5 w-5 text-emerald-400" />
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-emerald-300/60">{label}</p>
            <p className="mt-1 text-3xl font-extrabold">{value}</p>
          </div>
        ))}
      </section>

      {content}
    </main>
  );
}
