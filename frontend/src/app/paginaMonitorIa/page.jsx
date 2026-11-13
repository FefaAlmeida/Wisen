import DemoPage from "@/components/demo/page";
import Demo from "@/components/demo/paginaMonitorIa";
import Admin from "@/components/platform/admin";

function LivePage() {
  return <Admin initial="charges" />;
}

export default function Page() {
  return <DemoPage demo={<Demo />} live={<LivePage />} />;
}
