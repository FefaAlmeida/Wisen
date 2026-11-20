import Demo from "@/components/demo/deferred/paginaCuidadoriaEventosAdm";
import DemoPage from "@/components/demo/page";
import PaginaRevisao from "@/components/demo/paginaCuidadoriaEventosAdm";

export const metadata = { title: "Revisão de eventos | Wisen" };

function LivePage() {
  return <PaginaRevisao demo={false} />;
}

export default function Page() {
  return <DemoPage demo={<Demo />} live={<LivePage />} />;
}
