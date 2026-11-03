"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { ConnectionsBackground } from "@/components/homeCliente/connectionsBackground";
import MenuPerfil from "@/components/homeCliente/menuPerfil";
import { InterestsCard } from "@/components/perfil/interestsCard";
import { NotificationsCard } from "@/components/perfil/notificationsCard";
import { PersonalDataCard } from "@/components/perfil/personalDataCard";
import { ProfileHeader } from "@/components/perfil/profileHeader";
import { SecurityCard } from "@/components/perfil/securityCard";
import Sidebar from "@/components/sidebar";
import { Input } from "@/components/ui/input";

import { Footer } from "@/components/footer";
export default function PerfilPage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatarDataUrl: null,
    interests: [],
    notifications: { reviewReminders: true, weeklySummary: false },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  async function parseResponse(response) {
    const text = await response.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      return { message: text };
    }
  }

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/auth/profile");
        const data = await parseResponse(response);
        if (!response.ok) throw new Error(data.message || "Não foi possível carregar o perfil.");
        setProfile({
          name: data.user.name,
          email: data.user.email,
          avatarDataUrl: data.avatarDataUrl,
          interests: data.preferences.interests,
          notifications: data.preferences.notifications,
        });
      } catch (error) {
        setFeedback({ type: "error", text: error.message });
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  async function saveProfile(event) {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          interests: profile.interests,
          notifications: profile.notifications,
        }),
      });
      const data = await parseResponse(response);
      if (!response.ok) {
        const message = Array.isArray(data.message)
          ? data.message.map((item) => item.message || item).join(", ")
          : data.message || data.error || `Erro HTTP ${response.status}`;
        throw new Error(message);
      }
      setProfile((current) => ({
        ...current,
        name: data.user.name,
        email: data.user.email,
      }));
      setFeedback({ type: "success", text: "Perfil atualizado com sucesso!" });
    } catch (error) {
      setFeedback({ type: "error", text: error.message || "Erro ao atualizar o perfil." });
    } finally {
      setSaving(false);
    }
  }

  async function saveAvatar(avatarDataUrl) {
    setSaving(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/auth/avatar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarDataUrl }),
      });
      const data = await parseResponse(response);
      if (!response.ok) {
        throw new Error(data.message || data.error || `Erro HTTP ${response.status}`);
      }
      setProfile((current) => ({ ...current, avatarDataUrl: data.avatarDataUrl }));
      setFeedback({ type: "success", text: "Foto de perfil atualizada." });
    } finally {
      setSaving(false);
    }
  }

  function toggleInterest(interest) {
    setProfile((current) => ({
      ...current,
      interests: current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest],
    }));
    setFeedback(null);
  }

  function updateNotification(name, checked) {
    setProfile((current) => ({
      ...current,
      notifications: { ...current.notifications, [name]: checked },
    }));
    setFeedback(null);
  }

  return (
    <div className="min-h-screen">
      <Sidebar activeItem="Configurações" />

      <main className="relative isolate min-h-screen min-w-0 bg-wisen-superficie font-[family-name:var(--font-geist-sans)] sm:ml-[128px] lg:ml-[220px]">
        <ConnectionsBackground />
        <div className="relative z-10 mx-auto w-full max-w-[1600px]">
          <div className="relative z-50 flex items-center justify-end gap-3 px-4 pt-3 sm:px-5 lg:px-7">
            <search className="relative min-w-0 flex-1 sm:w-[360px] sm:flex-none">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7182A1]"
                size={16}
              />
              <Input
                type="search"
                aria-label="Buscar notícias, conceitos ou temas"
                placeholder="Pesquise por notícias, conceitos ou temas..."
                className="h-9 rounded-full border-wisen-borda bg-white/90 pl-9 text-[11px] shadow-sm placeholder:text-[#8794AA] focus-visible:ring-[#DCE5F2]"
              />
            </search>

            <MenuPerfil />
          </div>

          <div className="space-y-8 px-4 pb-12 pt-8 sm:px-5 lg:px-7">
            <ProfileHeader />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <PersonalDataCard
                name={profile.name}
                email={profile.email}
                avatarDataUrl={profile.avatarDataUrl}
                onAvatarUpload={saveAvatar}
                onNameChange={(name) => setProfile((current) => ({ ...current, name }))}
                onEmailChange={(email) => setProfile((current) => ({ ...current, email }))}
                onSubmit={saveProfile}
                loading={loading}
                saving={saving}
                feedback={feedback}
              />
              <InterestsCard interests={profile.interests} onToggle={toggleInterest} />
              <NotificationsCard
                notifications={profile.notifications}
                onChange={updateNotification}
              />
              <SecurityCard />
            </div>
          </div>
        </div>
      </main>
       <Footer />
    </div>
  );
}
