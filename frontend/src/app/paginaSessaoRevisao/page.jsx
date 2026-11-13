import { Suspense } from "react";
import { Reviews } from "@/components/platform/learning";
export default function Page() {
  return (
    <Suspense fallback={<p>Carregando…</p>}>
      <Reviews />
    </Suspense>
  );
}
