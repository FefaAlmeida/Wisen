import { AdminSidebar } from "@/components/admin/adminSidebar";
import { AdminTopBar } from "@/components/admin/adminTopBar";
import { Footer } from "@/components/footer";
import { ConnectionsBackground } from "@/components/homeCliente/connectionsBackground";

export function AdminLayout({ activeItem, children }) {
  return (
    <div className="min-h-screen bg-wisen-superficie font-[family-name:var(--font-geist-sans)]">
      <AdminSidebar activeItem={activeItem} />
      <div className="relative isolate min-h-screen bg-wisen-superficie sm:ml-[128px] lg:ml-[220px]">
        <ConnectionsBackground />
        <div className="relative z-10 pt-[60px]">
          <AdminTopBar />
          {children}
          <Footer variant="admin" background="bg-wisen-superficie" />
        </div>
      </div>
    </div>
  );
}
