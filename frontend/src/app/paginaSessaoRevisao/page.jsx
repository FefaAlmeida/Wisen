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

export default function Page() {
  return <DemoPage demo={<Demo />} live={<LivePage />} />;
}
