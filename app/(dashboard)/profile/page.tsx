"use client";

import { useState, useEffect, useRef } from "react";
import { User, Mail, Building, Phone, Save, Camera, CheckCircle, AlertCircle } from "lucide-react";
import Card from "@/app/components/ui/Card";
import { createClient } from "@/lib/client";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);
  
  const [profile, setProfile] = useState({
    id: "",
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
    avatar_url: "",
    role: "seller"
  });

  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Non connecté");

        setProfile(prev => ({ ...prev, id: user.id, email: user.email || "" }));

        const { data, error } = await supabase
          .from("users_profile")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error && error.code !== "PGRST116") throw error; // ignore not found
        
        if (data) {
          setProfile(prev => ({
            ...prev,
            full_name: data.full_name || user.user_metadata?.full_name || "",
            phone: data.phone || "",
            company_name: data.company_name || "",
            avatar_url: data.avatar_url || "",
            role: data.role || "seller"
          }));
        } else {
          // fallback to auth metadata
          setProfile(prev => ({
            ...prev,
            full_name: user.user_metadata?.full_name || "",
          }));
        }
      } catch (error: any) {
        console.error("Error loading user data:", error.message);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg(false);

    try {
      // Upsert profile data with avatar_url
      const { error } = await supabase
        .from("users_profile")
        .upsert({
          id: profile.id,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          phone: profile.phone,
          company_name: profile.company_name,
          role: profile.role,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      await supabase.auth.updateUser({
        data: {
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
        },
      });

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("profile_updated"));
      }

      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (error: any) {
      setErrorMsg("Impossible de mettre à jour le profil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-emerald-400">Chargement...</div>;
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white">Profil Utilisateur</h1>
        <p className="mt-2 text-sm text-slate-400">Gérez vos informations personnelles et préférences.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Avatar Section */}
        <Card className="col-span-1 p-6 text-center space-y-4">
          <div className="relative inline-block">
            <div className="h-32 w-32 rounded-full border-4 border-[#1C183B] bg-emerald-900/30 overflow-hidden flex items-center justify-center">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <User className="h-12 w-12 text-emerald-500" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 p-2 bg-emerald-600 rounded-full text-white hover:bg-emerald-500 transition shadow-lg cursor-pointer">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 4 * 1024 * 1024) {
                    setErrorMsg("Image trop volumineuse (max 4MB).");
                    return;
                  }
                  setUploading(true);
                  setErrorMsg("");
                  try {
                    let targetUrl = "";
                    const path = `avatars/${profile.id}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9\._-]/g, "")}`;
                    
                    const { error: uploadError } = await supabase.storage
                      .from("avatars")
                      .upload(path, file, { upsert: true });

                    if (!uploadError) {
                      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
                      targetUrl = data?.publicUrl || "";
                    }

                    // Fallback to base64 Data URL if storage bucket fails/unconfigured
                    if (!targetUrl) {
                      targetUrl = await new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.readAsDataURL(file);
                      });
                    }

                    // Update profile record in Supabase users_profile table
                    const { error: upsertError } = await supabase
                      .from("users_profile")
                      .upsert({
                        id: profile.id,
                        full_name: profile.full_name,
                        avatar_url: targetUrl,
                        updated_at: new Date().toISOString()
                      });

                    if (upsertError) throw upsertError;

                    // Update auth user metadata
                    await supabase.auth.updateUser({
                      data: { avatar_url: targetUrl }
                    });

                    setProfile((p) => ({ ...p, avatar_url: targetUrl }));

                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new Event("profile_updated"));
                    }
                  } catch (err: any) {
                    console.error("Upload error:", err);
                    setErrorMsg("Impossible d'uploader l'image de profil.");
                  } finally {
                    setUploading(false);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }
                }}
              />
              {uploading ? (
                <div className="h-4 w-4 flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                </div>
              ) : (
                <Camera size={16} />
              )}
            </label>
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">{profile.full_name || "Utilisateur"}</h3>
            <p className="text-sm text-emerald-400">Agriculteur Premium</p>
          </div>
        </Card>

        {/* Form Section */}
        <Card className="col-span-2 p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6">Informations Personnelles</h2>
          
          {errorMsg && (
            <div className="mb-6 rounded-xl bg-red-950/60 border border-red-800/40 p-3 text-xs font-semibold text-red-300 flex items-center gap-3">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 rounded-xl bg-emerald-950/60 border border-emerald-800/40 p-3 text-xs font-semibold text-emerald-300 flex items-center gap-3">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>Profil mis à jour avec succès.</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Nom Complet</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    name="full_name"
                    value={profile.full_name}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-[#0B0914]/50 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition"
                    placeholder="Jean Dupont"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full rounded-xl bg-[#0B0914]/80 border border-white/5 pl-10 pr-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Entreprise / Exploitation</label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    name="company_name"
                    value={profile.company_name}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-[#0B0914]/50 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition"
                    placeholder="Ferme des Lilas"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Rôle</label>
                <select
                  name="role"
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  className="w-full rounded-xl bg-[#0B0914]/50 border border-white/10 pl-3 pr-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50"
                >
                  <option value="seller">Vendeur / Producteur</option>
                  <option value="buyer">Acheteur</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-[#0B0914]/50 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition"
                    placeholder="+221 77 000 00 00"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition disabled:opacity-70"
              >
                {saving ? "Sauvegarde..." : "Sauvegarder"}
                <Save className="h-4 w-4" />
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
