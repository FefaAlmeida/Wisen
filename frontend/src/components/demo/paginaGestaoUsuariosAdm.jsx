import { AdminLayout } from "@/components/admin/adminLayout";
import { AdminPage } from "@/components/admin/adminPageHeader";
import GestaoUsuarios from "@/components/gestaoUsuariosAdm/gestaoUsuarios";

export default function PaginaGestaoUsuarios({ demo = true }) {
  return (
    <AdminLayout activeItem="Gestão de usuários">
      <AdminPage title="Gestão de" highlight="usuários.">
        <GestaoUsuarios demo={demo} />
      </AdminPage>
    </AdminLayout>
  );
}
