"use client";

import { FormEvent, useState, useEffect, useRef } from "react";
import {
  Bot,
  SendHorizontal,
  User,
  Sparkles,
  Film,
  AlertTriangle,
  Lock,
  Building,
  Paperclip,
  Mic,
  MicOff,
  Plus,
  Trash2,
  MessageSquare,
  X,
  FileText,
  History,
  Lightbulb,
  CloudSun,
  Sprout,
  LineChart,
} from "lucide-react";
import Link from "next/link";
import RewardAdModal from "@/app/components/ai/RewardAdModal";
import { useLanguage } from "@/lib/language-context";

type Message = {
  role: "assistant" | "user";
  content: string;
  image?: string;
  fileName?: string;
};

type ChatSession = {
  id: string;
  title: string;
  createdAt: string;
  messages: Message[];
};

export default function AIChat() {
  const { t } = useLanguage();
  const welcomeMsg =
    t.navAI === "AI Assistant"
      ? "Hello! I am TerraMind Copilot. Ask your agronomic questions, upload photos/documents for analysis, or use voice dictation."
      : "Bonjour ! Je suis TerraMind Copilot. Posez vos questions agronomiques ou professionnelles, envoyez des photos pour analyse, ou utilisez la dictée vocale.";

  // Chat sessions state
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [quota, setQuota] = useState<any>(null);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Attachment state (Image/File)
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    type: string;
    dataUrl: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Voice recording / Speech recognition state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = true;
        rec.lang = "fr-FR";

        rec.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setInput(transcript);
          }
        };

        rec.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  // Load chat sessions from localStorage & fetch server quota
  useEffect(() => {
    fetchQuota();

    const saved = localStorage.getItem("terramind_ai_chats");
    if (saved) {
      try {
        const parsed: ChatSession[] = JSON.parse(saved);
        if (parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
          return;
        }
      } catch (e) {
        console.error("Error loading chat sessions:", e);
      }
    }

    // Default first session
    const initialSession: ChatSession = {
      id: "session_" + Date.now(),
      title: "Nouvelle conversation",
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      messages: [{ role: "assistant", content: welcomeMsg }],
    };
    setSessions([initialSession]);
    setActiveSessionId(initialSession.id);
  }, []);

  // Save sessions to localStorage
  const saveSessions = (updated: ChatSession[]) => {
    setSessions(updated);
    localStorage.setItem("terramind_ai_chats", JSON.stringify(updated));
  };

  const currentSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const messages = currentSession ? currentSession.messages : [];

  const fetchQuota = async () => {
    try {
      const res = await fetch("/api/ai/chat");
      if (res.ok) {
        const data = await res.json();
        if (data.quota) setQuota(data.quota);
      }
    } catch (e) {
      console.error("Error fetching AI quota:", e);
    }
  };

  // Toggle voice recognition
  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) {
      alert("La reconnaissance vocale n'est pas supportée sur ce navigateur. Veuillez utiliser Chrome, Edge ou Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Error starting speech recognition:", e);
      }
    }
  };

  // Handle file/image pick
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("Fichier trop volumineux (max 10 Mo).");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedFile({
        name: file.name,
        type: file.type,
        dataUrl: reader.result as string,
      });
      setErrorMsg("");
    };
    reader.readAsDataURL(file);
  };

  // Create new conversation
  const createNewChat = () => {
    const newChat: ChatSession = {
      id: "session_" + Date.now(),
      title: `Conversation ${sessions.length + 1}`,
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      messages: [{ role: "assistant", content: welcomeMsg }],
    };
    const updated = [newChat, ...sessions];
    saveSessions(updated);
    setActiveSessionId(newChat.id);
  };

  // Delete conversation
  const deleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      const resetChat: ChatSession = {
        id: "session_" + Date.now(),
        title: "Nouvelle conversation",
        createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        messages: [{ role: "assistant", content: welcomeMsg }],
      };
      saveSessions([resetChat]);
      setActiveSessionId(resetChat.id);
      return;
    }

    const updated = sessions.filter((s) => s.id !== id);
    saveSessions(updated);
    if (activeSessionId === id) {
      setActiveSessionId(updated[0].id);
    }
  };

  // Send message
  async function send(event: FormEvent) {
    event.preventDefault();
    const content = input.trim();
    if ((!content && !selectedFile) || pending) return;

    if (quota && !quota.canSendMessage) {
      setErrorMsg("Quota mensuel atteint. Débloquez des messages bonus ou changez de formule.");
      return;
    }

    setErrorMsg("");

    const userMessage: Message = {
      role: "user",
      content: content || (selectedFile ? `[Fichier joint : ${selectedFile.name}]` : ""),
      image: selectedFile?.type.startsWith("image/") ? selectedFile.dataUrl : undefined,
      fileName: selectedFile ? selectedFile.name : undefined,
    };

    // Update active chat title if default
    let updatedSessions = [...sessions];
    const targetIdx = updatedSessions.findIndex((s) => s.id === activeSessionId);
    let sessionHistory: Message[] = [];

    if (targetIdx !== -1) {
      const s = updatedSessions[targetIdx];
      if (s.title.startsWith("Nouvelle conversation") || s.title.startsWith("Conversation")) {
        s.title = content.slice(0, 25) || selectedFile?.name || "Analyse image";
      }
      s.messages = [...s.messages, userMessage];
      sessionHistory = s.messages;
    }
    saveSessions(updatedSessions);

    const filePayload = selectedFile;
    setInput("");
    setSelectedFile(null);
    setPending(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content || "Merci d'analyser le fichier joint.",
          file: filePayload?.dataUrl,
          fileName: filePayload?.name,
          images: filePayload?.type.startsWith("image/") ? [filePayload.dataUrl] : undefined,
          history: sessionHistory,
        }),
      });
      const data = await response.json();

      let wasBonusUsed = false;
      if (data.quota) {
        if (quota && quota.rewardedMessages > data.quota.rewardedMessages) {
          wasBonusUsed = true;
        }
        setQuota(data.quota);
      }

      let assistantContent = "";

      if (response.status === 401) {
        setErrorMsg("Authentification requise pour utiliser l'Assistant IA.");
        assistantContent = "⚠️ Vous devez vous connecter pour utiliser l'Assistant IA TerraMind.";
      } else if (data.error === "TOO_MANY_IMAGES") {
        setErrorMsg(data.message);
        assistantContent = `⚠️ ${data.message}`;
      } else if (response.status === 429 || data.error === "QUOTA_EXCEEDED") {
        setErrorMsg(data.message || "Votre quota mensuel de messages IA est épuisé.");
        assistantContent = `⚠️ ${data.message || "Quota mensuel atteint."} Passez à la formule PRO ou Entreprise pour continuer.`;
      } else if (!response.ok) {
        assistantContent = `⚠️ ${data.message || "Le service IA est momentanément indisponible. Réessayez dans un instant."}`;
      } else {
        const bonusNotice = wasBonusUsed ? "\n\n🎁 *(1 message bonus utilisé pour cette réponse)*" : "";
        assistantContent = (data.message || "Je n'ai pas pu générer de réponse pour le moment.") + bonusNotice;
      }

      const assistantMsg: Message = { role: "assistant", content: assistantContent };
      const nextSessions = sessions.map((s) => {
        if (s.id === activeSessionId) {
          return { ...s, messages: [...s.messages, assistantMsg] };
        }
        return s;
      });
      saveSessions(nextSessions);
    } catch (err) {
      const errMsg: Message = {
        role: "assistant",
        content: "Le service IA est momentanément indisponible. Réessayez dans un instant.",
      };
      const nextSessions = sessions.map((s) => {
        if (s.id === activeSessionId) {
          return { ...s, messages: [...s.messages, errMsg] };
        }
        return s;
      });
      saveSessions(nextSessions);
    } finally {
      setPending(false);
    }
  }

  const handleRewardClaimed = (updatedQuota: any) => {
    setQuota(updatedQuota);
    setErrorMsg("");
    const bonusMsg: Message = {
      role: "assistant",
      content:
        "🎉 Félicitations ! Votre publicité récompensée a débloqué +1 message bonus supplémentaire. Vous pouvez poser votre question ci-dessous.",
    };
    const nextSessions = sessions.map((s) => {
      if (s.id === activeSessionId) {
        return { ...s, messages: [...s.messages, bonusMsg] };
      }
      return s;
    });
    saveSessions(nextSessions);
  };

  const isExhausted = quota && !quota.canSendMessage;
  const isWarning = quota && quota.totalMessagesAvailable === 1;

  const adsWatched = quota ? (quota.adsWatched ?? quota.rewardedClaimed ?? 0) : 0;
  const maxWeeklyAds = quota ? (quota.maxWeeklyRewards ?? quota.maxMonthlyRewards ?? 1) : 1;

  return (
    <main className="mx-auto flex h-[calc(100vh-100px)] max-w-7xl flex-col gap-4 pb-4 text-white">
      {/* Header with Dynamic Quota Counter */}
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-emerald-900/30 pb-4 shrink-0">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3 py-0.5 text-[11px] font-semibold text-emerald-300 mb-1">
            <Sparkles className="h-3 w-3 text-emerald-400" />
            <span>ASSISTANT INTELLIGENCE ARTIFICIELLE</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">TerraMind Copilot</h1>
          <p className="text-xs text-emerald-200/70">
            Analyse d'images/documents, conseils agronomiques certifiés et dictée vocale.
          </p>
        </div>

        {/* Quota Counter Badge */}
        {quota && (
          <div className="flex flex-col items-start md:items-end gap-1.5 rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-[#181436] to-[#0A100C] p-3 shadow-lg min-w-[240px]">
            <div className="flex items-center justify-between w-full text-xs font-semibold">
              <span className="text-emerald-300/80 uppercase font-bold">Plan {quota.plan} :</span>
              <span className={`font-extrabold ${isExhausted ? "text-red-400" : "text-emerald-300"}`}>
                {Math.min(quota.messagesUsed, quota.monthlyQuota)} / {quota.monthlyQuota} msgs/mois
              </span>
            </div>

            <div className="w-full h-1.5 bg-[#0B0914] rounded-full overflow-hidden border border-emerald-900/40">
              <div
                className={`h-full transition-all duration-500 ${
                  isExhausted ? "bg-red-500" : isWarning ? "bg-amber-400" : "bg-emerald-500"
                }`}
                style={{
                  width: `${Math.min(100, (Math.min(quota.messagesUsed, quota.monthlyQuota) / quota.monthlyQuota) * 100)}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between w-full text-[10px] text-emerald-200/60 font-medium">
              <span>{quota.totalMessagesAvailable} message{quota.totalMessagesAvailable > 1 ? "s" : ""} disponible{quota.totalMessagesAvailable > 1 ? "s" : ""}</span>
              {quota.rewardedMessages > 0 ? (
                <span className="text-emerald-400 font-bold">+{quota.rewardedMessages} bonus disponible{quota.rewardedMessages > 1 ? "s" : ""}</span>
              ) : (
                <span className="text-slate-400">0 bonus disponible</span>
              )}
            </div>
            
            <div className="flex items-center justify-between w-full text-[9px] text-emerald-300/40 border-t border-emerald-900/30 pt-1">
              <span>
                Pubs cette semaine : {adsWatched}/{maxWeeklyAds}{" "}
                {adsWatched >= maxWeeklyAds ? "(Max atteint)" : "regardées"}
              </span>
              <span>Max {quota.maxImagesPerMessage} img/msg</span>
            </div>
          </div>
        )}
      </header>

      {/* Main Layout: Sidebar Conversations + Chat Body */}
      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
        {/* Left Sidebar: Conversations & Suggestions */}
        <aside className="w-full lg:w-72 flex flex-col gap-4 shrink-0 overflow-y-auto pr-1 scrollbar-hide">
          {/* New Chat Button */}
          <button
            onClick={createNewChat}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-xs font-extrabold text-white shadow-lg shadow-emerald-600/30 hover:opacity-95 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Nouvelle Conversation</span>
          </button>

          {/* Conversations History */}
          <div className="rounded-3xl bg-[#0A100C] border border-emerald-900/30 p-4 shadow-xl flex-1 flex flex-col min-h-[220px]">
            <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2 mb-3">
              <History className="h-4 w-4 text-emerald-400" /> Historique ({sessions.length})
            </h3>

            <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[300px]">
              {sessions.map((s) => {
                const isActive = s.id === activeSessionId;
                return (
                  <div
                    key={s.id}
                    onClick={() => setActiveSessionId(s.id)}
                    className={`group flex items-center justify-between p-3 rounded-2xl cursor-pointer text-xs transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-emerald-900/80 to-teal-900/50 border border-emerald-500/40 text-white font-bold shadow-md"
                        : "bg-[#0B0914]/50 border border-emerald-900/20 text-slate-300 hover:bg-[#1C183B] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <MessageSquare className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-emerald-400" : "text-emerald-300/50"}`} />
                      <span className="truncate">{s.title}</span>
                    </div>

                    <button
                      onClick={(e) => deleteChat(s.id, e)}
                      title="Supprimer la conversation"
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-400 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Suggestions */}
          <div className="rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-4 shadow-xl space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-2 mb-2">
              <Lightbulb className="h-3.5 w-3.5 text-amber-400" /> Suggestions Rapides
            </h4>
            {[
              { icon: Sprout, text: "Diagnostic maladie par photo de feuille" },
              { icon: CloudSun, text: "Météo des 7 prochains jours au Bénin" },
              { icon: LineChart, text: "Prévisions de rendement de la parcelle" },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => setInput(item.text)}
                className="w-full text-left flex items-center gap-2 p-2.5 rounded-xl bg-[#0B0914]/60 border border-emerald-900/20 hover:border-emerald-500/40 hover:bg-[#0A100C] transition text-[11px] text-emerald-200"
              >
                <item.icon className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{item.text}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Chat Box */}
        <section className="flex-1 rounded-3xl border border-emerald-900/30 bg-gradient-to-b from-[#181436] to-[#050A07] shadow-2xl flex flex-col min-h-0 overflow-hidden relative">
          {/* Messages Scroll Container */}
          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            {messages.map((message, index) => (
              <div key={index} className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
                <div className={`flex max-w-[85%] gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${
                      message.role === "assistant"
                        ? "bg-emerald-600 shadow-md shadow-emerald-600/30 text-white"
                        : "bg-violet-600 shadow-md shadow-violet-600/30 text-white"
                    }`}
                  >
                    {message.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>

                  <div
                    className={`rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-line ${
                      message.role === "assistant"
                        ? "rounded-tl-none bg-[#1C183B] text-emerald-50 border border-emerald-900/20 shadow-md"
                        : "rounded-tr-none bg-emerald-700 text-white"
                    }`}
                  >
                    {/* Render Image Thumbnail if attached */}
                    {message.image && (
                      <div className="mb-3 overflow-hidden rounded-xl border border-white/20 max-w-xs">
                        <img src={message.image} alt="Pièce jointe" className="max-h-48 w-full object-cover" />
                      </div>
                    )}
                    {message.fileName && !message.image && (
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold bg-black/20 p-2 rounded-xl border border-white/10">
                        <FileText className="h-4 w-4 text-emerald-300" />
                        <span>{message.fileName}</span>
                      </div>
                    )}

                    {message.content}
                  </div>
                </div>
              </div>
            ))}

            {pending && (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white animate-pulse">
                  <Bot className="h-4 w-4" />
                </div>
                <p className="text-xs font-medium text-emerald-300/80 animate-pulse">
                  TerraMind Copilot génère votre réponse…
                </p>
              </div>
            )}

            {/* Warning Banner */}
            {isWarning && !pending && (
              <div className="rounded-2xl bg-amber-950/40 border border-amber-800/40 p-3 text-xs font-semibold text-amber-300 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                <span>Attention : Il ne vous reste plus qu'un seul message disponible pour ce mois.</span>
              </div>
            )}

            {/* Exhaustion Banner */}
            {isExhausted && (
              <div className="rounded-3xl border border-red-500/30 bg-gradient-to-r from-red-950/70 via-[#181436] to-amber-950/70 p-5 space-y-3 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-red-900/40 border border-red-700/50 p-2.5 text-red-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">
                      {quota.plan === "free"
                        ? "Vous avez utilisé vos 5 messages IA gratuits pour ce mois."
                        : `Vous avez atteint votre quota IA mensuel (${quota.monthlyQuota} messages).`}
                    </h3>
                    <p className="text-xs text-red-200/80 mt-0.5">
                      Réinitialisation automatique : {quota.nextRenewalDate}.
                    </p>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-3 pt-1">
                  {quota.plan !== "enterprise" && (
                    <Link
                      href="/tarifs"
                      className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-2.5 text-xs font-extrabold text-white shadow-lg hover:opacity-95 transition"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-emerald-200" />
                      <span>Passer à PRO (50 msgs/mois)</span>
                    </Link>
                  )}
                  <Link
                    href="/tarifs"
                    className="flex items-center justify-center gap-2 rounded-2xl bg-purple-950 border border-purple-500/50 px-3 py-2.5 text-xs font-extrabold text-purple-200 hover:bg-purple-900 transition"
                  >
                    <Building className="h-3.5 w-3.5 text-purple-400" />
                    <span>Formule ENTREPRISE</span>
                  </Link>
                  <button
                    type="button"
                    disabled={!quota?.canClaimReward}
                    onClick={() => {
                      if (quota?.canClaimReward) setIsAdModalOpen(true);
                    }}
                    className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-2.5 text-xs font-extrabold transition ${
                      quota?.canClaimReward
                        ? "bg-[#0A100C] border border-emerald-500/40 text-emerald-300 hover:bg-[#1C183B]"
                        : "bg-slate-900/60 border border-slate-800 text-slate-500 cursor-not-allowed opacity-60"
                    }`}
                  >
                    <Film className="h-3.5 w-3.5 text-emerald-400" />
                    <span>
                      {quota?.canClaimReward
                        ? "Obtenir +1 message bonus"
                        : `Plus de pub disponible (${adsWatched}/${maxWeeklyAds})`}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Selected File Preview Badge before Send */}
          {selectedFile && (
            <div className="px-4 py-2 bg-[#0A100C] border-t border-emerald-900/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedFile.type.startsWith("image/") ? (
                  <img src={selectedFile.dataUrl} alt="Aperçu" className="h-10 w-10 object-cover rounded-lg border border-emerald-500/40" />
                ) : (
                  <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
                    <FileText className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-white truncate max-w-xs">{selectedFile.name}</p>
                  <p className="text-[10px] text-emerald-300 font-semibold">
                    Prêt pour l'analyse IA (Max {quota?.maxImagesPerMessage || 1} img/msg)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedFile(null)}
                className="p-1 rounded-full text-slate-400 hover:text-red-400 hover:bg-red-950/50 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Input Form with Audio Dictation & Image/File Attachment */}
          <form onSubmit={send} className="border-t border-emerald-900/30 p-3 bg-[#0B0914]/80 backdrop-blur-md">
            <div className="flex items-center gap-2">
              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Attach File Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isExhausted || pending}
                title="Joindre une photo de culture ou un fichier"
                className="p-3 rounded-2xl bg-[#0A100C] border border-emerald-900/50 text-emerald-300 hover:text-white hover:border-emerald-500/50 transition disabled:opacity-50 shrink-0"
              >
                <Paperclip className="h-5 w-5" />
              </button>

              {/* Input Text Box */}
              <input
                value={input}
                disabled={isExhausted || pending}
                onChange={(event) => setInput(event.target.value)}
                placeholder={
                  isListening
                    ? "🎤 Écoute en cours... Parlez maintenant"
                    : isExhausted
                    ? t.aiExhaustedMsg
                    : t.aiPlaceholder
                }
                className={`min-w-0 flex-1 rounded-2xl border bg-[#0A100C] px-4 py-3 text-sm text-white placeholder:text-emerald-300/40 outline-none transition disabled:opacity-50 ${
                  isListening ? "border-red-500 animate-pulse ring-2 ring-red-500/30" : "border-emerald-900/50 focus:border-emerald-500/60"
                }`}
              />

              {/* Audio Speech Transcription Button (Voice Dictation) */}
              <button
                type="button"
                onClick={toggleVoiceRecording}
                disabled={isExhausted || pending}
                title={isListening ? "Arrêter la dictée vocale" : "Commencer la dictée vocale (Audio Transcripteur)"}
                className={`p-3 rounded-2xl border transition shrink-0 ${
                  isListening
                    ? "bg-red-600 text-white border-red-400 animate-bounce shadow-lg shadow-red-600/40"
                    : "bg-[#0A100C] border-emerald-900/50 text-emerald-400 hover:text-white hover:border-emerald-500/50"
                }`}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>

              {/* Send Button */}
              <button
                disabled={pending || isExhausted || (!input.trim() && !selectedFile)}
                className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-white disabled:opacity-50 hover:opacity-90 transition shadow-lg shadow-emerald-600/30 shrink-0"
                aria-label="Envoyer"
              >
                <SendHorizontal className="h-5 w-5" />
              </button>
            </div>
            <p className="text-center text-[10px] text-emerald-300/40 mt-2 font-medium">
              TerraMind Copilot peut analyser des images de feuilles, insectes ou bilans comptables.
            </p>
          </form>
        </section>
      </div>

      {/* Ad Reward Modal */}
      <RewardAdModal
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
        onRewardClaimed={handleRewardClaimed}
      />
    </main>
  );
}
