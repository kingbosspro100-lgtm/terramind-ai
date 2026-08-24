"use client";

import { useState, useRef } from "react";
import { Camera, Upload, AlertCircle, X, Sparkles, Loader2, ShieldAlert, CheckCircle2 } from "lucide-react";

interface DiseaseAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DiseaseAnalyzerModal({ isOpen, onClose }: DiseaseAnalyzerModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("La taille de l'image ne doit pas dépasser 10 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setErrorMsg("");
      setDiagnosis(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setErrorMsg("Veuillez d'abord prendre ou sélectionner une photo de la culture affectée.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setDiagnosis(null);

    const promptText = `
Veuillez réaliser une analyse phytosanitaire et un diagnostic agronomique complet de cette photo de culture/feuille.

Structure la réponse avec ces rubriques claires :

1. 🦠 MALADIE PROBABLE (ou ravageur/carence identifié) :
2. 🔍 SYMPTÔMES OBSERVÉS :
3. ⚠️ NIVEAU D'URGENCE (Faible / Modéré / Élevé / Critique) :
4. 🧬 CAUSES POSSIBLES (champignon, bactérie, virus, parasite, sol) :
5. 🛠️ RECOMMANDATIONS DE TRAITEMENT IMMÉDIAT :
6. 🛡️ MESURES DE PRÉVENTION :
`;

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: promptText,
          images: [selectedImage],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Erreur lors de l'analyse IA de la maladie.");
      } else {
        setDiagnosis(data.message);
      }
    } catch (err) {
      console.error("Erreur analyse maladie:", err);
      setErrorMsg("Erreur de connexion avec le service IA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-[#181436] via-[#0D0924] to-[#050A07] p-6 shadow-2xl space-y-6 text-white max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-900/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/60 p-2.5 text-emerald-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Analyse des Maladies & Diagnostic IA</h2>
              <p className="text-xs text-emerald-200/70">
                Prenez ou sélectionnez une photo d'une plante pour identifier la maladie et obtenir le traitement.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-emerald-900/40 bg-[#0A100C] p-2 text-emerald-300/60 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Inputs cachés */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleImageSelect}
        />

        {/* Section Sélection / Prise de Photo */}
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="flex items-center justify-center gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-xs font-bold text-emerald-300 hover:bg-emerald-900/60 hover:text-white transition shadow-md"
          >
            <Camera className="h-5 w-5 text-emerald-400" />
            <span>Prendre une photo (Appareil photo)</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-3 rounded-2xl border border-emerald-500/40 bg-[#0A100C] p-4 text-xs font-bold text-emerald-300 hover:bg-[#1C183B] hover:text-white transition shadow-md"
          >
            <Upload className="h-5 w-5 text-emerald-400" />
            <span>Sélectionner une image (Galerie)</span>
          </button>
        </div>

        {/* Aperçu de la photo sélectionnée */}
        {selectedImage && (
          <div className="relative rounded-2xl border border-emerald-500/40 bg-black/80 p-3 flex flex-col items-center justify-center">
            <img
              src={selectedImage}
              alt="Photo culture à analyser"
              className="max-h-64 rounded-xl object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 rounded-full bg-red-950/80 p-1.5 text-red-400 hover:text-white transition border border-red-500/40"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Bouton d'analyse IA */}
        {selectedImage && !diagnosis && (
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-xs font-extrabold text-white shadow-lg shadow-emerald-600/30 hover:opacity-95 transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            <span>{loading ? "Diagnostic IA en cours d'analyse..." : "Lancer le Diagnostic Phytosanitaire IA"}</span>
          </button>
        )}

        {errorMsg && (
          <div className="rounded-xl bg-red-950/60 border border-red-800/40 p-3 text-xs font-semibold text-red-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Résultat du Diagnostic IA */}
        {diagnosis && (
          <div className="rounded-2xl border border-emerald-500/40 bg-[#0B0914] p-5 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-emerald-400 font-bold border-b border-emerald-900/40 pb-3">
              <CheckCircle2 className="h-5 w-5" />
              <span>Rapport de Diagnostic Phytosanitaire TerraMind IA</span>
            </div>
            <div className="text-xs leading-relaxed whitespace-pre-line text-emerald-100 font-medium">
              {diagnosis}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
