import { AdminLayout } from "@/components/admin/adminLayout";
import { AdminPage } from "@/components/admin/adminPageHeader";
import GestaoUsuarios from "@/components/gestaoUsuariosAdm/gestaoUsuarios";

export default function PaginaGestaoUsuarios({ demo = true }) {
  return (
    <AdminLayout activeItem="Gestão de usuários">
      <AdminPage
        title="Gestão de"
        highlight="usuários."
        description="Encontre contas, acompanhe o acesso e gerencie as informações dos usuários."
      >
        <GestaoUsuarios demo={demo} />
      </AdminPage>
    </AdminLayout>
  );
}
