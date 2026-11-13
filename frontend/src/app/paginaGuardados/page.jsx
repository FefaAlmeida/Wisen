import { Suspense } from "react";
import { Saved } from "@/components/platform/learning";
export default function Page() {
  return (
    <Suspense fallback={<p>Carregando…</p>}>
      <Saved />
    </Suspense>
  );
}
