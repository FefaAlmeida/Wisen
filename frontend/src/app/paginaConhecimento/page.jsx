import { Suspense } from "react";
import Demo from "@/components/demo/deferred/paginaConhecimento";
import DemoPage from "@/components/demo/page";
import { Library } from "@/components/platform/learning";

function LivePage() {
  return (
    <Suspense fallback={<p>Carregando…</p>}>
      <Library knowledge />
    </Suspense>
  );
}

export default function Page() {
  return <DemoPage demo={<Demo />} live={<LivePage />} />;
}
