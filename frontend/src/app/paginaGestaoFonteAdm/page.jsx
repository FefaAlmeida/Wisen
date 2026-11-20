import Demo from "@/components/demo/deferred/paginaGestaoFonteAdm";
import DemoPage from "@/components/demo/page";
import PaginaFontes from "@/components/demo/paginaGestaoFonteAdm";

export const metadata = { title: "Gestão de fontes | Wisen" };

function LivePage() {
  return <PaginaFontes demo={false} />;
}

export default function Page() {
  return <DemoPage demo={<Demo />} live={<LivePage />} />;
}
