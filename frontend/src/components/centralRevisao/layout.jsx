import { AppTopBar } from "@/components/app/appTopBar";
import { Footer } from "@/components/footer";
import { ConnectionsBackground } from "@/components/homeCliente/connectionsBackground";
import Sidebar from "@/components/sidebar";

export default function RevisoesLayout({ children }) {
  return (
    <div className="min-h-screen">
      <Sidebar activeItem="Revisões" />

      <main className="relative isolate min-h-screen min-w-0 pt-[76px] bg-wisen-superficie font-[family-name:var(--font-geist-sans)] sm:ml-[76px] lg:ml-[240px]">
        <ConnectionsBackground />
        <div className="relative z-10 mx-auto w-full max-w-[1600px]">
          {/* Barra de pesquisa e perfil */}
          <AppTopBar />

          {children}
        </div>
        <Footer variant="cliente" sidebarOffset={false} />
      </main>
    </div>
  );
}
