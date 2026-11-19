import { Suspense } from "react";
import Demo from "@/components/demo/deferred/paginaGuardados";
import DemoPage from "@/components/demo/page";
import { Saved } from "@/components/platform/learning";

function LivePage() {
  return (
    <Suspense fallback={<p>Carregando…</p>}>
      <Saved />
    </Suspense>
  );
}

export default function Page() {
  return <DemoPage demo={<Demo />} live={<LivePage />} />;
}
