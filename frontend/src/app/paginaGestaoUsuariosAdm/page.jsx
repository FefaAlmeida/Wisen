import Demo from "@/components/demo/deferred/paginaGestaoUsuariosAdm";
import DemoPage from "@/components/demo/page";
import Admin from "@/components/platform/admin";

function LivePage() {
  return <Admin initial="users" />;
}

export default function Page() {
  return <DemoPage demo={<Demo />} live={<LivePage />} />;
}
