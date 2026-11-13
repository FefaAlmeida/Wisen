import { Suspense } from "react";
import DemoPage from "@/components/demo/page";
import Demo from "@/components/demo/paginaInicialCliente";
import Feed from "@/components/platform/feed";

function LivePage() {
  return (
    <Suspense fallback={<p>Carregando…</p>}>
      <Feed />
    </Suspense>
  );
}

export default function Page() {
  return <DemoPage demo={<Demo />} live={<LivePage />} />;
}
