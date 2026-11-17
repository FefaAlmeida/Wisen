import { Bookmark, Clock3, Compass, GraduationCap, Home, Newspaper, Search } from "lucide-react";
import Image from "next/image";

export function ApresentacaoLanding() {
  const navigation = [
    { label: "Início", icon: Home, active: true },
    { label: "Explorar", icon: Compass },
    { label: "Revisões", icon: Clock3 },
    { label: "Meu conhecimento", icon: GraduationCap },
    { label: "Notícias", icon: Newspaper },
    { label: "Salvos", icon: Bookmark },
  ];
  const articles = [
    {
      category: "Economia",
      time: "há 2 horas",
      title: "Copom mantém taxa Selic em 10,50% ao ano",
      image:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80",
    },
    {
      category: "Meio ambiente",
      time: "há 5 horas",
      title: "Estudo aponta aceleração do derretimento das geleiras",
      image:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80",
    },
    {
      category: "Tecnologia",
      time: "há 8 horas",
      title: "Inteligência artificial ganha espaço na educação",
      image:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=80",
    },
  ];
  const interests = [
    { name: "Economia", percentage: 38 },
    { name: "Meio ambiente", percentage: 27 },
    { name: "Tecnologia", percentage: 22 },
    { name: "Política", percentage: 13 },
  ];

  return (
    <section id="sobre" className="scroll-mt-24 py-8 md:py-12">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start lg:gap-14 xl:gap-20">
        {/* Prévia da página inicial do cliente */}
        <div className="relative order-2 lg:order-1 lg:col-span-7">
          <div className="pointer-events-none absolute -inset-2 rotate-[2deg] rounded-[30px] border border-[#DDDCA9]/70 bg-[#E8E191]/35 sm:-inset-3" />
          <div className="pointer-events-none absolute -bottom-6 left-[10%] right-[10%] h-16 rounded-full bg-[#30466E]/10 blur-3xl" />
          <div className="relative rounded-[25px] border border-[#D5DEE9] bg-gradient-to-br from-white to-[#E7EDF4] p-2.5 shadow-[0_22px_55px_-29px_rgba(16,26,64,0.35)] sm:p-3">
            <div className="flex min-h-[500px] overflow-hidden rounded-[17px] border border-[#DFE6EF] bg-[#F0F4F9] text-[#101A40]">
              <aside className="hidden w-[28%] shrink-0 flex-col bg-[#202D3A] px-3 py-4 text-white sm:flex lg:px-4">
                <div className="mb-4 flex flex-col items-center gap-1.5 border-b border-white/15 pb-3">
                  <Image
                    src="/logoWisen-simbolo.png"
                    alt=""
                    width={44}
                    height={44}
                    className="size-8 rounded-full border border-white/15 bg-[#f3f0e8] object-contain"
                  />
                  <span className="text-sm font-bold tracking-tight">Wisen</span>
                </div>

                <nav className="flex flex-col gap-1.5">
                  {navigation.map(({ label, icon: Icon, active }) => (
                    <div
                      key={label}
                      className={`flex h-8 items-center gap-2 rounded-lg px-2 text-[9px] ${
                        active
                          ? "bg-[#EBDD80] font-semibold text-[#202D3A]"
                          : "text-white/75"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{label}</span>
                    </div>
                  ))}
                </nav>
              </aside>

              <div className="min-w-0 flex-1 p-3 sm:p-4">
                <div className="mb-3 flex items-center justify-between gap-2 border-b border-[#DEE5ED] pb-2">
                  <span className="min-w-0 truncate text-[9px] font-semibold text-[#30466E]">
                    Entenda o que acontece
                  </span>
                  <div className="flex shrink-0 items-center gap-2">
                    <div className="flex h-7 w-[125px] items-center gap-1.5 rounded-full border border-[#D5DEE9] bg-white px-2 text-[8px] text-[#8996A8] sm:w-[155px]">
                      <Search className="h-3 w-3 shrink-0" />
                      <span className="truncate">Buscar notícias, conceitos...</span>
                    </div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EBDD80] text-[8px] font-bold">
                      MA
                    </div>
                  </div>
                </div>

                <div className="grid min-h-[156px] grid-cols-1 items-center gap-1 border-b border-[#DEE5ED] pb-3 sm:grid-cols-[minmax(0,1fr)_100px]">
                  <div className="min-w-0">
                    <p className="mb-2 text-[7px] font-semibold tracking-[0.18em] text-[#93A3BE]">
                      BOM DIA, MARIA
                    </p>
                    <h3 className="text-[17px] leading-[1.08] font-medium tracking-[-0.04em] text-[#101A40]">
                      Suas notícias.
                      <span className="block text-[#D7BF4D]">Seu aprendizado.</span>
                      <span className="block">Um mundo de conexões.</span>
                    </h3>
                    <p className="mt-2 max-w-[270px] text-[8px] leading-relaxed text-[#7182A1]">
                      Acompanhe os acontecimentos reais do mundo e evolua seu conhecimento de forma
                      personalizada.
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-[#F3E69A] px-2 py-1 text-[7px] font-semibold text-[#30466E]">
                      Explorar notícias <span aria-hidden="true">→</span>
                    </span>
                  </div>

                  <div className="relative hidden h-[130px] w-[100px] sm:block">
                    <Image
                      src="/foto_paginaInicialCliente.png"
                      alt=""
                      fill
                      sizes="100px"
                      className="object-contain"
                    />
                  </div>
                </div>

                <section className="mt-3">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="text-[10px] font-semibold text-[#30466E]">Seu feed de hoje</h4>
                    <span className="text-[7px] font-medium text-[#30466E]">Ver todas →</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    {articles.map((article) => (
                      <article
                        key={article.title}
                        className="overflow-hidden rounded-md bg-white shadow-[0_2px_8px_rgba(16,26,64,0.06)]"
                      >
                        <Image
                          src={article.image}
                          width={300}
                          height={120}
                          alt=""
                          sizes="(max-width: 640px) 30vw, 15vw"
                          className="h-12 w-full object-cover"
                        />
                        <div className="p-1.5">
                          <div className="mb-1 flex justify-between gap-1 text-[6px]">
                            <span className="font-semibold uppercase text-[#30466E]">
                              {article.category}
                            </span>
                            <span className="shrink-0 text-[#94A2B9]">{article.time}</span>
                          </div>
                          <h5 className="line-clamp-2 text-[8px] leading-tight font-semibold text-[#101A40]">
                            {article.title}
                          </h5>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="mt-3">
                  <h4 className="mb-2 text-[9px] font-semibold text-[#30466E]">
                    O que você lê diariamente
                  </h4>
                  <div className="grid grid-cols-4 gap-1.5">
                    {interests.map((interest) => (
                      <div key={interest.name} className="rounded-md bg-white p-1.5">
                        <div className="flex justify-between gap-1 text-[6px] text-[#52617E]">
                          <span className="truncate">{interest.name}</span>
                          <span>{interest.percentage}%</span>
                        </div>
                        <div className="mt-1 h-1 overflow-hidden rounded-full bg-[#E4EAF1]">
                          <div
                            className="h-full rounded-full bg-[#D7BF4D]"
                            style={{ width: `${interest.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>

        {/* Texto da apresentação */}
        <div className="order-1 flex flex-col gap-6 lg:order-2 lg:col-span-5 lg:justify-between lg:py-3 lg:pl-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8491A3]">
            Uma nova forma de aprender
          </span>

          <h2 className="max-w-[480px] text-[clamp(2rem,3.8vw,3.375rem)] font-bold leading-[1.12] tracking-[-0.045em] text-[#101A40]">
            Do que acontece no mundo ao que você{" "}
            <span className="decoration-[#E8E191] decoration-[6px] underline underline-offset-[7px]">
              realmente entende.
            </span>
          </h2>

          <p className="max-w-[460px] text-[15px] leading-[1.9] text-[#647184]">
            O Wisen combina inteligência avançada e curadoria de fontes confiáveis para trazer o
            conhecimento certo, na dimensão certa e no momento certo.
          </p>

          <ul className="w-full border-t border-[#D5DEE9] text-[clamp(1.125rem,1.6vw,1.375rem)] font-semibold leading-snug tracking-[-0.025em] text-[#101A40]">
            {["Conexões mais claras", "Uma visão mais completa", "Decisões mais conscientes"].map(
              (beneficio) => (
                <li
                  key={beneficio}
                  className="flex items-center gap-4 border-b border-[#D5DEE9] py-5"
                >
                  <span aria-hidden="true" className="h-1.5 w-6 shrink-0 bg-[#E8E191]" />
                  {beneficio}
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
