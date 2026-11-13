import { AdminSidebar } from "@/components/admin/adminSidebar";
import { Footer } from "@/components/footer";

export function AdminLayout({ activeItem, children }) {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <AdminSidebar activeItem={activeItem} />
      <div className="min-h-screen sm:ml-[128px] lg:ml-[220px]">
        {children}
        <Footer variant="admin" />
      </div>
    </div>
  );
}
