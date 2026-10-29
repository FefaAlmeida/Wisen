
import GestaoUsuarios from "@/components/gestaoUsuariosAdm/gestaoUsuarios";

export default function PaginaGestaoUsuarios() {
  return (
    <main className="min-h-screen w-full min-w-0 bg-[#F1F3F6] font-[family-name:var(--font-geist-sans)]">
      <div className="w-full px-5 pt-8 pb-12 md:px-8">
        <header className="mb-6">
          <p className="mb-1 text-[13px] text-[#7183A6]">
            Administrador
          </p>

          <h1 className="text-[34px] leading-tight font-semibold tracking-tight text-[#101A40] md:text-[38px]">
            Gestão de Usuários
          </h1>

          <p className="mt-1 text-[15px] text-[#7183A6]">
            Administre as contas registradas no sistema, gerencie
            permissões e realize ações de moderação.
          </p>
        </header>

        <GestaoUsuarios />
      </div>
    </main>
  );
}
