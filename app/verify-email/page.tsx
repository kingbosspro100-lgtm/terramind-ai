"use client";
import Logo from "@/app/components/ui/Logo";
import Link from "next/link";
import { MailCheck, ArrowRight } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-[#0B0914] text-white flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
      {/* Top Bar */}
      <div className="p-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo width={36} height={36} />
          <span className="text-xl font-bold tracking-tight text-white">
            TerraMind <span className="text-emerald-400">AI</span>
          </span>
        </Link>
      </div>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10 rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-8 shadow-2xl space-y-6 text-center">
          
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-950/50 flex items-center justify-center border border-emerald-500/30">
            <MailCheck className="h-8 w-8 text-emerald-400" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Vérifiez votre email
            </h1>
            <p className="text-sm text-emerald-200/80 font-medium">
              Nous vous avons envoyé un lien de confirmation. Veuillez vérifier votre boîte de réception pour activer votre compte.
            </p>
          </div>

          <div className="pt-4">
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-xs font-bold text-white shadow-xl shadow-emerald-600/30 hover:opacity-95 transition"
            >
              <span>Retour à la connexion</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-emerald-300/50">
        © 2026 TerraMind AI. Tous droits réservés.
      </footer>
    </div>
  );
}
