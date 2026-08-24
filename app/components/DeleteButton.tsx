"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteFarm } from "@/services/farms";
import { showToast } from "@/app/components/ui/ToastContainer";
import {
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";

type Props = {
  id: string;
};

export default function DeleteButton({ id }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    try {
      setLoading(true);
      await deleteFarm(id);
      setOpen(false);
      router.refresh();
      showToast("Exploitation supprimée avec succès.", "success");
    } catch (error) {
      console.error(error);
      showToast("Impossible de supprimer l'exploitation.", "error");
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
        className="flex items-center gap-1.5 font-bold text-xs text-red-400 hover:text-red-300"
      >
        Supprimer
      </button>

      {/* Modal Dialog */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-md rounded-3xl border border-red-500/30 bg-gradient-to-b from-[#181436] via-[#0D0924] to-[#050A07] p-6 shadow-2xl space-y-6 text-white overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-emerald-900/30 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-red-500/30 bg-red-950/60 p-2.5 text-red-400">
                  <TriangleAlert className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-white">Supprimer l'exploitation</h2>
                  <p className="text-xs text-red-200/70">Cette action est définitive et irréversible</p>
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

            {/* Warning Message */}
            <div className="rounded-2xl border border-red-900/40 bg-red-950/30 p-4 text-xs font-semibold text-red-200 space-y-2">
              <p>Voulez-vous vraiment supprimer cette exploitation agricole ?</p>
              <p className="text-[11px] text-red-300/80 leading-relaxed">
                ⚠️ Toutes les parcelles, données météo, prédictions et cultures associées seront purgées définitivement.
              </p>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="rounded-2xl border border-emerald-900/40 bg-[#0A100C] px-5 py-3 text-xs font-bold text-emerald-300 hover:text-white transition"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-6 py-3 text-xs font-extrabold text-white shadow-lg shadow-red-600/30 hover:bg-red-500 transition disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                <span>{loading ? "Suppression..." : "Confirmer la suppression"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}