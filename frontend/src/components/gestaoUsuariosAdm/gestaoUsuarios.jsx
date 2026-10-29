
"use client";

import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import TabelaUsuarios from "./tabelaUsuarios";
import PainelUsuario from "./painelUsuario";

const usuariosIniciais = [
  {
    id: 1,
    nome: "Mariana Costa",
    iniciais: "MC",
    email: "mariana.costa@email.com",
    permissao: "Admin",
    status: "Ativo",
    dataCadastro: "12/08/2026",
  },
  {
    id: 2,
    nome: "João Silva",
    iniciais: "JS",
    email: "joao.silva@email.com",
    permissao: "Usuário",
    status: "Ativo",
    dataCadastro: "10/08/2026",
  },
  {
    id: 3,
    nome: "Beatriz Almeida",
    iniciais: "BA",
    email: "beatriz.almeida@email.com",
    permissao: "Usuário",
    status: "Ativo",
    dataCadastro: "05/08/2026",
  },
  {
    id: 4,
    nome: "Carlos Pereira",
    iniciais: "CP",
    email: "carlos.pereira@email.com",
    permissao: "Usuário",
    status: "Bloqueado",
    dataCadastro: "28/07/2026",
  },
  {
    id: 5,
    nome: "Ana Clara Souza",
    iniciais: "AS",
    email: "ana.clara@email.com",
    permissao: "Usuário",
    status: "Ativo",
    dataCadastro: "25/07/2026",
  },
  {
    id: 6,
    nome: "Rafael Ferreira",
    iniciais: "RF",
    email: "rafael.ferreira@email.com",
    permissao: "Admin",
    status: "Ativo",
    dataCadastro: "18/07/2026",
  },
  {
    id: 7,
    nome: "Juliana Martins",
    iniciais: "JM",
    email: "juliana.martins@email.com",
    permissao: "Usuário",
    status: "Ativo",
    dataCadastro: "14/07/2026",
  },
  {
    id: 8,
    nome: "Lucas Gomes",
    iniciais: "LG",
    email: "lucas.gomes@email.com",
    permissao: "Usuário",
    status: "Ativo",
    dataCadastro: "10/07/2026",
  },
  {
    id: 9,
    nome: "Fernanda Lima",
    iniciais: "FL",
    email: "fernanda.lima@email.com",
    permissao: "Usuário",
    status: "Bloqueado",
    dataCadastro: "05/07/2026",
  },
  {
    id: 10,
    nome: "Thiago Santos",
    iniciais: "TS",
    email: "thiago.santos@email.com",
    permissao: "Usuário",
    status: "Ativo",
    dataCadastro: "02/07/2026",
  },
];

const tamanhoPagina = 10;

