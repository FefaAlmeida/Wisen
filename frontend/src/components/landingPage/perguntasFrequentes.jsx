"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function PerguntasFrequentes() {
  const [abertoIndex, setAbertoIndex] = useState(null);

  const faqs = [
    {
      pergunta: "O Wisen é gratuito?",
      resposta:
        "Sim, você pode começar a usar o Wisen gratuitamente com acesso aos principais resumos e funcionalidades básicas.",
    },
    {
      pergunta: "Quais tipos de conteúdo estão disponíveis?",
      resposta:
        "Oferecemos resumos de notícias, análises de mercado, temas de tecnologia, política, economia e saúde com mapas mentais interativos.",
    },
    {
      pergunta: "Como é a curadoria dos conteúdos?",
      resposta:
        "Nossa equipe utiliza algoritmos avançados combinados com revisão humana para garantir fontes confiáveis e informações imparciais.",
    },
    {
      pergunta: "Posso usar a plataforma no celular ou tablet?",
      resposta:
        "Sim! O Wisen é inteiramente responsivo e funciona perfeitamente em qualquer dispositivo móvel, tablet ou computador.",
    },
  ];

  const toggleFaq = (index) => {
    setAbertoIndex((anterior) => (anterior === index ? null : index));
  };

  return (
    <section id="faq" className="relative w-screen -mx-[calc(50vw-50%)] mt-0">
      <div className="relative isolate overflow-hidden border-y border-[#293B5C] bg-[#172542] px-6 py-11 text-white shadow-[0_24px_65px_-42px_rgba(16,26,64,0.45)] sm:px-10 md:px-14 md:py-16">
        {/* Iluminação suave */}
        <div className="pointer-events-none absolute -bottom-32 -left-24 z-0 h-80 w-80 rounded-full bg-[#30466E]/30 blur-3xl" />

        <div className="relative z-10 mx-auto grid max-w-[1360px] grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Introdução */}
          <div className="space-y-5 lg:col-span-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#E8E191]">
              DÚVIDAS FREQUENTES
            </span>

            <h2 className="text-[clamp(2.1rem,3.5vw,3.2rem)] font-bold leading-[1.15] tracking-[-0.045em] text-white">
              Ainda tem
              <br />
              perguntas<span className="text-[#E8E191]">?</span>
            </h2>

            <p className="max-w-[340px] text-[14px] leading-[1.9] text-[#BDCADB]">
              Reunimos aqui as principais dúvidas sobre o funcionamento do Wisen.
            </p>
          </div>

          {/* Perguntas */}
          <div className="space-y-1 lg:col-span-7">
            {faqs.map((item, index) => {
              const estaAberto = abertoIndex === index;

              return (
                <div key={item.pergunta} className="border-b border-white/15 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={estaAberto}
                    aria-controls={`faq-resposta-${index}`}
                    className="group flex w-full cursor-pointer items-center justify-between gap-5 py-5 text-left"
                  >
                    <span
                      className={`text-[14px] font-semibold leading-relaxed transition-colors duration-300 sm:text-[15px] ${
                        estaAberto ? "text-[#E8E191]" : "text-white group-hover:text-[#E8E191]"
                      }`}
                    >
                      {item.pergunta}
                    </span>

                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        estaAberto
                          ? "border-[#E8E191]/40 bg-[#E8E191]/15"
                          : "border-white/15 bg-white/5 group-hover:border-[#E8E191]/40"
                      }`}
                    >
                      <ChevronDown
                        className={`h-4 w-4 text-[#E8E191] transition-transform duration-300 ${
                          estaAberto ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Resposta com abertura suave */}
                  <div
                    id={`faq-resposta-${index}`}
                    aria-hidden={!estaAberto}
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none ${
                      estaAberto ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p className="max-w-[540px] pb-6 pr-8 text-[13px] leading-[1.9] text-[#BDCADB] sm:text-[14px]">
                        {item.resposta}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
