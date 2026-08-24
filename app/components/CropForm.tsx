"use client";

import { useState } from "react";
import { createCrop } from "@/services/crops";
import { useRouter } from "next/navigation";
import { Plus, Sprout, CalendarDays } from "lucide-react";
import TerraDialog from "@/app/components/ui/TerraDialog";

type Props = {
  farmId: string;
};

export default function CropForm({ farmId }: Props) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [sowingDate, setSowingDate] = useState("");
  const [harvestDate, setHarvestDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogType, setDialogType] = useState<"success" | "error">("success");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await createCrop({
        farm_id: farmId,
        name,
        sowing_date: sowingDate,
        harvest_date: harvestDate,
      });

      setName("");
      setSowingDate("");
      setHarvestDate("");
      setDialogType("success");
      setDialogMessage("✅ Culture ajoutée avec succès.");
      setIsDialogOpen(true);
    } catch (error: any) {
      console.error("Erreur :", error);
      setDialogType("error");
      setDialogMessage("❌ Erreur lors de l'ajout de la culture.");
      setIsDialogOpen(true);
    } finally {
      setLoading(false);
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    if (dialogType === "success") {
      router.refresh();
    }
  };

  return (
    <div className="rounded-3xl bg-[#0A100C] border border-emerald-900/30 p-6 shadow-sm mt-8 relative">
      
      <TerraDialog 
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        title={dialogType === "success" ? "Culture ajoutée !" : "Erreur"}
        message={dialogMessage}
        ctaText="Continuer"
      />
      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
        <Sprout className="h-5 w-5 text-emerald-400" />
        Nouvelle Culture
      </h3>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-300/60 mb-1.5">
            Type de culture
          </label>
          <div className="relative">
            <Sprout className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400/50" />
            <input
              type="text"
              required
              placeholder="Ex: Maïs"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl bg-[#0B0914] border border-emerald-900/40 pl-9 pr-3 py-2.5 text-sm text-white placeholder-emerald-300/30 outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-300/60 mb-1.5">
            Date de Semis
          </label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400/50" />
            <input
              type="date"
              required
              value={sowingDate}
              onChange={(e) => setSowingDate(e.target.value)}
              className="w-full rounded-xl bg-[#0B0914] border border-emerald-900/40 pl-9 pr-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50 [color-scheme:dark]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-300/60 mb-1.5">
            Date de Récolte prévue
          </label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400/50" />
            <input
              type="date"
              required
              value={harvestDate}
              onChange={(e) => setHarvestDate(e.target.value)}
              className="w-full rounded-xl bg-[#0B0914] border border-emerald-900/40 pl-9 pr-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50 [color-scheme:dark]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-emerald-900/20 hover:opacity-95 transition"
        >
          <Plus className="h-4 w-4" />
          <span>{loading ? "Ajout..." : "Ajouter"}</span>
        </button>

      </form>
    </div>
  );
}