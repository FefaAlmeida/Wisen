import { Suspense } from "react";
import Demo from "@/components/demo/deferred/paginaConceito";
import DemoPage from "@/components/demo/page";
import { ConceptPage } from "@/components/platform/learning";

function LivePage() {
  return (
    <Suspense fallback={<p>Carregando…</p>}>
      <ConceptPage />
    </Suspense>
  );
}

export default function Page() {
  return <DemoPage demo={<Demo />} live={<LivePage />} />;
}
