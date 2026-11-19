import { Suspense } from "react";
import Demo from "@/components/demo/deferred/paginaExplorar";
import DemoPage from "@/components/demo/page";
import Feed from "@/components/platform/feed";

function LivePage() {
  return (
    <Suspense fallback={<p>Carregando…</p>}>
      <Feed explore />
    </Suspense>
  );
}

export default function Page() {
  return <DemoPage demo={<Demo />} live={<LivePage />} />;
}
