import { Suspense } from "react";
import EventPage from "@/components/platform/event";
export default function Page() {
  return (
    <Suspense fallback={<p>Carregando…</p>}>
      <EventPage />
    </Suspense>
  );
}
