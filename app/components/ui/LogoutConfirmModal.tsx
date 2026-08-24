"use client";

import { LogOut, X, AlertTriangle } from "lucide-react";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-md rounded-3xl border border-red-500/30 bg-gradient-to-b from-[#181436] via-[#0D0924] to-[#050A07] p-6 shadow-2xl space-y-6 text-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-900/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-red-500/30 bg-red-950/60 p-2.5 text-red-400">
              <LogOut className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Confirmation de déconnexion</h2>
              <p className="text-xs text-emerald-200/70">Êtes-vous sûr de vouloir vous déconnecter ?</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-emerald-900/40 bg-[#0A100C] p-2 text-emerald-300/60 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-red-900/30 bg-red-950/20 p-4 text-xs font-semibold text-red-200 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          <span>
            Vous allez quitter votre session sécurisée TerraMind AI. Vos données enregistrées restent en sécurité dans votre espace.
          </span>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="rounded-2xl border border-emerald-900/40 bg-[#0A100C] px-5 py-3 text-xs font-bold text-emerald-300 hover:text-white transition"
          >
            Annuler
          </button>

          <button
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-6 py-3 text-xs font-extrabold text-white shadow-lg shadow-red-600/30 hover:bg-red-500 transition"
          >
            <LogOut className="h-4 w-4" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </div>
    </div>
  );
}
