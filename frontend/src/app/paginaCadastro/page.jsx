
import ApresentacaoLogin from "@/components/apresentacaoLogin";
import FormularioCadastro from "@/components/formularioCadastro";

export default function CadastroPage() {
  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-[46%_54%]">
      <ApresentacaoLogin />

      <section className="relative flex min-h-[600px] items-center justify-center overflow-hidden bg-[#EDF5FC] px-5 py-12 sm:px-8">
        {/* Elementos decorativos */}
        <span className="absolute top-8 right-12 h-2 w-2 rounded-full bg-[#F0D86B]" />
        <span className="absolute top-12 right-16 h-3 w-3 rounded-full bg-[#F0D86B]" />
        <span className="absolute top-20 right-28 h-1.5 w-1.5 rounded-full bg-[#F0D86B]" />
        <span className="absolute top-24 right-36 h-2.5 w-2.5 rounded-full bg-[#F0D86B]" />
        <span className="absolute top-36 right-8 h-2.5 w-2.5 rounded-full bg-[#F0D86B]" />
        <span className="absolute top-10 right-44 h-1.5 w-1.5 rounded-full bg-[#F0D86B]" />
        <span className="absolute top-32 right-52 h-2 w-2 rounded-full bg-[#F0D86B]" />

        <div className="relative z-10 flex w-full justify-center">
          <FormularioCadastro />
        </div>
      </section>
    </main>
  );
}
