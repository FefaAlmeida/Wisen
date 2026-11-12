"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Footer } from "@/components/footer";
import { ConnectionsBackground } from "@/components/homeCliente/connectionsBackground";
import MenuPerfil from "@/components/homeCliente/menuPerfil";
import { InterestsCard } from "@/components/perfil/interestsCard";
import { NotificationsCard } from "@/components/perfil/notificationsCard";
import { PersonalDataCard } from "@/components/perfil/personalDataCard";
import { ProfileHeader } from "@/components/perfil/profileHeader";
import { SecurityCard } from "@/components/perfil/securityCard";
import Sidebar from "@/components/sidebar";
import { Input } from "@/components/ui/input";

async function parseResponse(response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text };
  }
}

export default function PerfilPage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatarDataUrl: null,
    interests: [],
    notifications: { reviewReminders: true, weeklySummary: false },
  });
  const [savedInterests, setSavedInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [interestsFeedback, setInterestsFeedback] = useState(null);

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
        setSavedInterests(data.preferences.interests);
      } catch (error) {
        setFeedback({ type: "error", text: error.message });
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  async function persistProfile(nextProfile, successMessage, setResult) {
    setSaving(true);
    setResult(null);
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nextProfile.name,
          email: nextProfile.email,
          interests: nextProfile.interests,
          notifications: nextProfile.notifications,
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
      setSavedInterests(nextProfile.interests);
      setResult({ type: "success", text: successMessage });
    } catch (error) {
      setResult({ type: "error", text: error.message || "Erro ao atualizar o perfil." });
    } finally {
      setSaving(false);
    }
  }

  function saveProfile(event) {
    event.preventDefault();
    return persistProfile(profile, "Perfil atualizado com sucesso!", setFeedback);
  }

  function saveInterests() {
    return persistProfile(profile, "Assuntos de interesse salvos.", setInterestsFeedback);
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
    setInterestsFeedback(null);
  }

  const interestsChanged =
    JSON.stringify([...profile.interests].sort()) !== JSON.stringify([...savedInterests].sort());

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
              <InterestsCard
                interests={profile.interests}
                onToggle={toggleInterest}
                onSave={saveInterests}
                saving={saving || loading}
                hasChanges={interestsChanged}
                feedback={interestsFeedback}
              />
              <NotificationsCard
                notifications={profile.notifications}
                onChange={updateNotification}
              />
              <SecurityCard />
            </div>
          </div>
        </div>
      </main>
      <Footer variant="cliente" />
    </div>
  );
}
