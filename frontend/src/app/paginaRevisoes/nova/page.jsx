import { Suspense } from "react";
import Demo from "@/components/centralRevisao/demo-route";
import LiveReviews from "@/components/centralRevisao/live";
import DemoPage from "@/components/demo/page";

export default function Page() {
  return (
    <DemoPage
      demo={<Demo view="nova" />}
      live={
        <Suspense fallback={<p>Carregando…</p>}>
          <LiveReviews view="nova" />
        </Suspense>
      }
    />
  );
}
