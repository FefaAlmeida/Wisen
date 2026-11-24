"use client";

import { useEffect, useState } from "react";
import { ZuzuTour } from "@/components/app/zuzuTour";
import { requisitar } from "@/services/api";

const steps = [
  {
    href: "/paginaInicioAdm",
    title: "Boas-vindas à administração do Wisen",
    description:
      "Sou a Zuzu. Na Visão geral, acompanhe os indicadores do Wisen e saiba onde começar seu trabalho.",
  },
  {
    href: "/paginaCuradoriaEventosAdm",
    title: "Revisão de eventos",
    description:
      "Confira os artigos associados a cada evento e ajuste o agrupamento quando necessário.",
  },
  {
    href: "/paginaGestaoUsuariosAdm",
    title: "Gestão de usuários",
    description: "Encontre contas, confira o histórico de cada usuário e gerencie suas permissões.",
  },
  {
    href: "/paginaGestaoFonteAdm",
    title: "Gestão de fontes",
    description: "Cadastre e acompanhe as fontes de notícias e consulte os registros das coletas.",
  },
  {
    href: "/paginaGestaoCategoriasAdm",
    title: "Gestão de categorias",
    description: "Gerencie as categorias usadas para organizar os conteúdos do Wisen.",
  },
  {
    href: "/paginaMonitorIa",
    title: "Monitor de IA",
    description:
      "Acompanhe o consumo da IA e consulte os registros de execução para investigar falhas.",
  },
];

export function AdminZuzuTour() {
  const [accountId, setAccountId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    requisitar("/auth/session", { signal: controller.signal })
      .then(({ user }) => {
        if (!controller.signal.aborted && user?.role === "admin") setAccountId(user.id);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  if (accountId == null) return null;

  return (
    <ZuzuTour
      steps={steps}
      storageKey={`wisen:admin-tour:v1:${accountId}`}
      portrait="/zuzu-admin.png"
    />
  );
}