export default function GestaoUsuarios() {
  const [usuarios, setUsuarios] = useState(usuariosIniciais);
  const [busca, setBusca] = useState("");
  const [permissaoFiltro, setPermissaoFiltro] = useState("todos");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [dataFiltro, setDataFiltro] = useState("");
  const [pagina, setPagina] = useState(1);
  const [selecionados, setSelecionados] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [painelAberto, setPainelAberto] = useState(false);
  const [historico, setHistorico] = useState([]);

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const correspondeBusca =
      `${usuario.nome} ${usuario.email}`
        .toLocaleLowerCase("pt-BR")
        .includes(busca.toLocaleLowerCase("pt-BR"));

    const correspondePermissao =
      permissaoFiltro === "todos" ||
      usuario.permissao === permissaoFiltro;

    const correspondeStatus =
      statusFiltro === "todos" ||
      usuario.status === statusFiltro;

    const correspondeData =
      !dataFiltro ||
      usuario.dataCadastro ===
        dataFiltro.split("-").reverse().join("/");

    return (
      correspondeBusca &&
      correspondePermissao &&
      correspondeStatus &&
      correspondeData
    );
  });

  const totalPaginas = Math.max(
    1,
    Math.ceil(usuariosFiltrados.length / tamanhoPagina)
  );

  const paginaAtual = Math.min(pagina, totalPaginas);
  const inicio = (paginaAtual - 1) * tamanhoPagina;

  const usuariosPagina = usuariosFiltrados.slice(
    inicio,
    inicio + tamanhoPagina
  );

  function selecionarUsuario(id, marcado) {
    setSelecionados((anteriores) =>
      marcado
        ? [...new Set([...anteriores, id])]
        : anteriores.filter((item) => item !== id)
    );
  }

  function selecionarTodos(marcado) {
    const idsPagina = usuariosPagina.map((usuario) => usuario.id);

    setSelecionados((anteriores) =>
      marcado
        ? [...new Set([...anteriores, ...idsPagina])]
        : anteriores.filter((id) => !idsPagina.includes(id))
    );
  }

  function abrirUsuario(usuario) {
    setUsuarioSelecionado(usuario);
    setPainelAberto(true);
  }

  function salvarUsuario(id, alteracoes) {
    const anterior = usuarios.find((usuario) => usuario.id === id);

    if (!anterior) return;

    const mudancas = [];

    if (anterior.permissao !== alteracoes.permissao) {
      mudancas.push(
        `Permissão: ${anterior.permissao} → ${alteracoes.permissao}`
      );
    }

    if (anterior.status !== alteracoes.status) {
      mudancas.push(
        `Status: ${anterior.status} → ${alteracoes.status}`
      );
    }

    setUsuarios((anteriores) =>
      anteriores.map((usuario) =>
        usuario.id === id
          ? { ...usuario, ...alteracoes }
          : usuario
      )
    );

    if (mudancas.length > 0) {
      setHistorico((anteriores) => [
        {
          id: Date.now(),
          usuario: anterior.nome,
          descricao: mudancas.join(" | "),
          data: new Date().toLocaleString("pt-BR"),
        },
        ...anteriores,
      ]);
    }

    setPainelAberto(false);
    setUsuarioSelecionado(null);
  }

  return (
    <>
      <Tabs defaultValue="usuarios" className="w-full gap-0">
        <TabsList className="mb-4 h-12 w-full justify-start gap-2 rounded-none border-b border-[#DCE4EF] bg-transparent p-0">
          <TabsTrigger
            value="usuarios"
            className="h-full rounded-none border-b-2 border-transparent px-6 text-[14px] text-[#7183A6] shadow-none data-[state=active]:border-[#E0C43F] data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-[#101A40] data-[state=active]:shadow-none"
          >
            Usuários
          </TabsTrigger>

          <TabsTrigger
            value="historico"
            className="h-full rounded-none border-b-2 border-transparent px-6 text-[14px] text-[#7183A6] shadow-none data-[state=active]:border-[#E0C43F] data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-[#101A40] data-[state=active]:shadow-none"
          >
            Histórico de ações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios" className="mt-0">
          <Card className="gap-0 rounded-xl border border-[#E3E9F1] bg-white p-0 shadow-none">
            <CardContent className="p-4 md:p-5">

              {/* Filtros */}
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <div className="relative min-w-[230px] flex-1">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#7183A6]"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-4-4" />
                  </svg>

                  <Input
                    type="search"
                    placeholder="Buscar por nome ou e-mail..."
                    value={busca}
                    onChange={(evento) => {
                      setBusca(evento.target.value);
                      setPagina(1);
                    }}
                    className="h-10 rounded-lg border-[#DFE6F0] bg-white pl-10 text-[13px] shadow-none"
                  />
                </div>

                <Select
                  value={permissaoFiltro}
                  onValueChange={(valor) => {
                    setPermissaoFiltro(valor);
                    setPagina(1);
                  }}
                >
                  <SelectTrigger className="h-10 w-full rounded-lg border-[#DFE6F0] bg-white text-[12px] text-[#344469] shadow-none sm:w-[185px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">
                      Todas as permissões
                    </SelectItem>
                    <SelectItem value="Admin">
                      Administrador
                    </SelectItem>
                    <SelectItem value="Usuário">
                      Usuário
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={statusFiltro}
                  onValueChange={(valor) => {
                    setStatusFiltro(valor);
                    setPagina(1);
                  }}
                >
                  <SelectTrigger className="h-10 w-full rounded-lg border-[#DFE6F0] bg-white text-[12px] text-[#344469] shadow-none sm:w-[165px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">
                      Todos os status
                    </SelectItem>
                    <SelectItem value="Ativo">
                      Ativo
                    </SelectItem>
                    <SelectItem value="Bloqueado">
                      Bloqueado
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="date"
                  aria-label="Filtrar por data de cadastro"
                  value={dataFiltro}
                  onChange={(evento) => {
                    setDataFiltro(evento.target.value);
                    setPagina(1);
                  }}
                  className="h-10 w-full rounded-lg border-[#DFE6F0] bg-white text-[12px] text-[#344469] shadow-none sm:w-[170px]"
                />
              </div>

              {/* Tabela em largura total */}
              <TabelaUsuarios
                usuarios={usuariosPagina}
                selecionados={selecionados}
                aoSelecionar={selecionarUsuario}
                aoSelecionarTodos={selecionarTodos}
                aoAbrirUsuario={abrirUsuario}
              />

              {/* Paginação */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#E8EDF4] pt-4">
                <p className="text-[12px] text-[#7183A6]">
                  {usuariosFiltrados.length === 0
                    ? "Nenhum usuário encontrado"
                    : `Mostrando ${inicio + 1}–${Math.min(
                        inicio + tamanhoPagina,
                        usuariosFiltrados.length
                      )} de ${usuariosFiltrados.length} usuários`}
                </p>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={paginaAtual === 1}
                    onClick={() => setPagina(paginaAtual - 1)}
                    className="h-8 w-8 border-[#DFE6F0]"
                    aria-label="Página anterior"
                  >
                    ‹
                  </Button>

                  {Array.from(
                    { length: totalPaginas },
                    (_, index) => index + 1
                  ).map((numero) => (
                    <Button
                      key={numero}
                      variant={paginaAtual === numero ? "default" : "outline"}
                      onClick={() => setPagina(numero)}
                      className={`h-8 w-8 rounded-md p-0 text-xs ${
                        paginaAtual === numero
                          ? "bg-[#30466E] text-white hover:bg-[#253653]"
                          : "border-[#DFE6F0] bg-white text-[#7183A6]"
                      }`}
                    >
                      {numero}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="icon"
                    disabled={paginaAtual === totalPaginas}
                    onClick={() => setPagina(paginaAtual + 1)}
                    className="h-8 w-8 border-[#DFE6F0]"
                    aria-label="Próxima página"
                  >
                    ›
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historico" className="mt-0">
          <Card className="gap-0 rounded-xl border border-[#E3E9F1] bg-white p-5 shadow-none">
            <h2 className="text-[19px] font-semibold text-[#101A40]">
              Histórico de ações
            </h2>

            <p className="mt-1 text-[12px] text-[#8192B2]">
              Alterações realizadas nesta sessão de demonstração.
            </p>

            <div className="mt-5 divide-y divide-[#E8EDF4]">
              {historico.length === 0 ? (
                <p className="py-8 text-center text-[13px] text-[#8192B2]">
                  Nenhuma alteração registrada nesta sessão.
                </p>
              ) : (
                historico.map((registro) => (
                  <div
                    key={registro.id}
                    className="flex flex-wrap justify-between gap-3 py-4"
                  >
                    <div>
                      <p className="text-[13px] font-semibold text-[#101A40]">
                        {registro.usuario}
                      </p>
                      <p className="mt-1 text-[12px] text-[#7183A6]">
                        {registro.descricao}
                      </p>
                    </div>
                    <span className="text-[11px] text-[#8192B2]">
                      {registro.data}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <PainelUsuario
        usuario={usuarioSelecionado}
        aberto={painelAberto}
        aoFechar={() => setPainelAberto(false)}
        aoSalvar={salvarUsuario}
      />
    </>
  );
}
