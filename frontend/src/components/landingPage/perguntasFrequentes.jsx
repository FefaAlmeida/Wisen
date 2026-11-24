"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function PerguntasFrequentes() {
  const [abertoIndex, setAbertoIndex] = useState(null);

  const faqs = [
    {
      pergunta: "Como começo a usar o Wisen?",
      resposta:
        "Crie sua conta, escolha os temas que interessam a você e explore as notícias. Durante a leitura, você pode descobrir conceitos, salvar conteúdos e retomar o aprendizado nas revisões.",
    },
    {
      pergunta: "Quais tipos de conteúdo estão disponíveis?",
      resposta:
        "Você encontra notícias organizadas por temas, explicações dos conceitos relacionados e perguntas de revisão para retomar o que aprendeu.",
    },
    {
      pergunta: "Posso consultar as fontes das notícias?",
      resposta:
        "Sim. As notícias identificam suas fontes e oferecem acesso à publicação original, para você consultar o conteúdo e aprofundar a leitura.",
    },
    {
      pergunta: "Posso usar a plataforma no celular ou tablet?",
      resposta:
        "Sim. Você pode acessar o Wisen pelo navegador do celular, tablet ou computador, sem precisar instalar um aplicativo.",
    },
  ];

  const toggleFaq = (index) => {
    setAbertoIndex((anterior) => (anterior === index ? null : index));
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-titulo"
      className="relative w-screen -mx-[calc(50vw-50%)] mt-0 scroll-mt-24"
    >
      <div className="relative isolate overflow-hidden border-y border-[#293B5C] bg-[#172542] px-6 py-8 text-white sm:px-10 md:px-14 md:py-10">
        <div className="relative z-10 mx-auto grid max-w-[1360px] grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-14">
          {/* Introdução */}
          <div className="space-y-4 lg:col-span-5">
            <h2
              id="faq-titulo"
              className="whitespace-nowrap text-center text-[clamp(1.5rem,6.5vw,1.875rem)] font-bold leading-[1.15] tracking-[-0.045em] text-white sm:whitespace-normal sm:text-left sm:text-[clamp(1.875rem,2.8vw,2.5rem)]"
            >
              Ainda tem <br className="hidden sm:block" />
              perguntas<span className="text-[#E8E191]">?</span>
            </h2>
          </div>

          {/* Perguntas */}
          <div className="lg:col-span-7">
            {faqs.map((item, index) => {
              const estaAberto = abertoIndex === index;

              return (
                <div key={item.pergunta} className="border-b border-white/10 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={estaAberto}
                    aria-controls={`faq-resposta-${index}`}
                    className="group flex min-h-16 w-full cursor-pointer items-center justify-between gap-5 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8E191]"
                  >
                    <span
                      className={`text-base font-semibold leading-relaxed transition-colors duration-200 ${
                        estaAberto ? "text-[#E8E191]" : "text-white group-hover:text-[#E8E191]"
                      }`}
                    >
                      {item.pergunta}
                    </span>

                    <ChevronDown
                      aria-hidden="true"
                      className={`h-4 w-4 shrink-0 text-[#E8E191] transition-transform duration-200 motion-reduce:transition-none ${
                        estaAberto ? "rotate-180" : ""
                      }`}
                    />
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
                      <p className="max-w-[600px] pb-6 pr-6 text-base leading-[1.8] text-[#BDCADB]">
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
