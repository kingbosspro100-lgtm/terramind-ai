"use client";

import { useEffect, useState } from "react";
import { X, Sparkles, CheckCircle2 } from "lucide-react";

interface TerraDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  ctaText?: string;
  onConfirm?: () => void;
  icon?: React.ReactNode;
}

export default function TerraDialog({
  isOpen,
  onClose,
  title = "Message de TerraMind AI",
  message = "Votre action a été prise en compte avec succès.",
  ctaText = "Compris",
  onConfirm,
  icon,
}: TerraDialogProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Empêcher le scroll du body quand la modale est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isMounted || !isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay Backdrop Blur */}
      <div 
        className="absolute inset-0 bg-[#0B0914]/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Dialog Box Premium Obsidian */}
      <div className="relative w-full max-w-md scale-100 transform overflow-hidden rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/40 p-6 text-left shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-300">
        
        {/* Effet lumineux (Glow) */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-emerald-300/50 hover:bg-[#1C183B] hover:text-white transition"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center mt-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600/20 to-emerald-600/20 border border-emerald-500/30 text-emerald-400 mb-6 shadow-inner">
            {icon || <Sparkles size={32} />}
          </div>
          
          <h3 className="text-xl font-bold text-white tracking-tight mb-2">
            {title}
          </h3>
          
          <p className="text-sm font-medium text-emerald-200/80 leading-relaxed mb-8">
            {message}
          </p>

          <button
            onClick={handleConfirm}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.02] hover:shadow-emerald-600/40 active:scale-[0.98]"
          >
            {ctaText} <CheckCircle2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
