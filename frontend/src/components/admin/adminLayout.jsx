import { AdminSidebar } from "@/components/admin/adminSidebar";
import { AdminTopBar } from "@/components/admin/adminTopBar";
import { Footer } from "@/components/footer";
import { ConnectionsBackground } from "@/components/homeCliente/connectionsBackground";

export function AdminLayout({ activeItem, children }) {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <AdminSidebar activeItem={activeItem} />
      <div className="relative isolate min-h-screen bg-[radial-gradient(ellipse_at_55%_0%,#E6EEF6_0%,#F1F3F6_65%,#F1F3F6_100%)] sm:ml-[128px] lg:ml-[220px]">
        <ConnectionsBackground />
        <div className="relative z-10 pt-[60px]">
          <AdminTopBar />
          {children}
          <Footer variant="admin" />
        </div>
      </div>
    </div>
  );
}
