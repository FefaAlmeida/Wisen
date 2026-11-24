import { AdminLayout } from "@/components/admin/adminLayout";
import { AdminPage } from "@/components/admin/adminPageHeader";
import GestaoCategorias from "@/components/gestaoCategoriasAdm/gestaoCategorias";

export default function PaginaGestaoCategorias() {
  return (
    <AdminLayout activeItem="Gestão de categorias">
      <AdminPage title="Gestão de" highlight="categorias.">
        <GestaoCategorias />
      </AdminPage>
    </AdminLayout>
  );
}
