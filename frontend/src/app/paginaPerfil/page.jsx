"use client";

import { useEffect, useState } from "react";
import { InterestsCard } from "@/components/perfil/interestsCard";
import { NotificationsCard } from "@/components/perfil/notificationsCard";
import { PersonalDataCard } from "@/components/perfil/personalDataCard";
import { ProfileHeader } from "@/components/perfil/profileHeader";
import { SecurityCard } from "@/components/perfil/securityCard";
import Sidebar from "@/components/sidebar";

export default function PerfilPage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
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
      <main className="min-h-screen bg-wisen-superficie sm:ml-[128px] lg:ml-[220px]">
        <div className="mx-auto w-full max-w-[1600px] space-y-8 px-4 py-6 sm:px-5 lg:px-7 lg:py-8">
          <ProfileHeader />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <PersonalDataCard
              name={profile.name}
              email={profile.email}
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
      </main>
    </div>
  );
}
