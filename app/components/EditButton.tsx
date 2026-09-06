"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateFarm } from "@/services/farms";
import { showToast } from "@/app/components/ui/ToastContainer";
import {
  Pencil,
  X,
  Save,
  MapPin,
  Wheat,
  Landmark,
  Ruler,
  Tractor,
} from "lucide-react";

type Props = {
  id: string;
  name: string;
  country: string;
  city: string;
  main_crop: string;
  area: number;
};

export default function EditButton({
  id,
  name,
  country,
  city,
  main_crop,
  area,
}: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [farmName, setFarmName] = useState(name);
  const [farmCountry, setFarmCountry] = useState(country);
  const [farmCity, setFarmCity] = useState(city);
  const [farmCrop, setFarmCrop] = useState(main_crop);
  const [farmArea, setFarmArea] = useState(area);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const normCountry = farmCountry.trim().toLowerCase();
    if (normCountry !== "bénin" && normCountry !== "benin" && normCountry !== "bj") {
      showToast("TerraMind AI est actuellement disponible uniquement pour les exploitations situées au Bénin.", "error");
      return;
    }

    setLoading(true);
    try {
      await updateFarm(id, {
        name: farmName,
        country: farmCountry,
        city: farmCity,
        main_crop: farmCrop,
        area: Number(farmArea),
      });

      setOpen(false);
      router.refresh();
      showToast("Exploitation modifiée avec succès.", "success");
    } catch (error: any) {
      console.error(error);
      showToast(error?.message || "Impossible de modifier l'exploitation.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 font-bold text-xs"
      >
        Modifier
      </button>

      {/* Modal Dialog */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-xl rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-[#181436] via-[#0D0924] to-[#050A07] p-6 shadow-2xl space-y-6 text-white overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-emerald-900/30 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-blue-500/30 bg-blue-950/60 p-2.5 text-blue-400">
                  <Pencil className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-white">Modifier l'exploitation</h2>
                  <p className="text-xs text-emerald-200/70">Ajustez les détails de votre parcelle ou domaine</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-emerald-900/40 bg-[#0A100C] p-2 text-emerald-300/60 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1.5">Nom de l'exploitation</label>
                <div className="relative">
                  <Tractor className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400/50" />
                  <input
                    type="text"
                    required
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    className="w-full rounded-2xl bg-[#0A100C] border border-emerald-900/40 pl-10 pr-4 py-3 text-sm text-white placeholder-emerald-300/30 outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1.5">Pays</label>
                  <div className="relative">
                    <Landmark className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400/50" />
                    <input
                      type="text"
                      required
                      value={farmCountry}
                      onChange={(e) => setFarmCountry(e.target.value)}
                      className="w-full rounded-2xl bg-[#0A100C] border border-emerald-900/40 pl-10 pr-4 py-3 text-sm text-white placeholder-emerald-300/30 outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1.5">Ville</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400/50" />
                    <input
                      type="text"
                      required
                      value={farmCity}
                      onChange={(e) => setFarmCity(e.target.value)}
                      className="w-full rounded-2xl bg-[#0A100C] border border-emerald-900/40 pl-10 pr-4 py-3 text-sm text-white placeholder-emerald-300/30 outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1.5">Culture principale</label>
                  <div className="relative">
                    <Wheat className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400/50" />
                    <input
                      type="text"
                      required
                      value={farmCrop}
                      onChange={(e) => setFarmCrop(e.target.value)}
                      className="w-full rounded-2xl bg-[#0A100C] border border-emerald-900/40 pl-10 pr-4 py-3 text-sm text-white placeholder-emerald-300/30 outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1.5">Superficie (ha)</label>
                  <div className="relative">
                    <Ruler className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400/50" />
                    <input
                      type="number"
                      required
                      value={farmArea}
                      onChange={(e) => setFarmArea(Number(e.target.value))}
                      className="w-full rounded-2xl bg-[#0A100C] border border-emerald-900/40 pl-10 pr-4 py-3 text-sm text-white placeholder-emerald-300/30 outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-emerald-900/30">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl border border-emerald-900/40 bg-[#0A100C] px-5 py-3 text-xs font-bold text-emerald-300 hover:text-white transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-xs font-extrabold text-white shadow-lg shadow-emerald-600/30 hover:opacity-95 transition disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{loading ? "Sauvegarde..." : "Enregistrer"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}