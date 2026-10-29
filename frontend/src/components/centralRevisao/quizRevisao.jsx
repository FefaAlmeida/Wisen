"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const questoes = [
  {
    titulo: "Copom mantém taxa Selic em 10,50% ao ano",
    categoria: "Economia",
    tempo: "há 2 horas",
    contexto:
      "O Comitê de Política Monetária (Copom) decidiu manter a taxa básica de juros em 10,50% ao ano, citando um cenário global desafiador e a necessidade de maior cautela com a inflação.",
    pergunta: "Qual é o principal objetivo da taxa Selic na economia brasileira?",
    opcoes: [
      "Controlar a inflação e influenciar o nível de atividade econômica.",
      "Definir a taxa de câmbio do real em relação ao dólar.",
      "Financiar os gastos do governo federal.",
      "Determinar o valor dos impostos sobre o consumo.",
    ],
    correta: 0,
    conceito: "Taxa Selic",
    explicacao:
      "A Selic é a taxa básica de juros e um dos principais instrumentos da política monetária para controlar a inflação.",
  },
  {
    titulo: "Inflação e política monetária",
    categoria: "Economia",
    tempo: "conteúdo de revisão",
    contexto:
      "O Banco Central utiliza instrumentos de política monetária para influenciar o consumo, o crédito e a inflação.",
    pergunta: "O que normalmente acontece com o crédito quando a taxa Selic aumenta?",
    opcoes: [
      "Os empréstimos ficam sempre gratuitos.",
      "O crédito tende a ficar mais caro.",
      "A inflação deixa de existir imediatamente.",
      "Os impostos são automaticamente reduzidos.",
    ],
    correta: 1,
    conceito: "Política monetária",
    explicacao:
      "O aumento da Selic tende a elevar o custo dos empréstimos, reduzindo o estímulo ao consumo e ao investimento.",
  },
];

