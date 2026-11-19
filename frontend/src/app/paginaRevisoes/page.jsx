import { Suspense } from "react";
import Demo from "@/components/centralRevisao/demo-route";
import LiveReviews from "@/components/centralRevisao/live";
import DemoPage from "@/components/demo/page";

function LivePage() {
  return (
    <Suspense fallback={<p>Carregando…</p>}>
      <LiveReviews view="painel" />
    </Suspense>
  );
}

export default function Page() {
  return <DemoPage demo={<Demo />} live={<LivePage />} />;
}
