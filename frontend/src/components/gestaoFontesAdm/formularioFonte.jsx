
"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formularioVazio = {
  nome: "",
  url: "",
  categoria: "",
  frequencia: "A cada 15 min",
  ativo: true,
};

export default function FormularioFonte({
  aberto,
  aoFechar,
  fonte,
  aoSalvar,
}) {
  const [dados, setDados] = useState(formularioVazio);

  
useEffect(() => {
  if (aberto) {
    setDados({
      nome: fonte?.nome ?? "",
      url: fonte?.url ?? "",
      categoria: fonte?.categoria ?? "",
      frequencia: fonte?.frequencia ?? "A cada 15 min",
      ativo: fonte?.ativo ?? true,
    });
  }
}, [aberto, fonte]);


  function atualizar(campo, valor) {
    setDados((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  function salvar(event) {
    event.preventDefault();

    if (!dados.nome.trim() || !dados.url.trim()) return;

    aoSalvar({
      ...dados,
      nome: dados.nome.trim(),
      url: dados.url.trim(),
    });
  }

  return (
    <Dialog
      open={aberto}
      onOpenChange={(valor) => {
        if (!valor) aoFechar();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-xl border border-[#E2E8F0] bg-white p-0 shadow-xl sm:max-w-[520px]">

        <DialogHeader className="border-b border-[#EBEFF5] px-7 pt-7 pb-5">
          <div className="flex items-start gap-4 pr-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFF5CB]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="h-6 w-6 text-[#AC8A17]"
              >
                <circle cx="5" cy="19" r="2" />
                <path d="M4 11a9 9 0 0 1 9 9" />
                <path d="M4 4a16 16 0 0 1 16 16" />
              </svg>
            </div>

            <div className="space-y-1 text-left">
              <DialogTitle className="text-[22px] font-semibold tracking-tight text-[#101A40]">
                {fonte ? "Editar fonte RSS" : "Adicionar nova fonte"}
              </DialogTitle>

              <DialogDescription className="text-[13px] leading-5 text-[#7889A7]">
                {fonte
                  ? "Atualize as informações e configurações da fonte."
                  : "Configure um veículo para integrar notícias à plataforma."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={salvar} className="space-y-5 px-7 py-6">

          {/* Nome do veículo */}
          <div className="space-y-2">
            <Label
              htmlFor="nomeFonte"
              className="text-[13px] font-medium text-[#101A40]"
            >
              Nome do veículo
              <span className="ml-1 text-[#D6AD30]">*</span>
            </Label>

            <Input
              id="nomeFonte"
              value={dados.nome}
              onChange={(event) =>
                atualizar("nome", event.target.value)
              }
              placeholder="Ex.: G1, BBC Brasil, Agência Brasil"
              required
              className="h-11 rounded-lg border-[#DCE4EF] bg-white px-3 text-[13px] text-[#101A40] shadow-none placeholder:text-[#A0ACC0] focus-visible:border-[#D6C36D] focus-visible:ring-[#F4E9AD]"
            />
          </div>

          {/* URL RSS */}
          <div className="space-y-2">
            <Label
              htmlFor="urlFonte"
              className="text-[13px] font-medium text-[#101A40]"
            >
              URL do feed RSS
              <span className="ml-1 text-[#D6AD30]">*</span>
            </Label>

            <Input
              id="urlFonte"
              type="url"
              value={dados.url}
              onChange={(event) =>
                atualizar("url", event.target.value)
              }
              placeholder="https://exemplo.com/feed.xml"
              required
              className="h-11 rounded-lg border-[#DCE4EF] bg-white px-3 text-[13px] text-[#101A40] shadow-none placeholder:text-[#A0ACC0] focus-visible:border-[#D6C36D] focus-visible:ring-[#F4E9AD]"
            />

            <p className="text-[11px] leading-4 text-[#8B99B1]">
              Insira o endereço que disponibiliza as notícias
              em formato RSS ou Atom.
            </p>
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <Label
              htmlFor="categoriaFonte"
              className="text-[13px] font-medium text-[#101A40]"
            >
              Categoria principal
            </Label>


              <Select
                value={dados.categoria ?? ""}
                onValueChange={(valor) => atualizar("categoria", valor)}
              >

              <SelectTrigger
                id="categoriaFonte"
                className="h-11 w-full rounded-lg border-[#DCE4EF] bg-white px-3 text-[13px] text-[#344469] shadow-none"
              >
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Economia">
                  Economia
                </SelectItem>
                <SelectItem value="Política">
                  Política
                </SelectItem>
                <SelectItem value="Tecnologia">
                  Tecnologia
                </SelectItem>
                <SelectItem value="Meio ambiente">
                  Meio ambiente
                </SelectItem>
                <SelectItem value="Educação">
                  Educação
                </SelectItem>
                <SelectItem value="Geral">
                  Geral
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Frequência */}
          <div className="space-y-2">
            <Label
              htmlFor="frequenciaFonte"
              className="text-[13px] font-medium text-[#101A40]"
            >
              Frequência de coleta
            </Label>


            <Select
              value={dados.frequencia ?? "A cada 15 min"}
              onValueChange={(valor) => atualizar("frequencia", valor)}
            >

              <SelectTrigger
                id="frequenciaFonte"
                className="h-11 w-full rounded-lg border-[#DCE4EF] bg-white px-3 text-[13px] text-[#344469] shadow-none"
              >
                <SelectValue placeholder="Selecione a frequência" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="A cada 15 min">
                  A cada 15 minutos
                </SelectItem>
                <SelectItem value="30 minutos">
                  A cada 30 minutos
                </SelectItem>
                <SelectItem value="1 hora">
                  A cada 1 hora
                </SelectItem>
                <SelectItem value="6 horas">
                  A cada 6 horas
                </SelectItem>
                <SelectItem value="12 horas">
                  A cada 12 horas
                </SelectItem>
                <SelectItem value="24 horas">
                  A cada 24 horas
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between gap-4 rounded-lg border border-[#E5EAF2] bg-[#F8FAFD] p-4">
            <div className="space-y-1">
              <Label
                htmlFor="statusFonte"
                className="text-[13px] font-semibold text-[#101A40]"
              >
                Fonte ativa
              </Label>

              <p className="text-[11px] leading-4 text-[#8291AA]">
                {dados.ativo
                  ? "Fonte habilitada para futuras coletas."
                  : "Fonte pausada até ser ativada novamente."}
              </p>
            </div>

          <Switch
            id="statusFonte"
            checked={dados.ativo ?? true}
            onCheckedChange={(valor) => atualizar("ativo", valor)}
            className="data-[state=checked]:bg-[#E8D65E]"
          />
          </div>

          {/* Informação */}
          <div className="flex items-start gap-3 rounded-lg bg-[#F3F6FB] px-4 py-3">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0 text-[#607398]"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 11v6M12 7h.01" />
            </svg>

            <p className="text-[11px] leading-[17px] text-[#7183A6]">
              O cadastro registra as configurações da fonte
              nesta demonstração. A coleta automática será
              realizada quando o backend estiver integrado.
            </p>
          </div>

          {/* Ações */}
          <div className="flex flex-col gap-2 pt-1">
            <Button
              type="submit"
              className="h-11 w-full rounded-lg bg-[#F3E69A] text-[13px] font-semibold text-[#101A40] shadow-none hover:bg-[#E9DA80]"
            >
              {fonte ? "Salvar alterações" : "Adicionar fonte"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={aoFechar}
              className="h-10 w-full rounded-lg border-[#DFE6F0] bg-white text-[13px] text-[#344469] shadow-none hover:bg-[#F7F9FC]"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
