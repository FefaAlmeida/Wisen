import DemoPage from "@/components/demo/page";
import Demo from "@/components/demo/paginaGestaoFonteAdm";
import Admin from "@/components/platform/admin";

function LivePage() {
  return <Admin initial="sources" />;
}

export default function Page() {
  return <DemoPage demo={<Demo />} live={<LivePage />} />;
}
