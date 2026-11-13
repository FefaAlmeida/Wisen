import DemoPage from "@/components/demo/page";
import Demo from "@/components/demo/paginaCuidadoriaEventosAdm";
import Admin from "@/components/platform/admin";

function LivePage() {
  return <Admin initial="events" />;
}

export default function Page() {
  return <DemoPage demo={<Demo />} live={<LivePage />} />;
}
