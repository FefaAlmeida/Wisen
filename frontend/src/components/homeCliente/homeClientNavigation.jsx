"use client";

import { useCallback, useState } from "react";
import { AppSidebar } from "@/components/app/appSidebar";
import { AppTopBar } from "@/components/app/appTopBar";
import { ZuzuTour } from "@/components/app/zuzuTour";
import { InitialInterestDialog } from "./initialInterestDialog";

const steps = [
  {
    href: "/paginaInicialCliente",
    portrait: "/tour-cliente/boas-vindas.png",
    owlPosition: "-mt-2",
    title: "Boas-vindas ao Wisen!",
    description:
      "Oi, eu sou a Zuzu, a coruja do Wisen! No Início, você encontra seu feed e as revisões do dia. Vem comigo que eu te mostro por onde começar.",
  },
  {
    href: "/paginaExplorar",
    portrait: "/tour-cliente/noticias.png",
    owlPosition: "self-end",
    title: "Notícias",
    description:
      "Explore as notícias e descubra os conceitos que ajudam a entender cada acontecimento.",
  },
  {
    href: "/paginaBiblioteca",
    portrait: "/tour-cliente/conceitos.png",
    owlPosition: "self-center",
    title: "Conceitos",
    description:
      "Consulte a biblioteca para entender os termos que aparecem nas notícias e explorar exemplos e leituras relacionadas.",
  },
  {
    href: "/paginaRevisoes",
    portrait: "/tour-cliente/revisoes.png",
    owlPosition: "-mt-2",
    title: "Revisões",
    description:
      "Confira os conceitos previstos para hoje e faça uma sessão para relembrar o que você estudou.",
  },
  {
    href: "/paginaConhecimento",
    portrait: "/tour-cliente/aprendizado.png",
    owlPosition: "self-center -translate-y-2",
    title: "Aprendizado",
    description: "Acompanhe sua evolução e veja com que frequência você estuda ao longo do tempo.",
  },
  {
    href: "/paginaGuardados",
    portrait: "/tour-cliente/salvos.png",
    owlPosition: "self-end",
    title: "Salvos",
    description:
      "Use o ícone de marcador para guardar notícias e conceitos. Você pode voltar a eles em Salvos quando quiser.",
  },
];

export function HomeClientNavigation() {
  const [accountId, setAccountId] = useState(null);
  const handleProfileReady = useCallback((user) => setAccountId(user?.id ?? null), []);
  return (
    <>
      <InitialInterestDialog onComplete={handleProfileReady} />
      <AppSidebar activeItem="Início" />
      <AppTopBar
        belowProfile={
          accountId != null && (
            <ZuzuTour
              steps={steps}
              storageKey={`wisen:client-tour:v1:${accountId}`}
              portrait={steps[0].portrait}
            />
          )
        }
      />
    </>
  );
}
