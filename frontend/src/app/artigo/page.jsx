import { Suspense } from "react";
import ArticlePage from "@/components/platform/article";
export default function Page() {
  return (
    <Suspense fallback={<p>Carregando…</p>}>
      <ArticlePage />
    </Suspense>
  );
}
