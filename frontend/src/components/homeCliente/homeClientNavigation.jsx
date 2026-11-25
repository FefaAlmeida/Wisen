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
      "Oi, eu sou a Zuzu! Vou te mostrar como usar as notícias para aprender no Wisen. No Início, você pode escolher uma leitura do seu feed ou retomar os estudos nas revisões do dia.",
  },
  {
    href: "/paginaExplorar",
    portrait: "/tour-cliente/noticias.png",
    owlPosition: "self-end",
    title: "Notícias",
    description:
      "Quer acompanhar um assunto? Em Notícias, você pode usar a busca ou filtrar por tema. Ao abrir um acontecimento, confira o contexto, as fontes e os conceitos que ajudam a entender a notícia.",
  },
  {
    href: "/paginaBiblioteca",
    portrait: "/tour-cliente/conceitos.png",
    owlPosition: "self-center",
    title: "Conceitos",
    description:
      "Ficou com dúvida sobre um termo de uma notícia? Busque por ele em Conceitos. Ao abrir um conceito, você encontra uma explicação e pode consultar exemplos e conteúdos relacionados.",
  },
  {
    href: "/paginaRevisoes",
    portrait: "/tour-cliente/revisoes.png",
    owlPosition: "-mt-2",
    title: "Revisões",
    description:
      "Quando quiser relembrar o que estudou, abra Revisões. Em Nova revisão, você pode escolher os assuntos e praticar com quizzes ou flashcards, no seu ritmo.",
  },
  {
    href: "/paginaConhecimento",
    portrait: "/tour-cliente/aprendizado.png",
    owlPosition: "self-center -translate-y-2",
    title: "Aprendizado",
    description:
      "Em Aprendizado, você vê quais conceitos já consolidou e quais vale a pena praticar de novo. Use esse resumo para escolher o que revisar a seguir.",
  },
  {
    href: "/paginaGuardados",
    portrait: "/tour-cliente/salvos.png",
    owlPosition: "self-end",
    title: "Salvos",
    description:
      "Encontrou uma notícia ou um conceito que quer retomar depois? Use o ícone de marcador para guardar. Em Salvos, você encontra tudo o que guardou para ler ou estudar quando quiser.",
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
