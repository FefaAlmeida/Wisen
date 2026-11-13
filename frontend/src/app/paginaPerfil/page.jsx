"use client";

import { useEffect, useRef, useState } from "react";
import { BarraBusca } from "@/components/barraBusca";
import { Footer } from "@/components/footer";
import { ConnectionsBackground } from "@/components/homeCliente/connectionsBackground";
import MenuPerfil from "@/components/homeCliente/menuPerfil";
import { InterestsCard } from "@/components/perfil/interestsCard";
import { NotificationsCard } from "@/components/perfil/notificationsCard";
import { PersonalDataCard } from "@/components/perfil/personalDataCard";
import { ProfileHeader } from "@/components/perfil/profileHeader";
import { SecurityCard } from "@/components/perfil/securityCard";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { requisitar } from "@/services/api";

export default function PerfilPage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatarDataUrl: null,
    interests: [],
    notifications: { reviewReminders: true, weeklySummary: false },
  });
  const [savedInterests, setSavedInterests] = useState([]);
  const [interestCategories, setInterestCategories] = useState([]);
  const [savedNotifications, setSavedNotifications] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reload, setReload] = useState(0);
  const [saving, setSaving] = useState({});
  const inFlight = useRef(new Set());
  const [feedback, setFeedback] = useState(null);
  const [interestsFeedback, setInterestsFeedback] = useState(null);
  const [notificationsFeedback, setNotificationsFeedback] = useState(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reload é o gatilho explícito de retentativa do carregamento.
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setLoadError("");
    Promise.all([
      requisitar("/auth/profile", { signal: controller.signal }),
      requisitar("/categories", { signal: controller.signal }),
    ])
      .then(([data, categoryData]) => {
        if (controller.signal.aborted) return;
        if (!Array.isArray(categoryData.categories)) {
          throw new Error("A resposta de categorias não contém uma lista válida.");
        }
        const categories = categoryData.categories.map((category) => category.name);
        const interests = data.preferences.interests.filter((interest) =>
          categories.includes(interest),
        );
        setInterestCategories(categories);
        setProfile({
          name: data.user.name,
          email: data.user.email,
          avatarDataUrl: data.avatarDataUrl,
          interests,
          notifications: data.preferences.notifications,
        });
        setSavedInterests(interests);
        setSavedNotifications(data.preferences.notifications);
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setLoadError(error.message || "Não foi possível carregar o perfil.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [reload]);

  async function persistProfile(block, body, successMessage, setResult) {
    if (loading || loadError || inFlight.current.has(block)) return;
    inFlight.current.add(block);
    setSaving((current) => ({ ...current, [block]: true }));
    setResult(null);
    try {
      const data = await requisitar("/auth/profile", { method: "PUT", body });
      if (block === "personal") {
        setProfile((current) => ({ ...current, name: data.user.name, email: data.user.email }));
      }
      if (block === "interests") setSavedInterests(body.interests);
      if (block === "notifications") setSavedNotifications(body.notifications);
      setResult({ type: "success", text: successMessage });
    } catch (error) {
      setResult({ type: "error", text: error.message || "Erro ao atualizar o perfil." });
    } finally {
      inFlight.current.delete(block);
      setSaving((current) => ({ ...current, [block]: false }));
    }
  }

  function saveProfile(event) {
    event.preventDefault();
    return persistProfile(
      "personal",
      { name: profile.name, email: profile.email },
      "Perfil atualizado com sucesso!",
      setFeedback,
    );
  }

  function saveInterests() {
    return persistProfile(
      "interests",
      { interests: profile.interests },
      "Assuntos de interesse salvos.",
      setInterestsFeedback,
    );
  }

  function saveNotifications() {
    return persistProfile(
      "notifications",
      { notifications: profile.notifications },
      "Notificações salvas.",
      setNotificationsFeedback,
    );
  }

  async function saveAvatar(avatarDataUrl) {
    if (loading || loadError || inFlight.current.has("avatar")) return;
    inFlight.current.add("avatar");
    setSaving((current) => ({ ...current, avatar: true }));
    setFeedback(null);
    try {
      const data = await requisitar("/auth/avatar", { method: "PUT", body: { avatarDataUrl } });
      setProfile((current) => ({ ...current, avatarDataUrl: data.avatarDataUrl }));
      setFeedback({ type: "success", text: "Foto de perfil atualizada." });
    } finally {
      inFlight.current.delete("avatar");
      setSaving((current) => ({ ...current, avatar: false }));
    }
  }

  function toggleInterest(interest) {
    setProfile((current) => ({
      ...current,
      interests: current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest],
    }));
    setInterestsFeedback(null);
  }

  const interestsChanged =
    JSON.stringify([...profile.interests].sort()) !== JSON.stringify([...savedInterests].sort());
  const notificationsChanged =
    savedNotifications !== null &&
    (profile.notifications.reviewReminders !== savedNotifications.reviewReminders ||
      profile.notifications.weeklySummary !== savedNotifications.weeklySummary);

  function updateNotification(name, checked) {
    setProfile((current) => ({
      ...current,
      notifications: { ...current.notifications, [name]: checked },
    }));
    setNotificationsFeedback(null);
  }

  return (
    <div className="min-h-screen">
      <Sidebar activeItem="Configurações" />

      <main className="relative isolate min-h-screen min-w-0 bg-wisen-superficie font-[family-name:var(--font-geist-sans)] sm:ml-[128px] lg:ml-[220px]">
        <ConnectionsBackground />
        <div className="relative z-10 mx-auto w-full max-w-[1600px]">
          <div className="relative z-50 flex items-center justify-end gap-3 px-4 pt-3 sm:px-5 lg:px-7">
            <div className="relative min-w-0 flex-1 sm:w-[360px] sm:flex-none">
              <BarraBusca />
            </div>

            <MenuPerfil />
          </div>

          <div className="space-y-8 px-4 pb-12 pt-8 sm:px-5 lg:px-7">
            <ProfileHeader />
            {loadError && (
              <div role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                <p>{loadError}</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setReload((value) => value + 1)}
                  className="mt-2"
                >
                  Tentar novamente
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <PersonalDataCard
                name={profile.name}
                email={profile.email}
                avatarDataUrl={profile.avatarDataUrl}
                onAvatarUpload={saveAvatar}
                onNameChange={(name) => setProfile((current) => ({ ...current, name }))}
                onEmailChange={(email) => setProfile((current) => ({ ...current, email }))}
                onSubmit={saveProfile}
                loading={loading || Boolean(loadError)}
                saving={Boolean(saving.personal || saving.avatar)}
                feedback={feedback}
              />
              <InterestsCard
                categories={interestCategories}
                interests={profile.interests}
                onToggle={toggleInterest}
                onSave={saveInterests}
                saving={Boolean(saving.interests || loading || loadError)}
                minimumSelections={3}
                hasChanges={interestsChanged}
                feedback={interestsFeedback}
              />
              <NotificationsCard
                notifications={profile.notifications}
                onChange={updateNotification}
                onSave={saveNotifications}
                saving={Boolean(saving.notifications || loading || loadError)}
                hasChanges={notificationsChanged}
                feedback={notificationsFeedback}
              />
              <SecurityCard />
            </div>
          </div>
        </div>
      </main>
      <a
        href="/conta?action=delete"
        className="block p-5 text-center text-sm text-red-700 underline"
      >
        Excluir minha conta
      </a>
      <Footer variant="cliente" background="bg-wisen-superficie" />
    </div>
  );
}
