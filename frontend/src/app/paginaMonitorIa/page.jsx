import Demo from "@/components/demo/deferred/paginaMonitorIa";
import DemoPage from "@/components/demo/page";
import Admin from "@/components/platform/admin";

function LivePage() {
  return <Admin initial="charges" />;
}

export default function Page() {
  return <DemoPage demo={<Demo />} live={<LivePage />} />;
}
