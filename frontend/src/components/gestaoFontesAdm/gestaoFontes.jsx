"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormularioFonte from "./formularioFonte";
import LogsColeta from "./logsColeta";
import TabelaFontes from "./tabelaFontes";

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
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroFrequencia, setFiltroFrequencia] = useState("todas");
  const [modalAberto, setModalAberto] = useState(false);
  const [fonteEditando, setFonteEditando] = useState(null);

  const fontesFiltradas = fontes.filter((fonte) => {
    const correspondeStatus =
      filtroStatus === "todos" ||
      (filtroStatus === "ativos" && fonte.ativo) ||
      (filtroStatus === "inativos" && !fonte.ativo);
    const correspondeFrequencia =
      filtroFrequencia === "todas" || fonte.frequencia === filtroFrequencia;

    return correspondeStatus && correspondeFrequencia;
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
        anteriores.map((fonte) => (fonte.id === fonteEditando.id ? { ...fonte, ...dados } : fonte)),
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
      anteriores.map((fonte) => (fonte.id === id ? { ...fonte, ativo: !fonte.ativo } : fonte)),
    );
  }

  return (
    <div className="space-y-4">
      <Card className="gap-0 rounded-lg border border-[#E3E9F1] bg-white p-0 shadow-none">
        <CardContent className="p-5">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-[22px] font-semibold text-[#101A40]">Fontes cadastradas</h2>

            <div className="flex flex-wrap items-center gap-3">
              <div className="w-full sm:w-[170px]">
                <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                  <SelectTrigger
                    aria-label="Filtrar fontes por status"
                    className="h-10 w-full rounded-lg border-[#DFE6F0] bg-white text-sm text-[#101A40]"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os status</SelectItem>
                    <SelectItem value="ativos">Ativas</SelectItem>
                    <SelectItem value="inativos">Inativas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:w-[180px]">
                <Select value={filtroFrequencia} onValueChange={setFiltroFrequencia}>
                  <SelectTrigger
                    aria-label="Filtrar fontes por frequência"
                    className="h-10 w-full rounded-lg border-[#DFE6F0] bg-white text-sm text-[#101A40]"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as frequências</SelectItem>
                    <SelectItem value="A cada 15 min">A cada 15 minutos</SelectItem>
                    <SelectItem value="30 minutos">A cada 30 minutos</SelectItem>
                    <SelectItem value="1 hora">A cada 1 hora</SelectItem>
                    <SelectItem value="6 horas">A cada 6 horas</SelectItem>
                    <SelectItem value="12 horas">A cada 12 horas</SelectItem>
                    <SelectItem value="24 horas">A cada 24 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="button"
                onClick={adicionarFonte}
                className="h-10 rounded-lg bg-[#F3E69A] px-5 text-sm font-semibold text-[#101A40] transition-colors hover:bg-[#EBDD80]"
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
