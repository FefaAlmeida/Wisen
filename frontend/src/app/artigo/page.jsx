import { Suspense } from "react";
import Demo from "@/components/demo/artigo";
import DemoPage from "@/components/demo/page";
import ArticlePage from "@/components/platform/article";

function LivePage() {
  return (
    <Suspense fallback={<p>Carregando…</p>}>
      <ArticlePage />
    </Suspense>
  );
}

export default function Page() {
  return <DemoPage demo={<Demo />} live={<LivePage />} />;
}
