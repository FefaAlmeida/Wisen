import { Suspense } from "react";
import Demo from "@/components/demo/deferred/paginaEvento";
import DemoPage from "@/components/demo/page";
import EventPage from "@/components/platform/event";

function LivePage() {
  return (
    <Suspense fallback={<p>Carregando…</p>}>
      <EventPage />
    </Suspense>
  );
}

export default function Page() {
  return <DemoPage demo={<Demo />} live={<LivePage />} />;
}
