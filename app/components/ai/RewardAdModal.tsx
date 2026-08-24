"use client";

import { useState, useEffect, useRef } from "react";
import { Play, CheckCircle2, AlertCircle, X, Sparkles, Film, Loader2, ShieldCheck } from "lucide-react";
import { useGooglePublisherTag } from "@/hooks/useGooglePublisherTag";

interface RewardAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardClaimed: (updatedQuota: any) => void;
}

export default function RewardAdModal({
  isOpen,
  onClose,
  onRewardClaimed,
}: RewardAdModalProps) {
  const { isLoaded: isGptLoaded } = useGooglePublisherTag();
  const [loading, setLoading] = useState(false);
  const [adState, setAdState] = useState<"idle" | "initing" | "ready" | "playing" | "granted" | "closed" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [adSessionId, setAdSessionId] = useState<string | null>(null);
  const currentSlotRef = useRef<any>(null);
  const isGrantedRef = useRef<boolean>(false);

  // Re-initialiser l'état à l'ouverture de la modale
  useEffect(() => {
    if (isOpen) {
      setAdState("idle");
      setErrorMsg("");
      setAdSessionId(null);
      isGrantedRef.current = false;
    } else {
      cleanupAdSlot();
    }
  }, [isOpen]);

  const cleanupAdSlot = () => {
    if (typeof window !== "undefined" && window.googletag && currentSlotRef.current) {
      try {
        window.googletag.cmd.push(() => {
          if (currentSlotRef.current) {
            window.googletag.destroySlots([currentSlotRef.current]);
            currentSlotRef.current = null;
          }
        });
      } catch (e) {
        console.warn("Erreur nettoyage slot GPT:", e);
      }
    }
  };

  const handleStartWatch = async () => {
    if (!isGptLoaded || !window.googletag) {
      setErrorMsg("Chargement du SDK Google Publisher Tag en cours. Réessayez dans un instant.");
      return;
    }

    setErrorMsg("");
    setLoading(true);
    setAdState("initing");
    isGrantedRef.current = false;

    try {
      // 1. Démarrer la session sur le serveur TerraMind (vérification quota & limites)
      const res = await fetch("/api/ai/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "init" }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Impossible d'initialiser la session de publicité récompensée.");
        setAdState("error");
        setLoading(false);
        return;
      }

      const sessionId = data.adSessionId;
      const adUnitPath = data.adUnitPath || process.env.NEXT_PUBLIC_GAM_REWARDED_AD_UNIT_PATH || "/22639388115/rewarded_web_example";
      setAdSessionId(sessionId);

      // 2. Initialiser le slot OutOfPage Formatted Rewarded Ad avec Google Publisher Tag
      window.googletag.cmd.push(() => {
        try {
          // Nettoyer les slots précédents si nécessaire
          if (currentSlotRef.current) {
            window.googletag.destroySlots([currentSlotRef.current]);
            currentSlotRef.current = null;
          }

          const rewardedSlot = window.googletag.defineOutOfPageSlot(
            adUnitPath,
            window.googletag.enums.OutOfPageFormat.REWARDED
          );

          if (!rewardedSlot) {
            setErrorMsg("Les annonces récompensées Web ne sont pas supportées par ce navigateur.");
            setAdState("error");
            setLoading(false);
            return;
          }

          currentSlotRef.current = rewardedSlot;
          rewardedSlot.addService(window.googletag.pubads());

          // Écouteur d'événement 1: l'annonce est prête
          window.googletag.pubads().addEventListener("rewardedSlotReady", (evt: any) => {
            if (evt.slot === rewardedSlot) {
              setAdState("ready");
              setLoading(false);
              // Afficher l'interface de publicité récompensée Google
              evt.makeRewardedVisible();
              setAdState("playing");
            }
          });

          // Écouteur d'événement 2: la récompense a été validée et accordée par Google
          window.googletag.pubads().addEventListener("rewardedSlotGranted", (evt: any) => {
            if (evt.slot === rewardedSlot) {
              isGrantedRef.current = true;
              setAdState("granted");
              // Transmettre la validation au serveur TerraMind pour créditer +1 message
              claimRewardOnServer(sessionId, true);
            }
          });

          // Écouteur d'événement 3: la pub est fermée par l'utilisateur ou terminée
          window.googletag.pubads().addEventListener("rewardedSlotClosed", (evt: any) => {
            if (evt.slot === rewardedSlot) {
              if (!isGrantedRef.current) {
                setErrorMsg("L'annonce a été fermée avant l'obtention de la récompense (0 bonus).");
                setAdState("closed");
              }
              cleanupAdSlot();
            }
          });

          window.googletag.enableServices();
          window.googletag.display(rewardedSlot);
        } catch (gptErr) {
          console.error("Erreur initialisation GAM Rewarded Slot:", gptErr);
          setErrorMsg("Impossible de charger l'annonce Google Ad Manager.");
          setAdState("error");
          setLoading(false);
        }
      });
    } catch (err) {
      console.error("Erreur réseau initialisation pub:", err);
      setErrorMsg("Erreur de connexion lors de l'initialisation de l'annonce.");
      setAdState("error");
      setLoading(false);
    }
  };

  const claimRewardOnServer = async (sessionId: string, gptGranted: boolean) => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          adSessionId: sessionId,
          gptGranted,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Erreur de validation de la récompense sur le serveur.");
        setAdState("error");
      } else if (data.quota) {
        setAdState("granted");
        onRewardClaimed(data.quota);
      }
    } catch (err) {
      setErrorMsg("Erreur réseau lors de la validation serveur de votre récompense.");
      setAdState("error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    cleanupAdSlot();
    setAdState("idle");
    setErrorMsg("");
    setAdSessionId(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-[#181436] via-[#0D0924] to-[#050A07] p-6 shadow-2xl space-y-6 text-white overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-900/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/60 p-2.5 text-emerald-400 shadow-md">
              <Film className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Publicité Récompensée Google</h2>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-950/80 border border-emerald-500/30 px-1.5 py-0.5 text-[9px] font-extrabold text-emerald-400">
                  <ShieldCheck className="h-3 w-3" /> GPT Web
                </span>
              </div>
              <p className="text-xs text-emerald-200/70">
                Regardez l'annonce Google Ad Manager pour débloquer +1 message IA
              </p>
            </div>
          </div>

          {adState !== "playing" && (
            <button
              onClick={handleResetAndClose}
              className="rounded-xl border border-emerald-900/40 bg-[#0A100C] p-2 text-emerald-300/60 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Dynamic Ad Unit Container */}
        <div className="relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-emerald-900/40 bg-black/90 shadow-inner p-4">
          {loading || adState === "initing" ? (
            <div className="flex flex-col items-center gap-3 text-emerald-400">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-xs font-semibold">Connexion au réseau Google Ad Manager…</p>
            </div>
          ) : adState === "playing" ? (
            <div className="flex flex-col items-center gap-3 text-center p-4">
              <div className="h-12 w-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-400 animate-spin flex items-center justify-center">
                <Film className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Publicité en cours de visionnage</p>
                <p className="text-xs text-emerald-200/70 mt-1">
                  Ne fermez pas la fenêtre tant que l'annonce n'est pas terminée.
                </p>
              </div>
            </div>
          ) : adState === "granted" ? (
            <div className="flex flex-col items-center gap-3 text-center p-4">
              <CheckCircle2 className="h-12 w-12 text-emerald-400 animate-bounce" />
              <h3 className="text-base font-extrabold text-white">Publicité Validée avec Succès !</h3>
              <p className="text-xs text-emerald-200/90">
                Google a confirmé l'événement <code className="text-emerald-300 font-mono">rewardedSlotGranted</code>.
                Votre solde de messages IA a été crédité de +1 bonus.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-center p-4">
              <div className="rounded-full bg-emerald-600/20 border border-emerald-500/40 p-4 text-emerald-400 shadow-lg">
                <Play className="h-8 w-8 ml-0.5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Prêt à charger l'annonce Google</p>
                <p className="text-xs text-emerald-200/60 mt-1">
                  Annonce récompensée officielle via Google Publisher Tag (GPT).
                </p>
              </div>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="rounded-xl bg-red-950/60 border border-red-800/40 p-3 text-xs font-semibold text-red-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {adState !== "granted" && adState !== "playing" && (
            <>
              <button
                onClick={handleResetAndClose}
                disabled={loading}
                className="rounded-2xl border border-emerald-900/40 bg-[#0A100C] px-4 py-3 text-xs font-bold text-emerald-300 hover:text-white transition disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleStartWatch}
                disabled={loading || !isGptLoaded}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:opacity-95 transition disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-white" />}
                <span>Regarder la Publicité Google</span>
              </button>
            </>
          )}

          {adState === "granted" && (
            <button
              onClick={handleResetAndClose}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition"
            >
              <Sparkles className="h-4 w-4 text-emerald-200" />
              <span>Utiliser mon message offert (+1)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
