"use client";

import { useEffect, useRef, useState } from "react";
import { AdminPageHeader } from "@/components/admin/adminPageHeader";
import { AdminSummary } from "@/components/admin/adminSummary";
import { AppTopBar } from "@/components/app/appTopBar";
import { usePublicDemo } from "@/components/demo/mode";
import { Footer } from "@/components/footer";
import { ConnectionsBackground } from "@/components/homeCliente/connectionsBackground";
import { InterestsCard } from "@/components/perfil/interestsCard";
import { NotificationsCard } from "@/components/perfil/notificationsCard";
import { PersonalDataCard } from "@/components/perfil/personalDataCard";
import { ProfileHeader } from "@/components/perfil/profileHeader";
import { SecurityCard } from "@/components/perfil/securityCard";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { requisitar } from "@/services/api";

export default function PerfilPage({ admin = false } = {}) {
  const publicDemo = usePublicDemo();
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

  async function persistProfile(block, body, successMessage) {
    if (loading || loadError || inFlight.current.has(block)) return;
    inFlight.current.add(block);
    setSaving((current) => ({ ...current, [block]: true }));
    try {
      const data = await requisitar("/auth/profile", { method: "PUT", body });
      if (block === "personal") {
        setProfile((current) => ({ ...current, name: data.user.name, email: data.user.email }));
      }
      if (block === "interests") setSavedInterests(body.interests);
      if (block === "notifications") setSavedNotifications(body.notifications);
      toast.success(successMessage);
    } catch (error) {
      toast.error(error.message || "Erro ao atualizar o perfil.");
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
    );
  }

  function saveInterests() {
    return persistProfile(
      "interests",
      { interests: profile.interests },
      "Assuntos de interesse salvos.",
    );
  }

  function saveNotifications() {
    return persistProfile(
      "notifications",
      { notifications: profile.notifications },
      "Notificações salvas.",
    );
  }

  async function saveAvatar(avatarDataUrl) {
    if (loading || loadError || inFlight.current.has("avatar")) return;
    inFlight.current.add("avatar");
    setSaving((current) => ({ ...current, avatar: true }));
    try {
      const data = await requisitar("/auth/avatar", { method: "PUT", body: { avatarDataUrl } });
      setProfile((current) => ({ ...current, avatarDataUrl: data.avatarDataUrl }));
      toast.success("Foto de perfil atualizada.");
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
  }

  const profileContent = (
    <div className="wisen-container space-y-7 pt-7 pb-12">
      {admin ? (
        <>
          <AdminPageHeader title="Meu" highlight="perfil." />
          <AdminSummary
            title="Configurações da conta"
            description="Atualize seu nome, e-mail e foto, altere a senha e escolha seus assuntos de interesse e as notificações que deseja receber."
          />
        </>
      ) : (
        <ProfileHeader />
      )}
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

      <div
        data-wisen-profile
        className="grid grid-cols-1 gap-6 xl:grid-flow-col xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:grid-rows-[auto_auto]"
      >
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
        />
        {!publicDemo && <SecurityCard admin={admin} showDeleteAccount={!admin} />}
        <InterestsCard
          categories={interestCategories}
          interests={profile.interests}
          onToggle={toggleInterest}
          onSave={saveInterests}
          saving={Boolean(saving.interests || loading || loadError)}
          minimumSelections={3}
          hasChanges={interestsChanged}
          selectionTiles
          systemColors
        />
        <NotificationsCard
          notifications={profile.notifications}
          onChange={updateNotification}
          onSave={saveNotifications}
          saving={Boolean(saving.notifications || loading || loadError)}
          hasChanges={notificationsChanged}
        />
      </div>
    </div>
  );

  if (admin) {
    return (
      <section className="relative min-w-0 font-[family-name:var(--font-geist-sans)]">
        <div className="relative z-10 mx-auto w-full max-w-[1600px]">{profileContent}</div>
      </section>
    );
  }

  return (
    <div className="min-h-screen">
      <Sidebar activeItem="Configurações" />
      <main className="relative isolate min-h-screen min-w-0 pt-[156px] bg-wisen-superficie font-[family-name:var(--font-geist-sans)] sm:ml-[76px] sm:pt-[76px] lg:ml-[240px]">
        <ConnectionsBackground />
        <div className="relative z-10 mx-auto w-full max-w-[1600px]">
          <AppTopBar />
          {profileContent}
        </div>
      </main>
      <Footer variant="cliente" background="bg-wisen-superficie" />
    </div>
  );
}
