import { Suspense } from "react";
import Feed from "@/components/platform/feed";
export default function Page() {
  return (
    <Suspense fallback={<p>Carregando…</p>}>
      <Feed explore />
    </Suspense>
  );
}
