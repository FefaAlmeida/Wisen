import { Suspense } from "react";
import DemoPage from "@/components/demo/page";
import Demo from "@/components/demo/paginaRevisoes";
import { Reviews } from "@/components/platform/learning";

function LivePage() {
  return (
    <Suspense fallback={<p>Carregando…</p>}>
      <Reviews />
    </Suspense>
  );
}

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const temas = typeof params.temas === "string" ? params.temas.split(",") : [];
  const formato = params.formato === "flashcards" ? "flashcards" : "quiz";
  return (
    <DemoPage
      demo={<Demo view="sessao" initialTemas={temas} initialModo={formato} />}
      live={<LivePage />}
    />
  );
}
