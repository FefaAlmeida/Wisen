import DemoPage from "@/components/demo/page";
import Demo from "@/components/demo/paginaGestaoUsuariosAdm";
import Admin from "@/components/platform/admin";

function LivePage() {
  return <Admin initial="users" />;
}

export default function Page() {
  return <DemoPage demo={<Demo />} live={<LivePage />} />;
}
