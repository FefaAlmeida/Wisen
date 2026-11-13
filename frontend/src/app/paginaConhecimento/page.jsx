import { Suspense } from "react";
import { Library } from "@/components/platform/learning";
export default function Page() {
  return (
    <Suspense fallback={<p>Carregando…</p>}>
      <Library knowledge />
    </Suspense>
  );
}
