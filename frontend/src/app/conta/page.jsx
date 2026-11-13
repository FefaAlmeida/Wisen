import { Suspense } from "react";
import Account from "@/components/platform/account";
export default function Page() {
  return (
    <Suspense fallback={<p>Carregando…</p>}>
      <Account />
    </Suspense>
  );
}
