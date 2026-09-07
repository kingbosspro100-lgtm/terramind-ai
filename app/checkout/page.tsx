"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import Logo from "@/app/components/ui/Logo";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const plan = searchParams.get("plan") === "enterprise" ? "enterprise" : "pro";
  const amount = plan === "enterprise" ? "25 000" : "2 500";
  const refFromUrl = searchParams.get("reference") || searchParams.get("tx_ref") || "";
  const txIdFromUrl = searchParams.get("tx_id") || searchParams.get("id") || "";

  const [statusState, setStatusState] = useState<"idle" | "verifying" | "approved" | "pending" | "failed" | "config_required">("idle");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [currentRef, setCurrentRef] = useState(refFromUrl);

  // Initialisation automatique du paiement SASPAY si pas encore de référence
  useEffect(() => {
    async function initPayment() {
      if (currentRef || txIdFromUrl) return;

      setLoading(true);
      setErrorMsg("");

      try {
        const res = await fetch("/api/payments/saspay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan }),
        });

        if (res.status === 401) {
          const checkoutUrl = `/checkout?plan=${plan}`;
          router.push(`/login?plan=${plan}&callbackUrl=${encodeURIComponent(checkoutUrl)}`);
          return;
        }

        const data = await res.json();

        if (res.status === 503 || data.error === "SASPAY_CONFIG_REQUIRED") {
          setStatusState("config_required");
          setErrorMsg(data.message || "Le module SASPAY nécessite la configuration des clés d'API dans .env.local.");
          if (data.reference) setCurrentRef(data.reference);
          return;
        }

        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else if (data.reference) {
          setCurrentRef(data.reference);
          router.replace(`/checkout?plan=${plan}&reference=${data.reference}`);
        } else {
          setErrorMsg(data.message || "Impossible d'initialiser le paiement SASPAY.");
        }
      } catch (err) {
        setErrorMsg("Erreur de connexion lors de l'initialisation du paiement SASPAY.");
      } finally {
        setLoading(false);
      }
    }

    initPayment();
  }, [plan, currentRef, txIdFromUrl, router]);

  // Vérification automatique auprès de l'API SASPAY au retour
  useEffect(() => {
    async function verifySasPayReturn() {
      if (!currentRef && !txIdFromUrl) return;
      if (statusState === "config_required") return;

      setStatusState("verifying");
      setLoading(true);

      try {
        const res = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reference: currentRef,
            transactionId: txIdFromUrl,
            plan,
          }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setStatusState("approved");
          setSuccessMsg(`Paiement SASPAY confirmé ! Abonnement TerraMind ${plan.toUpperCase()} activé pour 1 mois.`);
          setTimeout(() => {
            router.push("/dashboard");
            router.refresh();
          }, 2000);
        } else {
          if (data.error === "SASPAY_CONFIG_REQUIRED") {
            setStatusState("config_required");
            setErrorMsg(data.message);
          } else {
            setStatusState("pending");
            setErrorMsg(data.message || "Le paiement SASPAY n'a pas encore été confirmé par les serveurs.");
          }
        }
      } catch (err) {
        setStatusState("failed");
        setErrorMsg("Erreur réseau lors de la vérification du paiement avec les serveurs SASPAY.");
      } finally {
        setLoading(false);
      }
    }

    if (currentRef || txIdFromUrl) {
      verifySasPayReturn();
    }
  }, [currentRef, txIdFromUrl, plan, router, statusState]);

  const handleManualVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: currentRef,
          transactionId: txIdFromUrl,
          plan,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.error === "SASPAY_CONFIG_REQUIRED") {
          setStatusState("config_required");
        } else {
          setStatusState("pending");
        }
        setErrorMsg(data.message || "Paiement non encore confirmé par SASPAY.");
      } else {
        setStatusState("approved");
        setSuccessMsg(`Paiement validé ! Votre formule ${plan.toUpperCase()} est active pour 1 mois.`);
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1500);
      }
    } catch (err) {
      setErrorMsg("Erreur de connexion lors de la vérification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl rounded-3xl border border-emerald-900/30 bg-gradient-to-b from-[#181436] to-[#050A07] p-8 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3.5 py-1 text-xs font-semibold text-emerald-300">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Guichet de Paiement Sécurisé SASPAY</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Abonnement {plan.toUpperCase()}
        </h1>
        {currentRef && (
          <p className="text-xs text-emerald-200/80 font-medium">
            Réf: <span className="font-mono text-emerald-400">{currentRef}</span>
          </p>
        )}
      </div>

      {/* Résumé de la commande */}
      <div className="rounded-2xl bg-[#0A100C] border border-emerald-900/40 p-5 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-300 font-semibold">Formule choisie :</span>
          <span className="font-bold text-white uppercase">{plan}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-300 font-semibold">Moyen de paiement :</span>
          <span className="font-bold text-emerald-400 flex items-center gap-1">
            SASPAY (Mobile Money / Carte)
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-300 font-semibold">Durée de l'abonnement :</span>
          <span className="font-bold text-emerald-300">1 mois exact (depuis confirmation)</span>
        </div>
        <div className="pt-3 border-t border-emerald-900/30 flex items-center justify-between">
          <span className="text-base font-extrabold text-white">Montant :</span>
          <span className="text-2xl font-black text-emerald-400">{amount} FCFA</span>
        </div>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="rounded-2xl bg-red-950/60 border border-red-800/40 p-4 text-xs font-semibold text-red-300 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="rounded-2xl bg-emerald-950/60 border border-emerald-800/40 p-4 text-xs font-semibold text-emerald-300 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Info de configuration manuelle SASPAY */}
      {statusState === "config_required" && (
        <div className="rounded-2xl bg-amber-950/50 border border-amber-500/40 p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
            <HelpCircle className="h-4 w-4 text-amber-400 shrink-0" />
            <span>Configuration manuelle SASPAY requise</span>
          </div>
          <p className="text-xs text-amber-200/80 leading-relaxed font-medium">
            Pour finaliser les paiements en direct via SASPAY, veuillez ajouter vos clés de production ou de sandbox dans le fichier <code className="bg-amber-950 px-1.5 py-0.5 rounded text-amber-300">.env.local</code> du serveur :
          </p>
          <pre className="text-[11px] bg-[#0A100C] p-3 rounded-xl border border-amber-900/40 font-mono text-amber-200 overflow-x-auto">
            SASPAY_SECRET_KEY=votre_cle_secrete_saspay
          </pre>
        </div>
      )}

      {/* État de vérification */}
      {statusState === "verifying" ? (
        <div className="rounded-2xl bg-[#0A100C] border border-emerald-500/30 p-8 text-center space-y-3">
          <Loader2 className="h-8 w-8 text-emerald-400 animate-spin mx-auto" />
          <p className="text-sm font-bold text-white">Vérification du paiement auprès de SASPAY...</p>
          <p className="text-xs text-emerald-200/60">Interrogation sécurisée des serveurs SASPAY pour confirmation.</p>
        </div>
      ) : statusState === "approved" ? (
        <div className="rounded-2xl bg-emerald-950/40 border border-emerald-500/40 p-6 text-center space-y-3">
          <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto animate-bounce" />
          <p className="text-base font-extrabold text-white">Paiement Confirmé !</p>
          <p className="text-xs text-emerald-200/80">Redirection vers votre tableau de bord...</p>
        </div>
      ) : (
        <form onSubmit={handleManualVerify} className="space-y-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-4 text-xs font-bold text-white shadow-xl shadow-emerald-600/30 hover:opacity-95 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Vérification auprès de SASPAY...</span>
              </>
            ) : (
              <>
                <span>Vérifier la confirmation du paiement SASPAY</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#0B0914] text-white flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
      <div className="p-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo width={36} height={36} />
          <span className="text-xl font-bold tracking-tight text-white">
            TerraMind <span className="text-emerald-400">AI</span>
          </span>
        </Link>
        <Link href="/pricing" className="text-xs font-bold text-emerald-300 hover:text-white transition">
          ← Retour aux tarifs
        </Link>
      </div>

      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
        <Suspense fallback={<div className="text-emerald-400 font-bold">Chargement SASPAY...</div>}>
          <CheckoutContent />
        </Suspense>
      </main>

      <footer className="p-6 text-center text-xs text-emerald-300/50">
        © 2026 TerraMind AI. Tous droits réservés.
      </footer>
    </div>
  );
}
