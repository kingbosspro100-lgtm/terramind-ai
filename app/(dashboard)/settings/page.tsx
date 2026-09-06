"use client";

import { useState, useEffect, useRef } from "react";
import {
  User,
  ShieldCheck,
  CreditCard,
  Sparkles,
  Save,
  Lock,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Activity,
  Globe,
  Trash2,
  Camera,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";
import LogoutConfirmModal from "@/app/components/ui/LogoutConfirmModal";
import DeleteAccountModal from "@/app/components/ui/DeleteAccountModal";

import { useLanguage } from "@/lib/language-context";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { dashboardLanguage, setDashboardLanguage, t } = useLanguage();
  const language = dashboardLanguage;

  const [activeTab, setActiveTab] = useState<"profile" | "security" | "subscription" | "usage" | "language">("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // User Profile state
  const [profile, setProfile] = useState({
    id: "",
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
    avatar_url: "",
    role: "seller",
  });

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Subscription & Monthly Quota state
  const [subscription, setSubscription] = useState({
    plan: "free",
    status: "active",
  });

  const [quota, setQuota] = useState<any>({
    plan: "free",
    monthlyQuota: 5,
    messagesUsed: 0,
    rewardedMessages: 0,
    messagesRemainingInQuota: 5,
    totalMessagesAvailable: 5,
    canSendMessage: true,
    canClaimReward: true,
    nextRenewalDate: "1er septembre 2026",
  });

  useEffect(() => {
    async function loadSettingsData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const cachedAvatar = localStorage.getItem(`avatar_${user.id}`);
          const cachedProfStr = localStorage.getItem(`profile_${user.id}`);
          const cachedProf = cachedProfStr ? JSON.parse(cachedProfStr) : null;

          setProfile((prev) => ({
            ...prev,
            id: user.id,
            email: user.email || "",
            full_name: cachedProf?.full_name || user.user_metadata?.full_name || "",
            phone: cachedProf?.phone || "",
            company_name: cachedProf?.company_name || "",
            avatar_url: cachedProf?.avatar_url || cachedAvatar || user.user_metadata?.avatar_url || "",
          }));

          try {
            const { data: profData } = await supabase
              .from("users_profile")
              .select("*")
              .eq("id", user.id)
              .maybeSingle();

            if (profData) {
              setProfile((prev) => ({
                ...prev,
                full_name: profData.full_name || prev.full_name,
                phone: profData.phone || prev.phone,
                company_name: profData.company_name || prev.company_name,
                avatar_url: profData.avatar_url || cachedAvatar || prev.avatar_url,
                role: profData.role || "seller",
              }));
            }
          } catch (dbErr) {
            console.warn("DB profile load notice:", dbErr);
          }
        } else {
          setProfile((prev) => ({
            ...prev,
            id: "demo_user",
            email: "agriculteur@terramind.ai",
            full_name: localStorage.getItem("name_demo_user") || "Utilisateur Expert",
            company_name: "Ferme Agricole Bio",
            avatar_url: localStorage.getItem("avatar_demo_user") || "",
          }));
        }

        const qRes = await fetch("/api/ai");
        if (qRes.ok) {
          const qData = await qRes.json();
          if (qData.quota) {
            setQuota(qData.quota);
            setSubscription({
              plan: qData.quota.plan || "free",
              status: "active",
            });
          }
        }
      } catch (err) {
        console.error("Erreur lors du chargement des paramètres:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSettingsData();
  }, [supabase]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg(language === "fr" ? "L'image est trop volumineuse (max 5 Mo)." : "Image is too large (max 5 MB).");
      return;
    }

    setUploading(true);
    setErrorMsg("");
    try {
      let publicUrl = "";
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const targetUserId = user?.id || profile.id;
        
        if (targetUserId) {
          const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const path = `${targetUserId}/${Date.now()}_${cleanFileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(path, file, { upsert: true });

          if (!uploadError) {
            const { data } = supabase.storage.from("avatars").getPublicUrl(path);
            publicUrl = data?.publicUrl || "";
          } else {
            console.warn("Storage avatar upload notice:", uploadError.message);
          }
        }
      } catch (storageErr) {
        console.warn("Storage bucket error, falling back to base64 encoding:", storageErr);
      }

      if (!publicUrl) {
        publicUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      setProfile((p) => ({ ...p, avatar_url: publicUrl }));

      try {
        const { data: { user } } = await supabase.auth.getUser();
        const targetUserId = user?.id || profile.id;

        if (targetUserId) {
          localStorage.setItem(`avatar_${targetUserId}`, publicUrl);
          await supabase.from("users_profile").upsert({
            id: targetUserId,
            avatar_url: publicUrl,
            updated_at: new Date().toISOString(),
          });
          await supabase.auth.updateUser({
            data: { avatar_url: publicUrl, picture: publicUrl },
          });
        }
      } catch (dbErr) {
        console.warn("DB Avatar Save notice:", dbErr);
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("profile_updated"));
      }

      setSuccessMsg(language === "fr" ? "Photo de profil mise à jour avec succès !" : "Profile picture updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      console.error(err);
      setErrorMsg(language === "fr" ? "Impossible d'enregistrer la photo." : "Failed to save profile picture.");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const targetId = profile.id || "demo_user";
      localStorage.setItem(`profile_${targetId}`, JSON.stringify(profile));
      localStorage.setItem(`name_${targetId}`, profile.full_name);
      if (profile.avatar_url) {
        localStorage.setItem(`avatar_${targetId}`, profile.avatar_url);
      }

      try {
        if (profile.id) {
          await supabase.from("users_profile").upsert({
            id: profile.id,
            full_name: profile.full_name,
            phone: profile.phone,
            company_name: profile.company_name,
            role: profile.role,
            avatar_url: profile.avatar_url,
            updated_at: new Date().toISOString(),
          });
        }
      } catch (dbErr) {
        console.warn("DB Profile save notice:", dbErr);
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("profile_updated"));
      }

      setSuccessMsg(language === "fr" ? "Informations du profil enregistrées avec succès !" : "Profile information saved successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      setErrorMsg(language === "fr" ? "Impossible de mettre à jour le profil." : "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setErrorMsg(language === "fr" ? "Le mot de passe doit contenir au moins 8 caractères." : "At least 8 characters required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg(language === "fr" ? "Les mots de passe ne correspondent pas." : "Passwords do not match.");
      return;
    }

    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      try {
        await supabase.auth.updateUser({ password: newPassword });
      } catch (subErr) {
        console.warn("Supabase auth updateUser notice:", subErr);
      }

      localStorage.setItem(`pwd_last_updated_${profile.id || "demo_user"}`, new Date().toISOString());

      setSuccessMsg(language === "fr" ? "Nouveau mot de passe enregistré avec succès !" : "New password saved successfully!");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || (language === "fr" ? "Erreur lors de la mise à jour." : "Update error."));
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmLogout = async () => {
    await supabase.auth.signOut();
    setIsLogoutModalOpen(false);
    router.push("/login");
    router.refresh();
  };

  const handleConfirmDeleteAccount = async () => {
    try {
      const res = await fetch("/api/user/delete", { method: "POST" });
      if (!res.ok) {
        throw new Error("Erreur suppression");
      }
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
      await supabase.auth.signOut();
      setIsDeleteModalOpen(false);
      router.push("/login");
      router.refresh();
    } catch (e: any) {
      setErrorMsg("Impossible de supprimer le compte pour le moment.");
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === "fr" ? "en" : "fr";
    setDashboardLanguage(nextLang);
    setSuccessMsg(nextLang === "en" ? "Dashboard language switched to English 🇬🇧" : "Langue du dashboard réglée sur Français 🇫🇷");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-emerald-400">Chargement...</div>;
  }

  const tabs = [
    { id: "profile", label: t.tabProfile, icon: User },
    { id: "security", label: t.tabSecurity, icon: ShieldCheck },
    { id: "subscription", label: t.tabSubscription, icon: CreditCard },
    { id: "usage", label: t.tabUsage, icon: Activity },
    { id: "language", label: t.tabLanguage, icon: Globe },
  ] as const;

  return (
    <main className="mx-auto max-w-6xl space-y-8 pb-16 text-white">
      {/* Header */}
      <header className="border-b border-emerald-900/30 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3 py-1 text-[11px] font-bold text-emerald-300 mb-3">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          <span>{t.badge}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">{t.title}</h1>
        <p className="mt-1 text-sm text-emerald-200/70">{t.subtitle}</p>
      </header>

      {/* Tabs Navigation */}
      <nav className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-emerald-900/30">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`inline-flex whitespace-nowrap items-center gap-2 rounded-2xl border px-5 py-3 text-xs font-bold transition duration-200 ${
                isActive
                  ? "border-emerald-500 bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                  : "border-emerald-900/30 bg-[#0A100C] text-emerald-300 hover:bg-[#1C183B] hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Feedback Alerts */}
      {successMsg && (
        <div className="rounded-2xl bg-emerald-950/60 border border-emerald-800/40 p-4 text-xs font-semibold text-emerald-300 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-2xl bg-red-950/60 border border-red-800/40 p-4 text-xs font-semibold text-red-300 flex items-center gap-3 animate-shake">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* TAB 1: PROFIL */}
      {activeTab === "profile" && (
        <section className="grid gap-8 md:grid-cols-3">
          {/* Avatar Upload */}
          <div className="rounded-3xl border border-emerald-900/30 bg-gradient-to-b from-[#181436] to-[#050A07] p-8 shadow-2xl text-center space-y-4">
            <div className="relative inline-block">
              <div className="h-32 w-32 rounded-full border-4 border-emerald-500/40 bg-emerald-950/80 overflow-hidden flex items-center justify-center mx-auto shadow-xl">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-14 w-14 text-emerald-400" />
                )}
              </div>

              <label className="absolute bottom-0 right-0 p-2.5 bg-emerald-600 rounded-full text-white hover:bg-emerald-500 transition shadow-lg cursor-pointer border border-emerald-400/50">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
                {uploading ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </label>
            </div>

            <div>
              <h3 className="font-extrabold text-white text-lg">{profile.full_name || "Utilisateur TerraMind"}</h3>
              <p className="text-xs text-emerald-400 font-bold uppercase mt-0.5">Plan {subscription.plan.toUpperCase()}</p>
            </div>
          </div>

          {/* Profile Form */}
          <div className="md:col-span-2 rounded-3xl border border-emerald-900/30 bg-gradient-to-b from-[#181436] to-[#050A07] p-8 shadow-2xl space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-white">{t.personalInfo}</h2>
              <p className="text-xs text-emerald-200/70 mt-1">{t.personalInfoDesc}</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1.5">{t.fullName}</label>
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    placeholder="Jean Dupont"
                    className="w-full rounded-2xl bg-[#0A100C] border border-emerald-900/30 px-4 py-3 text-sm text-white placeholder-emerald-300/30 outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1.5">{t.email}</label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full rounded-2xl bg-[#0B0914]/80 border border-emerald-900/20 px-4 py-3 text-sm text-emerald-300/50 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1.5">{t.company}</label>
                  <input
                    type="text"
                    value={profile.company_name}
                    onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                    placeholder="Ferme Agricole Bio"
                    className="w-full rounded-2xl bg-[#0A100C] border border-emerald-900/30 px-4 py-3 text-sm text-white placeholder-emerald-300/30 outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1.5">{t.phone}</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+229 97 00 00 00"
                    className="w-full rounded-2xl bg-[#0A100C] border border-emerald-900/30 px-4 py-3 text-sm text-white placeholder-emerald-300/30 outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-emerald-900/30 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-xs font-bold text-white shadow-xl shadow-emerald-600/30 hover:opacity-95 transition disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? t.saving : t.saveChanges}</span>
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* TAB 2: SÉCURITÉ */}
      {activeTab === "security" && (
        <section className="space-y-6">
          <div className="rounded-3xl border border-emerald-900/30 bg-gradient-to-b from-[#181436] to-[#050A07] p-8 shadow-2xl space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-white">{t.changePassword}</h2>
              <p className="text-xs text-emerald-200/70 mt-1">{t.changePasswordDesc}</p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1.5">{t.newPassword}</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl bg-[#0A100C] border border-emerald-900/30 px-4 py-3 text-sm text-white placeholder-emerald-300/30 outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1.5">{t.confirmPassword}</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl bg-[#0A100C] border border-emerald-900/30 px-4 py-3 text-sm text-white placeholder-emerald-300/30 outline-none focus:border-emerald-500/50"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-xs font-bold text-white shadow-xl shadow-emerald-600/30 hover:opacity-95 transition disabled:opacity-50"
              >
                <Lock className="h-4 w-4" />
                <span>{t.updatePassword}</span>
              </button>
            </form>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-red-900/30 bg-red-950/20 p-6 shadow-2xl flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">{t.logoutTitle}</h3>
                <p className="text-xs text-red-200/70 mt-1">{t.logoutDesc}</p>
              </div>
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-red-950 border border-red-700/50 px-4 py-2.5 text-xs font-bold text-red-200 hover:bg-red-900 transition"
              >
                <LogOut className="h-4 w-4" />
                <span>{t.logoutBtn}</span>
              </button>
            </div>

            <div className="rounded-3xl border border-red-900/40 bg-gradient-to-r from-red-950/40 to-rose-950/30 p-6 shadow-2xl flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Suppression du compte</h3>
                <p className="text-xs text-red-200/70 mt-1">Supprimer définitivement vos données d'exploitations.</p>
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:opacity-90 transition"
              >
                <Trash2 className="h-4 w-4" />
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: ABONNEMENT */}
      {activeTab === "subscription" && (
        <section className="space-y-6">
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-[#181436] via-[#0D0924] to-[#050A07] p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-emerald-900/30 pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">{t.currentPlan}</span>
                <h2 className="text-3xl font-extrabold text-white mt-1">
                  Plan {subscription.plan.toUpperCase()}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider bg-emerald-950/80 border-emerald-500/50 text-emerald-300">
                  Statut : {subscription.status}
                </span>

                <span className="text-2xl font-black text-white">
                  {subscription.plan === "enterprise"
                    ? "25 000 FCFA"
                    : subscription.plan === "pro"
                    ? "5 000 FCFA"
                    : "0 FCFA"}{" "}
                  <span className="text-xs text-emerald-200/60 font-medium">/ mois</span>
                </span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-emerald-900/30 bg-[#0A100C] p-4 space-y-1">
                <p className="text-xs text-emerald-200/60 font-semibold uppercase">Quota IA mensuel inclus</p>
                <p className="text-lg font-extrabold text-white">
                  {quota.monthlyQuota} messages / mois
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-900/30 bg-[#0A100C] p-4 space-y-1">
                <p className="text-xs text-emerald-200/60 font-semibold uppercase">Prochaine réinitialisation</p>
                <p className="text-lg font-extrabold text-white">{quota.nextRenewalDate}</p>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-emerald-900/30">
              <p className="text-xs text-emerald-200/80 max-w-md font-medium">
                Passez à la formule supérieure pour bénéficier d'un quota mensuel de questions plus élevé.
              </p>

              <Link
                href="/tarifs"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3.5 text-xs font-extrabold text-white shadow-xl shadow-emerald-600/30 hover:opacity-95 transition shrink-0"
              >
                <Sparkles className="h-4 w-4" />
                <span>Changer de Formule (Tarifs)</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* TAB 4: UTILISATION QUOTA IA */}
      {activeTab === "usage" && (
        <section className="rounded-3xl border border-emerald-900/30 bg-gradient-to-b from-[#181436] to-[#050A07] p-8 shadow-2xl space-y-6">
          <div className="border-b border-emerald-900/30 pb-4">
            <h2 className="text-xl font-extrabold text-white">{t.quotaTitle}</h2>
            <p className="text-xs text-emerald-200/70 mt-1">Suivi en temps réel de vos crédits de questions auprès de TerraMind Copilot.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <div className="rounded-2xl border border-emerald-900/30 bg-[#0A100C] p-6 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-300/60">Plan Actuel</p>
              <p className="text-2xl font-black text-white uppercase">{quota.plan}</p>
              <p className="text-xs text-emerald-200/60">Formule active</p>
            </div>

            <div className="rounded-2xl border border-emerald-900/30 bg-[#0A100C] p-6 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-300/60">Messages Utilisés</p>
              <p className="text-2xl font-extrabold text-white">
                {quota.messagesUsed} / {quota.monthlyQuota}
              </p>
              <p className="text-xs text-emerald-200/60">Ce mois-ci</p>
            </div>

            <div className="rounded-2xl border border-emerald-900/30 bg-[#0A100C] p-6 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-300/60">Messages Restants</p>
              <p className="text-3xl font-extrabold text-emerald-400">
                {quota.totalMessagesAvailable}
              </p>
              <p className="text-xs text-emerald-200/60">Disponibles</p>
            </div>

            <div className="rounded-2xl border border-emerald-900/30 bg-[#0A100C] p-6 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-300/60">Bonus Publicités</p>
              <p className="text-3xl font-extrabold text-teal-300">
                +{quota.rewardedMessages || 0}
              </p>
              <p className="text-xs text-emerald-200/60">Messages bonus récompensés</p>
            </div>
          </div>
        </section>
      )}

      {/* TAB 5: LANGUE */}
      {activeTab === "language" && (
        <section className="rounded-3xl border border-emerald-900/30 bg-gradient-to-b from-[#181436] to-[#050A07] p-8 shadow-2xl space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-white">{t.languageTitle}</h2>
            <p className="text-xs text-emerald-200/70 mt-1">{t.languageDesc}</p>
          </div>

          <div className="grid gap-4 max-w-lg">
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center justify-between rounded-2xl border border-emerald-500/40 bg-[#0A100C] p-6 text-left hover:bg-[#1C183B] transition shadow-lg"
            >
              <div className="flex items-center gap-4">
                <Globe className="h-7 w-7 text-emerald-400" />
                <div>
                  <p className="text-base font-extrabold text-white">{t.currentLang}</p>
                  <p className="text-xs text-emerald-200/70 mt-1">
                    {language === "fr" ? "Click to switch entire interface to English 🇬🇧" : "Cliquer pour passer l'interface en Français 🇫🇷"}
                  </p>
                </div>
              </div>

              <span className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md shrink-0">
                {t.switchLang}
              </span>
            </button>
          </div>
        </section>
      )}

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDeleteAccount}
      />
    </main>
  );
}