export default function QuizRevisao() {
  const [modo, setModo] = useState("quiz");
  const [indice, setIndice] = useState(0);
  const [respostas, setRespostas] = useState({});
  const [avaliacoes, setAvaliacoes] = useState({});
  const [virado, setVirado] = useState(false);

  const questao = questoes[indice];
  const resposta = respostas[indice];
  const respondida = resposta !== undefined;
  const letras = ["A", "B", "C", "D"];

  function mudarQuestao(direcao) {
    setIndice((atual) => Math.max(0, Math.min(questoes.length - 1, atual + direcao)));
    setVirado(false);
  }

  return (
    <Card className="gap-0 rounded-xl border-0 bg-white p-0 shadow-none">
      <CardContent className="p-5 md:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Tabs
            value={modo}
            onValueChange={(valor) => {
              setModo(valor);
              setVirado(false);
            }}
          >
            <TabsList className="h-10 rounded-full bg-[#F0F4FA] p-1">
              <TabsTrigger
                value="quiz"
                className="rounded-full px-6 text-[13px] text-[#53658B] data-[state=active]:bg-[#FFF1A4] data-[state=active]:text-wisen-titulo data-[state=active]:shadow-none"
              >
                Quiz
              </TabsTrigger>
              <TabsTrigger
                value="flashcards"
                className="rounded-full px-5 text-[13px] text-[#53658B] data-[state=active]:bg-[#FFF1A4] data-[state=active]:text-wisen-titulo data-[state=active]:shadow-none"
              >
                Flashcards
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <span className="mr-2 text-[12px] text-[#7183A6]">Questão {indice + 5} de 12</span>
            <Button
              variant="outline"
              size="icon"
              disabled={indice === 0}
              onClick={() => mudarQuestao(-1)}
              className="h-10 w-10 border-[#DCE5F3] text-wisen-titulo"
            >
              <span className="text-xl">‹</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={indice === questoes.length - 1}
              onClick={() => mudarQuestao(1)}
              className="h-10 w-10 border-[#DCE5F3] text-wisen-titulo"
            >
              <span className="text-xl">›</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-5 rounded-xl bg-[#F4F7FB] p-4 sm:flex-row">
          <img
            src="/revisaoSelic.jpg"
            alt="Congresso Nacional em Brasília"
            className="h-[145px] w-full shrink-0 rounded-lg object-cover sm:w-[230px]"
          />

          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <p className="mb-2 text-[10px] font-semibold tracking-[0.12em] text-[#8CA0C3]">
              CONTEXTO DA NOTÍCIA
            </p>
            <h3 className="text-[18px] font-semibold leading-snug text-wisen-titulo">
              {questao.titulo}
            </h3>
            <p className="mt-1 text-[12px] text-[#8A99B5]">
              {questao.tempo} · {questao.categoria}
            </p>
            <p className="mt-3 text-[14px] leading-[1.55] text-[#617398]">{questao.contexto}</p>
          </div>
        </div>

        {modo === "quiz" ? (
          <>
            <div className="mt-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="h-[2px] w-8 bg-[#E8C637]" />
                <span className="text-[11px] font-semibold tracking-[0.14em] text-[#8CA0C3]">
                  PERGUNTA
                </span>
              </div>

              <h2 className="mb-4 text-[21px] font-semibold leading-snug tracking-tight text-wisen-titulo">
                {questao.pergunta}
              </h2>

              <div className="space-y-2">
                {questao.opcoes.map((opcao, i) => {
                  const selecionada = resposta === i;

                  return (
                    <button
                      key={opcao}
                      type="button"
                      onClick={() => setRespostas((atual) => ({ ...atual, [indice]: i }))}
                      aria-pressed={selecionada}
                      className={`flex min-h-[51px] w-full items-center gap-4 rounded-xl border px-4 py-2.5 text-left transition-colors ${
                        selecionada
                          ? "border-[#E9CE68] bg-[#FFF9E3]"
                          : "border-[#DEE6F2] bg-white hover:bg-[#F6F8FC]"
                      }`}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EEF2F9] text-[15px] font-semibold text-wisen-titulo">
                        {letras[i]}
                      </span>
                      <span className="text-[14px] text-[#52658C]">{opcao}</span>
                    </button>
                  );
                })}
              </div>

              {respondida && (
                <p className="mt-3 text-[13px] text-[#617398]">
                  {resposta === questao.correta ? "Resposta correta! " : "Resposta incorreta. "}
                  {questao.explicacao}
                </p>
              )}
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-[#E1E8F2] pt-5">
              <div>
                <h3 className="text-[15px] font-semibold text-wisen-titulo">
                  Como você foi nesta questão?
                </h3>
                <p className="text-[12px] text-[#8192B2]">
                  Sua resposta ajuda a personalizar as próximas revisões.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { nome: "Errei", cor: "bg-[#FDE7E9]" },
                  { nome: "Difícil", cor: "bg-[#FFF0E3]" },
                  { nome: "Médio", cor: "bg-[#FFF8D9]" },
                  { nome: "Fácil", cor: "bg-[#E3F5E9]" },
                ].map((item) => (
                  <Button
                    key={item.nome}
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      setAvaliacoes((atual) => ({
                        ...atual,
                        [indice]: item.nome,
                      }))
                    }
                    className={`flex h-11 min-w-[100px] items-center justify-center rounded-xl px-4 text-center text-[12px] font-medium text-wisen-titulo hover:opacity-80 ${item.cor} ${
                      avaliacoes[indice] === item.nome ? "ring-2 ring-wisen-titulo" : ""
                    }`}
                  >
                    {item.nome}
                  </Button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="mt-6">
            <p className="mb-3 text-[11px] font-semibold tracking-[0.14em] text-[#8CA0C3]">
              FLASHCARD
            </p>
            <button
              type="button"
              onClick={() => setVirado(!virado)}
              className="flex min-h-[245px] w-full flex-col items-center justify-center rounded-xl border border-[#E5D994] bg-[#FFFBEA] p-8 text-center"
            >
              <span className="mb-3 text-[11px] font-medium text-[#8192B2]">
                {virado ? "RESPOSTA" : "PERGUNTA"}
              </span>
              <span className="max-w-[590px] text-[21px] font-semibold text-wisen-titulo">
                {virado ? questao.explicacao : questao.pergunta}
              </span>
              <span className="mt-6 text-[12px] text-[#7183A6]">
                Clique para {virado ? "ver a pergunta" : "revelar a resposta"}
              </span>
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
