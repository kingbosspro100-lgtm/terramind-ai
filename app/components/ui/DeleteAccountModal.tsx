"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";
import { useState } from "react";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
}: DeleteAccountModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl border border-red-900/50 bg-gradient-to-b from-[#1E1118] via-[#140B10] to-[#0A0508] p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-red-900/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-950/80 border border-red-700/50 text-red-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Supprimer le compte</h3>
              <p className="text-xs text-red-200/70 font-medium">Action irréversible</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-xs text-red-100/90 leading-relaxed font-medium">
          Êtes-vous absolument sûr de vouloir supprimer définitivement votre compte TerraMind AI ? Toutes vos exploitations, données de récoltes, inventaires et historiques de conversations IA seront supprimés.
        </p>

        <div className="pt-3 border-t border-red-900/30 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-2xl border border-emerald-900/40 bg-[#0A100C] px-5 py-2.5 text-xs font-bold text-slate-300 hover:text-white transition"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 px-6 py-2.5 text-xs font-extrabold text-white shadow-xl shadow-red-600/30 hover:opacity-90 transition disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            <span>{loading ? "Suppression en cours..." : "Confirmer la suppression"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
