import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  dialogSecondaryAction,
} from "@/components/ui/dialog";

export default function LogsColeta({ aberto, aoFechar, logs = [], demo }) {
  return (
    <Dialog
      open={aberto}
      onOpenChange={(open) => {
        if (!open) aoFechar();
      }}
    >
      <DialogContent size="lg">
        <DialogHeader eyebrow="Administração">
          <DialogTitle>Registros de coleta</DialogTitle>
          <DialogDescription>
            {demo
              ? "Registros ilustrativos de erros e avisos de coleta nesta demonstração."
              : "Últimos erros informados pelas fontes cadastradas."}
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div className="min-w-0 divide-y divide-[#E8EDF4]">
            {logs.length ? (
              logs.map((log) => (
                <article key={log.id} className="min-w-0 space-y-2 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-sm font-medium text-wisen-titulo">{log.fonte}</h3>
                    <span
                      className={`text-xs font-medium ${log.status === "Falha" ? "text-[#9B6266]" : "text-[#866D16]"}`}
                    >
                      {log.status}
                    </span>
                  </div>
                  <p className="break-words text-sm leading-6 text-[#7182A1]">{log.erro}</p>
                  <p className="text-xs text-[#8190A8]">{log.data}</p>
                </article>
              ))
            ) : (
              <div className="py-9 text-center">
                <h3 className="text-sm font-medium text-wisen-titulo">
                  Nenhum erro de coleta informado
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#7182A1]">
                  Os erros informados pelas fontes aparecerão aqui.
                </p>
              </div>
            )}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={aoFechar} className={dialogSecondaryAction}>
            Fechar registros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
