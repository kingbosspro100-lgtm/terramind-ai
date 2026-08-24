"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Tractor,
  MapPinned,
  Landmark,
  Sprout,
  Ruler,
  Plus,
  AlertCircle,
  X as XIcon,
  Navigation,
  Compass,
  Loader2,
} from "lucide-react";

import { createFarm } from "@/services/farms";
import TerraDialog from "@/app/components/ui/TerraDialog";
import { createClient } from "@/lib/client";

export default function FarmForm() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogCustom, setDialogCustom] = useState({
    isOpen: false,
    title: "",
    message: "",
    ctaText: "OK",
    onCtaClick: undefined as (() => void) | undefined,
    icon: null as React.ReactNode,
  });

  const [name, setName] = useState("");
  const [country, setCountry] = useState("Bénin");
  const [city, setCity] = useState("");
  const [mainCrop, setMainCrop] = useState("");
  const [area, setArea] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // Récupération automatique de la géolocalisation GPS du navigateur
  const handleAutoGeolocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setDialogCustom({
        isOpen: true,
        title: "Géolocalisation Non Supportée",
        message: "Votre navigateur ne supporte pas le capteur GPS.",
        ctaText: "OK",
        onCtaClick: undefined,
        icon: <AlertCircle size={28} />,
      });
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lon = position.coords.longitude.toFixed(6);
        setLatitude(lat);
        setLongitude(lon);
        setGeoLoading(false);
      },
      (error) => {
        console.warn("Erreur capteur GPS:", error);
        setGeoLoading(false);
        setDialogCustom({
          isOpen: true,
          title: "Accès GPS Rejeté",
          message:
            "Veuillez autoriser l'accès à votre position GPS ou saisir manuellement les coordonnées.",
          ctaText: "Compris",
          onCtaClick: undefined,
          icon: <AlertCircle size={28} />,
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name || !country || !city || !mainCrop || !area) {
      setDialogCustom({
        isOpen: true,
        title: "Champs manquants",
        message: "Veuillez remplir tous les champs obligatoires (*).",
        ctaText: "OK",
        onCtaClick: undefined,
        icon: <AlertCircle size={28} />,
      });
      return;
    }

    try {
      setLoading(true);

      // Check current user farms and plan quotas
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userFarms } = await supabase
          .from("farms")
          .select("id")
          .eq("user_id", user.id);

        const currentFarmCount = userFarms?.length || 0;

        let userPlan = user.user_metadata?.plan || "free";
        try {
          const { data: subData } = await supabase
            .from("subscriptions")
            .select("plan")
            .eq("user_id", user.id)
            .maybeSingle();
          if (subData?.plan) userPlan = subData.plan;
        } catch (e) {}

        const normalizedPlan = userPlan.toLowerCase();

        if (normalizedPlan === "free" && currentFarmCount >= 1) {
          setLoading(false);
          setDialogCustom({
            isOpen: true,
            title: "Limite d'exploitations atteinte (Formule FREE)",
            message:
              "Votre formule FREE est limitée à 1 seule exploitation agricole. Pour créer jusqu'à 10 exploitations, veuillez mettre à niveau votre abonnement vers TerraMind PRO.",
            ctaText: "Passer à TerraMind PRO",
            onCtaClick: () => router.push("/pricing"),
            icon: <AlertCircle size={28} className="text-amber-400" />,
          });
          return;
        }

        if (normalizedPlan === "pro" && currentFarmCount >= 10) {
          setLoading(false);
          setDialogCustom({
            isOpen: true,
            title: "Limite d'exploitations atteinte (Formule PRO)",
            message:
              "Votre formule PRO est limitée à 10 exploitations agricoles. Pour bénéficier d'exploitations illimitées, veuillez souscrire à la formule ENTREPRISE.",
            ctaText: "Passer à la formule ENTREPRISE",
            onCtaClick: () => router.push("/pricing"),
            icon: <AlertCircle size={28} className="text-teal-400" />,
          });
          return;
        }
      }

      await createFarm({
        name,
        country,
        city,
        main_crop: mainCrop,
        area: Number(area),
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
      });

      setName("");
      setCountry("Bénin");
      setCity("");
      setMainCrop("");
      setArea("");
      setLatitude("");
      setLongitude("");

      setIsDialogOpen(true);
    } catch (error: any) {
      console.error(error);
      setDialogCustom({
        isOpen: true,
        title: "Erreur",
        message: error?.message || "Impossible de créer l'exploitation.",
        ctaText: "OK",
        onCtaClick: undefined,
        icon: <XIcon size={28} />,
      });
    } finally {
      setLoading(false);
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    router.refresh();
  };

  const handleCustomDialogClose = () => {
    if (dialogCustom.onCtaClick) {
      dialogCustom.onCtaClick();
    }
    setDialogCustom((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 shadow-2xl relative overflow-hidden text-white">
      <TerraDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        title="Félicitations !"
        message={`L'exploitation a été créée avec succès avec ses coordonnées GPS. L'assistant IA commence immédiatement à configurer votre espace agronomique.`}
        ctaText="Voir mon tableau de bord"
      />
      <TerraDialog
        isOpen={dialogCustom.isOpen}
        onClose={handleCustomDialogClose}
        title={dialogCustom.title}
        message={dialogCustom.message}
        ctaText={dialogCustom.ctaText}
        icon={dialogCustom.icon}
      />

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

      <div className="border-b border-emerald-900/30 px-8 py-6 bg-[#0B0914]/50 relative z-10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Tractor className="h-5 w-5 text-emerald-400" />
          Ajouter une nouvelle exploitation avec Géolocalisation GPS
        </h2>
        <p className="mt-1 text-xs text-emerald-200/60 font-medium">
          Renseignez les informations et récupérez automatiquement votre position GPS exacte.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-8 relative z-10">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-emerald-300/60">
              Nom de l'exploitation *
            </label>
            <div className="relative">
              <Tractor className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400/50" />
              <input
                type="text"
                placeholder="Ex: Ferme Bio du Nord"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl bg-[#0B0914] border border-emerald-900/40 py-3 pl-11 pr-4 text-sm text-white placeholder-emerald-300/30 outline-none transition focus:border-emerald-500/50"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-emerald-300/60">
              Pays *
            </label>
            <div className="relative">
              <Landmark className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400/50" />
              <input
                type="text"
                placeholder="Ex: Bénin"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-2xl bg-[#0B0914] border border-emerald-900/40 py-3 pl-11 pr-4 text-sm text-white placeholder-emerald-300/30 outline-none transition focus:border-emerald-500/50"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-emerald-300/60">
              Ville / Commune *
            </label>
            <div className="relative">
              <MapPinned className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400/50" />
              <input
                type="text"
                placeholder="Ex: Parakou"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-2xl bg-[#0B0914] border border-emerald-900/40 py-3 pl-11 pr-4 text-sm text-white placeholder-emerald-300/30 outline-none transition focus:border-emerald-500/50"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-emerald-300/60">
              Culture principale *
            </label>
            <div className="relative">
              <Sprout className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400/50" />
              <input
                type="text"
                placeholder="Ex: Maïs"
                value={mainCrop}
                onChange={(e) => setMainCrop(e.target.value)}
                className="w-full rounded-2xl bg-[#0B0914] border border-emerald-900/40 py-3 pl-11 pr-4 text-sm text-white placeholder-emerald-300/30 outline-none transition focus:border-emerald-500/50"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-emerald-300/60">
              Superficie Totale (hectares) *
            </label>
            <div className="relative">
              <Ruler className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400/50" />
              <input
                type="number"
                placeholder="Ex: 15"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full rounded-2xl bg-[#0B0914] border border-emerald-900/40 py-3 pl-11 pr-4 text-sm text-white placeholder-emerald-300/30 outline-none transition focus:border-emerald-500/50"
              />
            </div>
          </div>

          {/* Bouton de Géolocalisation GPS Automatique */}
          <div className="flex flex-col justify-end">
            <button
              type="button"
              onClick={handleAutoGeolocation}
              disabled={geoLoading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-950/60 py-3 px-4 text-xs font-bold text-emerald-300 hover:bg-emerald-900/80 hover:text-white transition shadow-md disabled:opacity-50"
            >
              {geoLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
              ) : (
                <Navigation className="h-4 w-4 text-emerald-400" />
              )}
              <span>Obtenir ma position GPS exacte (Automatique)</span>
            </button>
          </div>
        </div>

        {/* Champs Lat/Long (Correction Manuelle Autorisée) */}
        <div className="rounded-2xl border border-emerald-900/30 bg-[#0B0914]/60 p-4 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
            <Compass className="h-4 w-4 text-emerald-400" />
            <span>Coordonnées Géographiques GPS (Modification manuelle autorisée)</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-[10px] font-semibold text-slate-400">
                Latitude (Ex: 6.370100)
              </label>
              <input
                type="number"
                step="any"
                placeholder="6.370100"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full rounded-xl bg-[#0A100C] border border-emerald-900/40 p-2.5 text-xs text-white placeholder-emerald-300/30 outline-none focus:border-emerald-500/50"
              />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-semibold text-slate-400">
                Longitude (Ex: 2.429800)
              </label>
              <input
                type="number"
                step="any"
                placeholder="2.429800"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full rounded-xl bg-[#0A100C] border border-emerald-900/40 p-2.5 text-xs text-white placeholder-emerald-300/30 outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3.5 text-sm font-bold text-white transition hover:opacity-95 shadow-xl shadow-emerald-600/30 disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            <span>{loading ? "Création en cours..." : "Créer l'exploitation"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}