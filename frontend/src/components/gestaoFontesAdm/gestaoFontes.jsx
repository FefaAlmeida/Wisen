
"use client";

import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import TabelaFontes from "./tabelaFontes";
import FormularioFonte from "./formularioFonte";
import LogsColeta from "./logsColeta";

const fontesIniciais = [
  {
    id: 1,
    nome: "G1",
    url: "https://g1.globo.com/rss/g1/",
    ativo: true,
    ultimaColeta: "01/10/2026 09:42",
    frequencia: "A cada 15 min",
  },
  {
    id: 2,
    nome: "Valor Econômico",
    url: "https://valor.globo.com/rss/",
    ativo: true,
    ultimaColeta: "01/10/2026 09:35",
    frequencia: "1 hora",
  },
  {
    id: 3,
    nome: "Agência Brasil",
    url: "https://agenciabrasil.ebc.com.br/rss",
    ativo: false,
    ultimaColeta: "30/09/2026 18:20",
    frequencia: "6 horas",
  },
  {
    id: 4,
    nome: "Meio Ambiente News",
    url: "https://meioambientenews.com.br/rss",
    ativo: true,
    ultimaColeta: "01/10/2026 08:17",
    frequencia: "1 hora",
  },
  {
    id: 5,
    nome: "Portal Tecnologia",
    url: "https://tecnologia.uol.com.br/rss",
    ativo: true,
    ultimaColeta: "01/10/2026 09:28",
    frequencia: "A cada 15 min",
  },
];

export default function GestaoFontes() {
  const [fontes, setFontes] = useState(fontesIniciais);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [modalAberto, setModalAberto] = useState(false);
  const [fonteEditando, setFonteEditando] = useState(null);

  const fontesFiltradas = fontes.filter((fonte) => {
    const correspondeBusca =
      `${fonte.nome} ${fonte.url}`
        .toLowerCase()
        .includes(busca.toLowerCase());

    const correspondeFiltro =
      filtro === "todos" ||
      (filtro === "ativos" && fonte.ativo) ||
      (filtro === "inativos" && !fonte.ativo);

    return correspondeBusca && correspondeFiltro;
  });

  function adicionarFonte() {
    setFonteEditando(null);
    setModalAberto(true);
  }

  function editarFonte(fonte) {
    setFonteEditando(fonte);
    setModalAberto(true);
  }

  function fecharFormulario() {
    setModalAberto(false);
    setFonteEditando(null);
  }

  function salvarFonte(dados) {
    if (fonteEditando) {
      setFontes((anteriores) =>
        anteriores.map((fonte) =>
          fonte.id === fonteEditando.id
            ? { ...fonte, ...dados }
            : fonte
        )
      );
    } else {
      setFontes((anteriores) => [
        ...anteriores,
        {
          ...dados,
          id: Math.max(0, ...anteriores.map((fonte) => fonte.id)) + 1,
          ultimaColeta: "Ainda não realizada",
        },
      ]);
    }

    fecharFormulario();
  }

  function alternarStatus(id) {
    setFontes((anteriores) =>
      anteriores.map((fonte) =>
        fonte.id === id
          ? { ...fonte, ativo: !fonte.ativo }
          : fonte
      )
    );
  }

  return (
    <div className="space-y-4">
      <Card className="gap-0 rounded-xl border border-[#E3E9F1] bg-white p-0 shadow-none">
        <CardContent className="p-5">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-[20px] font-semibold text-[#101A40]">
              Fontes cadastradas
            </h2>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-[250px]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#7183A6]"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>

                <Input
                  type="search"
                  placeholder="Buscar fonte ou URL..."
                  value={busca}
                  onChange={(event) => setBusca(event.target.value)}
                  className="h-10 rounded-lg border-[#DFE6F0] bg-white pl-10 text-[13px]"
                />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setFiltro((atual) =>
                    atual === "todos"
                      ? "ativos"
                      : atual === "ativos"
                      ? "inativos"
                      : "todos"
                  )
                }
                className="h-10 rounded-lg border-[#DFE6F0] bg-white px-4 text-[#101A40]"
              >
                {filtro === "todos"
                  ? "Filtros"
                  : filtro === "ativos"
                  ? "Ativas"
                  : "Inativas"}
              </Button>

              <Button
                type="button"
                onClick={adicionarFonte}
                className="h-10 rounded-lg bg-[#F3E69A] px-5 font-semibold text-[#101A40] hover:bg-[#E8D879]"
              >
                + Adicionar fonte
              </Button>
            </div>
          </div>

          <TabelaFontes
            fontes={fontesFiltradas}
            aoEditar={editarFonte}
            aoAlternarStatus={alternarStatus}
          />
        </CardContent>
      </Card>

      <LogsColeta />

      <FormularioFonte
        aberto={modalAberto}
        aoFechar={fecharFormulario}
        fonte={fonteEditando}
        aoSalvar={salvarFonte}
      />
    </div>
  );
}
