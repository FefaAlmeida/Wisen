import { AdminLayout } from "@/components/admin/adminLayout";
import GestaoCategorias from "@/components/gestaoCategoriasAdm/gestaoCategorias";

export default function PaginaGestaoCategorias() {
  return (
    <AdminLayout activeItem="Gestão de categorias">
      <main className="min-h-screen w-full min-w-0 bg-[radial-gradient(ellipse_at_55%_0%,#E6EEF6_0%,#F1F3F6_65%,#F1F3F6_100%)] font-[family-name:var(--font-geist-sans)]">
        <div className="w-full px-5 pt-8 pb-12 md:px-8">
          <header className="mb-6">
            <p className="mb-1 text-[13px] text-[#7183A6]">Administrador</p>
            <h1 className="text-[32px] font-semibold leading-tight tracking-tight text-[#101A40] md:text-[36px]">
              Gestão de categorias
            </h1>
            <p className="mt-1 text-[15px] text-[#7183A6]">
              Escolha quais assuntos estarão disponíveis para os usuários.
            </p>
          </header>

          <GestaoCategorias />
        </div>
      </main>
    </AdminLayout>
  );
}
