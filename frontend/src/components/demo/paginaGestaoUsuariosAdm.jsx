import { AdminLayout } from "@/components/admin/adminLayout";
import GestaoUsuarios from "@/components/gestaoUsuariosAdm/gestaoUsuarios";

export default function PaginaGestaoUsuarios() {
  return (
    <AdminLayout activeItem="Gestão de usuários">
      <main className="min-h-screen w-full min-w-0 bg-[#F1F3F6] font-[family-name:var(--font-geist-sans)]">
        <div className="w-full px-5 pt-8 pb-12 md:px-8">
          <header className="mb-6">
            <p className="mb-1 text-sm text-[#7183A6]">Administrador</p>

            <h1 className="text-[36px] leading-[1.05] font-medium tracking-tight text-[#101A40] md:text-[44px]">
              Gestão de Usuários
            </h1>

            <p className="mt-2 text-base leading-6 text-[#7183A6]">
              Administre as contas registradas no sistema, gerencie permissões e realize ações de
              moderação.
            </p>
          </header>

          <GestaoUsuarios />
        </div>
      </main>
    </AdminLayout>
  );
}
