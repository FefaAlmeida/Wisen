import { AdminLayout } from "@/components/admin/adminLayout";
import { AdminPage } from "@/components/admin/adminPageHeader";
import CuradoriaEventos from "@/components/cuidadoriaEventosAdm/cuidadoriaEventos";

export default function PaginaCuradoriaEventos({ demo = true }) {
  return (
    <AdminLayout activeItem="Revisão de eventos">
      <AdminPage
        title="Revisão de"
        highlight="eventos."
        description="Confira os acontecimentos identificados pela IA e organize os artigos que pertencem a cada um."
      >
        <CuradoriaEventos demo={demo} />
      </AdminPage>
    </AdminLayout>
  );
}
