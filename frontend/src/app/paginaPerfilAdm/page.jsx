import { AdminLayout } from "@/components/admin/adminLayout";
import PerfilPage from "@/components/perfil/perfilPage";

export default function PaginaPerfilAdm() {
  return (
    <AdminLayout activeItem={null}>
      <PerfilPage admin />
    </AdminLayout>
  );
}
