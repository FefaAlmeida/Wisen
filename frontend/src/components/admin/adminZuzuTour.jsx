"use client";

import { useEffect, useState } from "react";
import { ZuzuTour } from "@/components/app/zuzuTour";
import { requisitar } from "@/services/api";

const steps = [
  {
    href: "/paginaInicioAdm",
    portrait: "/tour-cliente/boas-vindas.png",
    owlPosition: "-mt-2",
    title: "Boas-vindas à administração do Wisen",
    description:
      "Olá, eu sou a Zuzu! Vou apresentar as ferramentas do painel. A Visão geral é um bom ponto de partida para conferir indicadores como o total de usuários e de conteúdos publicados.",
  },
  {
    href: "/paginaCuradoriaEventosAdm",
    portrait: "/tour-cliente/noticias.png",
    owlPosition: "self-end",
    title: "Revisão de eventos",
    description:
      "Na fila de Revisão de eventos, abra um evento pendente e confira se os artigos tratam do mesmo acontecimento. Se um artigo estiver fora de contexto, você pode movê-lo para outro evento ou devolvê-lo à fila de artigos sem evento.",
  },
  {
    href: "/paginaGestaoUsuariosAdm",
    portrait: "/tour-cliente/conceitos.png",
    owlPosition: "self-center",
    title: "Gestão de usuários",
    description:
      "Para localizar uma conta, busque pelo nome ou e-mail. Abra a conta para gerenciar o acesso ou ajustar o limite diário de gerações. Se precisar conferir mudanças anteriores, veja o Histórico de alterações.",
  },
  {
    href: "/paginaGestaoFonteAdm",
    portrait: "/tour-cliente/revisoes.png",
    owlPosition: "-mt-2",
    title: "Gestão de fontes",
    description:
      "Em Fontes cadastradas, você pode ver quando cada fonte foi consultada, pausar coletas ou solicitar uma coleta manual. Se precisar investigar uma falha, abra Registros de coleta.",
  },
  {
    href: "/paginaGestaoCategoriasAdm",
    portrait: "/tour-cliente/aprendizado.png",
    owlPosition: "self-center -translate-y-2",
    title: "Gestão de categorias",
    description:
      "Aqui você escolhe os assuntos que os usuários podem selecionar nas preferências. Depois de marcar as categorias que devem ficar disponíveis, selecione Salvar disponibilidade para aplicar as mudanças.",
  },
  {
    href: "/paginaMonitorIa",
    portrait: "/tour-cliente/salvos.png",
    owlPosition: "self-end",
    title: "Monitor de IA",
    description:
      "No Monitor de IA, você pode conferir o orçamento mensal e os custos estimados das chamadas. Se uma tarefa falhar ou for pausada, consulte os detalhes em Processamento e tente executá-la novamente quando fizer sentido.",
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
