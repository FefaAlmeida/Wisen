import { AdminLayout } from "@/components/admin/adminLayout";
import { AdminPage } from "@/components/admin/adminPageHeader";
import GestaoFontes from "@/components/gestaoFontesAdm/gestaoFontes";

export default function PaginaFontes({ demo = true }) {
  return (
    <AdminLayout activeItem="Gestão de fontes">
      <AdminPage
        title="Gestão de"
        highlight="fontes."
        description="Cadastre e monitore os veículos integrados à plataforma."
      >
        <GestaoFontes demo={demo} />
      </AdminPage>
    </AdminLayout>
  );
}
