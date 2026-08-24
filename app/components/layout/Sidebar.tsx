"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  House,
  Tractor,
  Sprout,
  Wallet,
  Package,
  CloudSun,
  Bot,
  Settings,
  X,
  ChevronRight,
  LogOut,
} from "lucide-react";
import Logo from "../ui/Logo";
import { createClient } from "@/lib/client";
import LogoutConfirmModal from "../ui/LogoutConfirmModal";
import { useLanguage } from "@/lib/language-context";

interface SidebarProps {
  isOpen?: boolean;
  setIsOpen?: (val: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { t } = useLanguage();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    fullName: string;
    avatarUrl: string;
  }>({
    fullName: "Utilisateur",
    avatarUrl: "",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const fullName = user.user_metadata?.full_name || "Utilisateur";
          const authAvatar = user.user_metadata?.avatar_url || "";
          const cachedAvatar =
            localStorage.getItem(`avatar_${user.id}`) ||
            localStorage.getItem("avatar_demo_user") ||
            "";
          const cachedName =
            localStorage.getItem(`name_${user.id}`) ||
            localStorage.getItem("name_demo_user") ||
            "";

          const { data: prof } = await supabase
            .from("users_profile")
            .select("full_name, avatar_url")
            .eq("id", user.id)
            .maybeSingle();

          setUserProfile({
            fullName: prof?.full_name || cachedName || fullName,
            avatarUrl: prof?.avatar_url || cachedAvatar || authAvatar,
          });
        } else {
          const cachedAvatar = localStorage.getItem("avatar_demo_user") || "";
          const cachedName = localStorage.getItem("name_demo_user") || "Utilisateur";
          setUserProfile({
            fullName: cachedName,
            avatarUrl: cachedAvatar,
          });
        }
      } catch (e) {
        console.error("Error loading user profile in sidebar:", e);
      }
    }

    loadProfile();

    const handleUpdate = () => loadProfile();
    window.addEventListener("profile_updated", handleUpdate);
    return () => window.removeEventListener("profile_updated", handleUpdate);
  }, [supabase]);

  const menu = [
    { name: t.navHome, href: "/home", icon: House },
    { name: t.navDashboard, href: "/dashboard", icon: LayoutDashboard },
    { name: t.navFarms, href: "/farms", icon: Tractor },
    { name: t.navCrops, href: "/crops", icon: Sprout },
    { name: t.navFinance, href: "/finance", icon: Wallet },
    { name: t.navStock, href: "/stock", icon: Package },
    { name: t.navWeather, href: "/weather", icon: CloudSun },
    { name: t.navAI, href: "/ai", icon: Bot },
    { name: t.navSettings, href: "/settings", icon: Settings },
  ];

  const closeSidebar = () => {
    if (setIsOpen) setIsOpen(false);
  };

  const handleConfirmLogout = async () => {
    await supabase.auth.signOut();
    setIsLogoutModalOpen(false);
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      <aside className={`fixed left-0 top-0 flex h-screen w-72 flex-col border-r border-emerald-900/20 bg-[#0E0C1F] text-white z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>

        {/* Top Logo */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-emerald-900/20">
          <div className="flex items-center gap-3">
            <Logo width={38} height={38} />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                TerraMind <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-200 border border-emerald-500/40">AI</span>
              </h1>
              <p className="text-xs text-emerald-200 font-medium">Smart Agriculture</p>
            </div>
          </div>
          
          {/* Close Button Mobile */}
          <button onClick={closeSidebar} className="lg:hidden text-emerald-300 hover:text-white p-2">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          <div>
            <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-300">
              Navigation
            </p>

            <div className="space-y-1.5">
              {menu.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeSidebar}
                    className={`group flex items-center justify-between rounded-2xl px-4 py-3.5 transition-all duration-300 ${
                      active
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/40 font-bold"
                        : "text-slate-200 hover:bg-emerald-900/50 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <Icon className={`h-5 w-5 ${active ? "text-white" : "text-emerald-300 group-hover:text-white"}`} />
                      <span className="text-sm font-semibold tracking-wide">
                        {item.name}
                      </span>
                    </div>

                    <ChevronRight
                      className={`h-4 w-4 transition-transform duration-300 ${
                        active
                          ? "opacity-100 translate-x-0 text-white"
                          : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-emerald-300"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* TerraMind AI Assistant Banner */}
          <div className="rounded-3xl bg-gradient-to-b from-[#0B130E] to-[#0A100C] border border-emerald-500/30 p-5 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">{t.aiAssistantTitle}</span>
            </div>
            <h3 className="text-base font-bold text-white">{t.aiCopilotTitle}</h3>
            <p className="mt-2 text-xs text-slate-200 leading-relaxed font-medium">
              {t.aiBannerDesc}
            </p>
            <Link href="/ai" onClick={closeSidebar} className="mt-4 block text-center w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/30 hover:opacity-90 transition">
              {t.aiConsultBtn}
            </Link>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="border-t border-emerald-900/20 p-4 bg-[#0A100C]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                {userProfile.avatarUrl ? (
                  <img
                    src={userProfile.avatarUrl}
                    alt="Photo de profil"
                    className="h-11 w-11 rounded-2xl object-cover border border-emerald-500/40 shadow-md"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-lg font-bold text-white shadow-md">
                    {userProfile.fullName ? userProfile.fullName.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-[#0A100C]"></span>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white tracking-wide truncate max-w-[130px]">
                  {userProfile.fullName}
                </h3>
                <p className="text-xs text-emerald-200 font-medium">Agriculteur Expert</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(true)}
              title={t.navLogout}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-950/50 text-slate-200 hover:text-white hover:bg-red-950/60 hover:text-red-400 transition border border-emerald-900/30 shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}
