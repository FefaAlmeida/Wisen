import { AdminSidebar } from "@/components/admin/adminSidebar";
import { Footer } from "@/components/footer";

export function AdminLayout({ activeItem, children }) {
  return (
    <div className="min-h-screen">
      <AdminSidebar activeItem={activeItem} />
      <div className="min-h-screen sm:ml-[220px]">
        {children}
        <Footer />
      </div>
    </div>
  );
}
