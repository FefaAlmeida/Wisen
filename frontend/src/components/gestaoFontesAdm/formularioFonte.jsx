"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogForm,
  DialogHeader,
  DialogTitle,
  dialogPrimaryAction,
  dialogSecondaryAction,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export const frequenciasFonte = [
  "A cada 15 min",
  "30 minutos",
  "1 hora",
  "6 horas",
  "12 horas",
  "24 horas",
];
const vazio = { nome: "", url: "", categoria: "", frequencia: "A cada 15 min", ativo: true };
const control =
  "mt-2 h-11 w-full min-w-0 rounded-lg border border-wisen-borda bg-white px-3 text-sm text-[#30466E] outline-none hover:bg-wisen-admin-hover focus-visible:ring-2 focus-visible:ring-[#D7BF4D]/40";
export default function FormularioFonte({
  aberto,
  aoFechar,
  fonte,
  aoSalvar,
  aoColetar,
  busy,
  demo = true,
}) {
  const [dados, setDados] = useState(vazio);
  useEffect(() => {
    if (aberto) setDados(fonte ? { ...vazio, ...fonte } : vazio);
  }, [aberto, fonte]);
  function update(field, value) {
    setDados((current) => ({ ...current, [field]: value }));
  }
  return (
    <Dialog
      open={aberto}
      onOpenChange={(open) => {
        if (!open && !busy) aoFechar();
      }}
    >
      <DialogContent data-wisen-area="admin">
        <DialogHeader eyebrow="Fontes de notícias">
          <DialogTitle>{fonte ? "Gerenciar fonte" : "Adicionar fonte"}</DialogTitle>
          <DialogDescription>
            {fonte
              ? "Confira as informações e configure o acesso desta fonte às próximas coletas."
              : "Configure o veículo e o endereço RSS para organizar a coleta de notícias."}
          </DialogDescription>
        </DialogHeader>
        <DialogForm
          onSubmit={(event) => {
            event.preventDefault();
            if (dados.nome.trim() && dados.url.trim())
              aoSalvar({ ...dados, nome: dados.nome.trim(), url: dados.url.trim() });
          }}
        >
          <DialogBody>
            <fieldset disabled={busy} className="min-w-0 space-y-5">
              <div className="admin-dialog-panel space-y-4">
                <div>
                  <label htmlFor="nomeFonte" className="text-xs font-medium text-[#7182A1]">
                    Nome do veículo
                  </label>
                  <Input
                    id="nomeFonte"
                    required
                    readOnly={!demo}
                    maxLength={150}
                    value={dados.nome}
                    onChange={(event) => update("nome", event.target.value)}
                    placeholder="Ex.: Agência Brasil"
                    className={control}
                  />
                </div>
                <div>
                  <label htmlFor="urlFonte" className="text-xs font-medium text-[#7182A1]">
                    URL do feed RSS
                  </label>
                  <Input
                    id="urlFonte"
                    required
                    type="url"
                    readOnly={!demo}
                    value={dados.url}
                    onChange={(event) => update("url", event.target.value)}
                    placeholder="https://exemplo.com/feed.xml"
                    className={control}
                  />
                  <p className="mt-2 text-xs leading-5 text-wisen-texto-suave">
                    Endereço que disponibiliza as notícias em formato RSS ou Atom.
                  </p>
                </div>
              </div>
              {demo ? (
                <div className="admin-dialog-panel grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="categoriaFonte" className="text-xs font-medium text-[#7182A1]">
                      Categoria principal
                    </label>
                    <select
                      id="categoriaFonte"
                      className={control}
                      value={dados.categoria}
                      onChange={(event) => update("categoria", event.target.value)}
                    >
                      <option value="">Selecione uma categoria</option>
                      {[
                        "Economia",
                        "Política",
                        "Tecnologia",
                        "Meio ambiente",
                        "Educação",
                        "Geral",
                      ].map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="frequenciaFonte" className="text-xs font-medium text-[#7182A1]">
                      Frequência de coleta
                    </label>
                    <select
                      id="frequenciaFonte"
                      className={control}
                      value={dados.frequencia}
                      onChange={(event) => update("frequencia", event.target.value)}
                    >
                      {frequenciasFonte.map((frequency) => (
                        <option key={frequency}>{frequency}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="admin-dialog-panel">
                  <p className="text-xs leading-5 text-[#7182A1]">
                    Frequência: {dados.frequencia}
                    <br />
                    Última coleta: {fonte?.ultimaColeta}
                  </p>
                </div>
              )}
              <div className="admin-dialog-panel flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <label htmlFor="statusFonte" className="text-sm font-medium text-wisen-titulo">
                    Fonte ativa
                  </label>
                  <p className="mt-1 text-xs leading-5 text-[#7182A1]">
                    {dados.ativo
                      ? "Disponível para as próximas coletas."
                      : "Coletas pausadas até a fonte ser ativada."}
                  </p>
                </div>
                <Switch
                  id="statusFonte"
                  checked={dados.ativo}
                  onCheckedChange={(value) => update("ativo", value)}
                  className="shrink-0 data-checked:bg-[#EBDD80]"
                />
              </div>
              {demo && (
                <p className="rounded-lg border border-[#E8DFBA] bg-[#FBF7E5] px-3 py-2 text-xs leading-5 text-[#526584]">
                  Configurações de demonstração, salvas neste navegador.
                </p>
              )}
              {!demo && fonte && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={busy || !fonte.ativo || !dados.ativo}
                  onClick={() => aoColetar(fonte)}
                  className="h-10 w-full border-wisen-borda text-[#526584] hover:bg-wisen-admin-hover"
                >
                  Coletar agora
                </Button>
              )}
            </fieldset>
          </DialogBody>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={aoFechar}
              className={dialogSecondaryAction}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={busy} className={dialogPrimaryAction}>
              {busy ? "Salvando..." : fonte ? "Salvar alterações" : "Adicionar fonte"}
            </Button>
          </DialogFooter>
        </DialogForm>
      </DialogContent>
    </Dialog>
  );
}
