import { Suspense } from "react";
import Demo from "@/components/centralRevisao/demo-route";
import LiveReviews from "@/components/centralRevisao/live";
import DemoPage from "@/components/demo/page";

function LivePage({ sessionId }) {
  return (
    <Suspense fallback={<p>Carregando…</p>}>
      <LiveReviews key={sessionId || "none"} view="sessao" />
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
      live={<LivePage sessionId={params.sessao} />}
    />
  );
}
