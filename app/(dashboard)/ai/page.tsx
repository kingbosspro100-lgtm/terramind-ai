import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import AIChat from "@/app/components/AIChat";
import {
  Sparkles,
  Bot,
  MessageSquareText,
  CloudSun,
  Sprout,
  Activity,
  LineChart,
  History,
  SendHorizontal,
  Lightbulb,
} from "lucide-react";

import { getCurrentUser } from "@/lib/auth-helper";

export default async function AIPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <AIChat />;

  return (
    <main className="space-y-6 max-w-7xl mx-auto pb-12 text-white h-[calc(100vh-80px)] flex flex-col">

      {/* Header */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-emerald-900/30 pb-6 shrink-0">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3 py-1 text-[11px] font-semibold text-emerald-300 mb-3">
            <Sparkles className="h-3 w-3 text-emerald-400" />
            <span>Assistant Intelligence Artificielle</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            TerraMind Copilot
          </h1>
          <p className="mt-1 text-sm text-emerald-200/70 font-medium max-w-2xl">
            Votre expert agronome et conseiller financier personnel, propulsé par l'IA.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">

        {/* Sidebar / Suggestions */}
        <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 overflow-y-auto pr-2 scrollbar-hide">
          
          <div className="rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/10 rounded-full blur-2xl group-hover:bg-emerald-600/20 transition-all duration-500"></div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <Lightbulb className="h-4 w-4 text-amber-400" /> Suggestions Rapides
            </h3>
            <div className="space-y-3">
              {[
                { icon: CloudSun, text: "Analyser météo des 7 prochains jours", color: "text-blue-400", bg: "bg-blue-900/20", border: "border-blue-800/30" },
                { icon: Sprout, text: "Diagnostic maladies des cultures", color: "text-emerald-400", bg: "bg-emerald-900/20", border: "border-emerald-800/30" },
                { icon: LineChart, text: "Prévisions financières du trimestre", color: "text-emerald-400", bg: "bg-emerald-900/20", border: "border-emerald-800/30" },
                { icon: Activity, text: "Optimisation de l'inventaire", color: "text-red-400", bg: "bg-red-900/20", border: "border-red-800/30" },
              ].map((item, i) => (
                <button key={i} className="w-full text-left flex items-start gap-3 p-3 rounded-2xl bg-[#0B0914]/50 border border-emerald-900/20 hover:border-emerald-500/30 hover:bg-[#0A100C] transition cursor-pointer">
                  <div className={`p-1.5 rounded-lg ${item.bg} border ${item.border} ${item.color} shrink-0`}>
                    <item.icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[11px] text-emerald-200 font-medium leading-tight pt-0.5">{item.text}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-[#0A100C] border border-emerald-900/30 p-6 shadow-xl flex-1 flex flex-col">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <History className="h-4 w-4 text-emerald-400" /> Historique
            </h3>
            <div className="flex-1 flex items-center justify-center border border-dashed border-emerald-900/50 rounded-2xl p-4">
              <p className="text-xs text-emerald-300/50 text-center font-medium">Aucune conversation précédente.</p>
            </div>
          </div>

        </div>

        {/* Main Chat Area */}
        <div className="flex-1 rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 shadow-2xl flex flex-col relative overflow-hidden">
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* AI Welcome Message */}
            <div className="flex gap-4">
              <div className="h-10 w-10 shrink-0 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center border border-emerald-500/50 shadow-lg shadow-emerald-600/20">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="bg-[#1C183B] border border-emerald-900/40 rounded-2xl rounded-tl-none p-4 shadow-sm max-w-[85%]">
                <p className="text-sm text-emerald-100 leading-relaxed font-medium">
                  Bonjour ! Je suis TerraMind Copilot. <br/><br/>
                  Je peux analyser vos données d'exploitation, diagnostiquer des maladies à partir de descriptions, vous donner des conseils agronomiques précis ou prévoir vos résultats financiers. <br/><br/>
                  Comment puis-je vous aider aujourd'hui ?
                </p>
              </div>
            </div>

          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-emerald-900/30 bg-[#0B0914]/80 backdrop-blur-md">
            <div className="relative flex items-center">
              <MessageSquareText className="absolute left-4 h-5 w-5 text-emerald-400/50" />
              <input
                type="text"
                placeholder="Posez une question sur vos cultures, votre météo ou vos finances..."
                className="w-full rounded-2xl bg-[#0A100C] border border-emerald-900/50 py-4 pl-12 pr-14 text-sm text-white placeholder-emerald-300/40 outline-none focus:border-emerald-500/60 shadow-inner"
              />
              <button className="absolute right-2 p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20 hover:scale-105 transition">
                <SendHorizontal className="h-4 w-4" />
              </button>
            </div>
            <p className="text-center text-[10px] text-emerald-300/40 mt-3 font-medium">
              TerraMind Copilot peut faire des erreurs. Considérez vérifier les informations importantes.
            </p>
          </div>

        </div>

      </div>

    </main>
  );
}
