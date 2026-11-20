import Demo from "@/components/demo/deferred/paginaGestaoUsuariosAdm";
import DemoPage from "@/components/demo/page";
import PaginaGestaoUsuarios from "@/components/demo/paginaGestaoUsuariosAdm";

export const metadata = { title: "Gestão de usuários | Wisen" };

function LivePage() {
  return <PaginaGestaoUsuarios demo={false} />;
}

export default function Page() {
  return <DemoPage demo={<Demo />} live={<LivePage />} />;
}
