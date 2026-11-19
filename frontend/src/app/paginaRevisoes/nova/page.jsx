import { Suspense } from "react";
import DemoPage from "@/components/demo/page";
import Demo from "@/components/demo/paginaRevisoes";
import { Reviews } from "@/components/platform/learning";

export default function Page() {
  return (
    <DemoPage
      demo={<Demo view="nova" />}
      live={
        <Suspense fallback={<p>Carregando…</p>}>
          <Reviews />
        </Suspense>
      }
    />
  );
}
