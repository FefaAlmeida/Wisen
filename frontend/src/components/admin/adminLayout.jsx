import { AdminSidebar } from "@/components/admin/adminSidebar";
import { AdminTopBar } from "@/components/admin/adminTopBar";
import { Footer } from "@/components/footer";
import { ConnectionsBackground } from "@/components/homeCliente/connectionsBackground";

export function AdminLayout({ activeItem, backgroundParticleDensity, children }) {
  return (
    <div className="min-h-screen bg-wisen-superficie font-[family-name:var(--font-geist-sans)]">
      <AdminSidebar activeItem={activeItem} />
      <div className="relative isolate min-h-screen bg-wisen-superficie sm:ml-[76px] lg:ml-[240px]">
        <ConnectionsBackground particleDensity={backgroundParticleDensity} />
        <div className="relative z-10 pt-[76px]">
          <AdminTopBar />
          <main>{children}</main>
          <Footer variant="admin" background="bg-wisen-superficie" />
        </div>
      </div>
    </div>
  );
}
