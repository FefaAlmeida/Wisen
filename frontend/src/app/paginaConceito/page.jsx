import { Suspense } from "react";
import { ConceptPage } from "@/components/platform/learning";
export default function Page() {
  return (
    <Suspense fallback={<p>Carregando…</p>}>
      <ConceptPage />
    </Suspense>
  );
}
