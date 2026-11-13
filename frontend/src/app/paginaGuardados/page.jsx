import { Suspense } from "react";
import DemoPage from "@/components/demo/page";
import Demo from "@/components/demo/paginaGuardados";
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
