"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Logo from "@/app/components/ui/Logo";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const plan = searchParams.get("plan") === "enterprise" ? "enterprise" : "pro";
  const amount = plan === "enterprise" ? "25 000" : "2 500";
  const refFromUrl = searchParams.get("reference") || searchParams.get("tx_ref") || `TX_FEDA_${plan.toUpperCase()}_${Date.now()}`;
  const txIdFromUrl = searchParams.get("tx_id") || searchParams.get("id") || "";

  const [statusState, setStatusState] = useState<"idle" | "verifying" | "approved" | "pending" | "failed">("idle");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Initialisation automatique du paiement si pas encore de référence
  useEffect(() => {
    async function initPayment() {
      if (refFromUrl || txIdFromUrl) return;

      setLoading(true);
      try {
        const res = await fetch("/api/payments/fedapay", {
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
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else if (data.reference) {
          router.replace(`/checkout?plan=${plan}&reference=${data.reference}`);
        }
      } catch (err) {
        setErrorMsg("Erreur lors de l'initialisation du paiement FedaPay.");
      } finally {
        setLoading(false);
      }
    }

    initPayment();
  }, [plan, refFromUrl, txIdFromUrl, router]);

  // Vérification automatique au retour du guichet FedaPay
  useEffect(() => {
    async function verifyFedaPayReturn() {
      if (!refFromUrl && !txIdFromUrl) return;

      setStatusState("verifying");
      setLoading(true);

      try {
        const res = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reference: refFromUrl,
            transactionId: txIdFromUrl,
            plan,
          }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setStatusState("approved");
          setSuccessMsg(`Paiement FedaPay confirmé avec succès ! Abonnement TerraMind ${plan.toUpperCase()} activé.`);
          setTimeout(() => {
            router.push("/dashboard");
            router.refresh();
          }, 2000);
        } else {
          if (data.status === "pending") {
            setStatusState("pending");
            setErrorMsg("Paiement FedaPay en attente de validation. Nous activons votre abonnement dès confirmation.");
          } else {
            setStatusState("failed");
            setErrorMsg(data.message || "Le paiement FedaPay a échoué ou a été annulé.");
          }
        }
      } catch (err) {
        setStatusState("failed");
        setErrorMsg("Erreur de communication avec le serveur pour la vérification du paiement.");
      } finally {
        setLoading(false);
      }
    }

    verifyFedaPayReturn();
  }, [refFromUrl, txIdFromUrl, plan, router]);

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
          reference: refFromUrl,
          transactionId: txIdFromUrl,
          plan,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Paiement en cours ou non confirmé par FedaPay.");
      } else {
        setStatusState("approved");
        setSuccessMsg(`Paiement FedaPay validé ! Votre formule ${plan.toUpperCase()} est active.`);
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1500);
      }
    } catch (err) {
      setErrorMsg("Erreur réseau lors de la validation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl rounded-3xl border border-emerald-900/30 bg-gradient-to-b from-[#181436] to-[#050A07] p-8 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3.5 py-1 text-xs font-semibold text-emerald-300">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Guichet de Paiement Sécurisé FedaPay</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Abonnement {plan.toUpperCase()}
        </h1>
        <p className="text-xs text-emerald-200/80 font-medium">
          Réf: <span className="font-mono text-emerald-400">{refFromUrl}</span>
        </p>
      </div>

      {/* Summary Box */}
      <div className="rounded-2xl bg-[#0A100C] border border-emerald-900/40 p-5 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-300 font-semibold">Formule choisie :</span>
          <span className="font-bold text-white uppercase">{plan}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-300 font-semibold">Prestataire :</span>
          <span className="font-bold text-emerald-400 flex items-center gap-1">
            FedaPay Mobile Money / Carte
          </span>
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

      {/* Verification State Box */}
      {statusState === "verifying" ? (
        <div className="rounded-2xl bg-[#0A100C] border border-emerald-500/30 p-8 text-center space-y-3">
          <Loader2 className="h-8 w-8 text-emerald-400 animate-spin mx-auto" />
          <p className="text-sm font-bold text-white">Vérification du paiement FedaPay en cours…</p>
          <p className="text-xs text-emerald-200/60">Interrogation des serveurs FedaPay pour confirmation.</p>
        </div>
      ) : statusState === "approved" ? (
        <div className="rounded-2xl bg-emerald-950/40 border border-emerald-500/40 p-6 text-center space-y-3">
          <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto animate-bounce" />
          <p className="text-base font-extrabold text-white">Paiement Réussi !</p>
          <p className="text-xs text-emerald-200/80">Redirection vers votre tableau de bord…</p>
        </div>
      ) : (
        <form onSubmit={handleManualVerify} className="space-y-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-4 text-xs font-bold text-white shadow-xl shadow-emerald-600/30 hover:opacity-95 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Vérification auprès de FedaPay…</span>
              </>
            ) : (
              <>
                <span>Vérifier la confirmation du paiement</span>
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
        <Suspense fallback={<div className="text-emerald-400 font-bold">Chargement FedaPay...</div>}>
          <CheckoutContent />
        </Suspense>
      </main>

      <footer className="p-6 text-center text-xs text-emerald-300/50">
        © 2026 TerraMind AI. Tous droits réservés.
      </footer>
    </div>
  );
}
