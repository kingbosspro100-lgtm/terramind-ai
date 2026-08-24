"use client";

import { useEffect, useRef, useState } from "react";
import { QrCode, Camera, Image, X, ArrowRightLeft } from "lucide-react";
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import TerraDialog from "@/app/components/ui/TerraDialog";

export default function StockTools() {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    setErrorMsg("");
    setScanResult(null);
    try {
      const codeReader = new BrowserMultiFormatReader();
      codeReaderRef.current = codeReader;
      const previewElem = videoRef.current!;
      const hints = undefined;
      const constraints = { video: { facingMode: "environment" } };
      await codeReader.decodeFromVideoDevice(null, previewElem, (result, err) => {
        if (result) {
          handleFound(result.getText());
        }
        if (err && !(err instanceof NotFoundException)) {
          console.error(err);
        }
      });
      setScanning(true);
    } catch (err: any) {
      console.error("Scanner init error:", err);
      setErrorMsg("Impossible d'accéder à la caméra. Utilisez l'option galerie/fichier.");
    }
  };

  const stopScanner = () => {
    try {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
        codeReaderRef.current = null;
      }
    } catch (e) {
      // ignore
    }
    setScanning(false);
  };

  const handleFound = (text: string) => {
    setScanResult(text);
    setDialogOpen(true);
    // dispatch event so forms can listen
    window.dispatchEvent(new CustomEvent('qr-scanned', { detail: text }));
    stopScanner();
  };

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setErrorMsg("");
    try {
      const codeReader = new BrowserMultiFormatReader();
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.drawImage(bitmap, 0, 0);
      const dataUrl = canvas.toDataURL();
      const result = await codeReader.decodeFromImage(undefined, dataUrl);
      if (result) handleFound(result.getText());
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Aucun code lisible trouvé dans l'image.");
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button onClick={() => { /* Entrées/Sorties future */ window.dispatchEvent(new CustomEvent('stock-action',{detail:'toggle-entries'})); }} className="inline-flex items-center gap-2 rounded-2xl bg-[#0A100C] border border-emerald-900/40 px-4 py-2.5 text-xs font-bold text-emerald-300 hover:bg-[#1C183B] hover:text-white transition shadow-sm">
        <ArrowRightLeft className="h-4 w-4 text-emerald-400" />
        <span>Entrées/Sorties</span>
      </button>

      <button onClick={() => { if (!scanning) startScanner(); else stopScanner(); }} className="inline-flex items-center gap-2 rounded-2xl bg-[#0A100C] border border-emerald-900/40 px-4 py-2.5 text-xs font-bold text-emerald-300 hover:bg-[#1C183B] hover:text-white transition shadow-sm">
        <QrCode className="h-4 w-4 text-emerald-400" />
        <span>{scanning ? 'Arrêter le scan' : 'Scanner QR/Code-barres'}</span>
      </button>

      <label className="inline-flex items-center gap-2 rounded-2xl bg-[#0A100C] border border-emerald-900/40 px-4 py-2.5 text-xs font-bold text-emerald-300 hover:bg-[#1C183B] hover:text-white transition shadow-sm cursor-pointer">
        <Image className="h-4 w-4 text-emerald-400" />
        <span>Galerie / Fichier</span>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0] || null)} />
      </label>

      {scanning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={stopScanner} />
          <div className="relative w-full max-w-md rounded-2xl bg-[#0B0914] p-4 border border-emerald-900/30">
            <button onClick={stopScanner} className="absolute right-3 top-3 p-2"><X size={18} /></button>
            <video ref={videoRef} className="w-full h-80 bg-black rounded-md" autoPlay muted playsInline />
            <p className="text-sm text-emerald-300 mt-2">Visez le QR / code-barres avec la caméra. Touche "Arrêter" pour fermer.</p>
            {errorMsg && <p className="text-sm text-red-400 mt-2">{errorMsg}</p>}
          </div>
        </div>
      )}

      <TerraDialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)} title={scanResult ? "QR détecté" : ""} message={scanResult || ""} ctaText="OK" />
    </div>
  );
}
