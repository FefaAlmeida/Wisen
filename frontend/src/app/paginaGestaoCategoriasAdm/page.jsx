import { AdminLayout } from "@/components/admin/adminLayout";
import { AdminPage } from "@/components/admin/adminPageHeader";
import GestaoCategorias from "@/components/gestaoCategoriasAdm/gestaoCategorias";

export default function PaginaGestaoCategorias() {
  return (
    <AdminLayout activeItem="Gestão de categorias">
      <AdminPage
        title="Gestão de"
        highlight="categorias."
        description="Escolha quais assuntos estarão disponíveis para os usuários."
      >
        <GestaoCategorias />
      </AdminPage>
    </AdminLayout>
  );
}
