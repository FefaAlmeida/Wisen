
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TabelaFontes({
  fontes,
  aoEditar,
  aoAlternarStatus,
}) {
  return (
    <div className="w-full overflow-x-auto">
      <Table className="w-full min-w-[850px]">
        <TableHeader>
          <TableRow className="border-none bg-[#F1F5FA] hover:bg-[#F1F5FA]">
            <TableHead className="h-12 pl-4 text-xs text-[#52617E]">
              Veículo
            </TableHead>
            <TableHead className="text-xs text-[#52617E]">
              URL do feed RSS
            </TableHead>
            <TableHead className="text-xs text-[#52617E]">
              Status
            </TableHead>
            <TableHead className="text-xs text-[#52617E]">
              Última coleta
            </TableHead>
            <TableHead className="text-xs text-[#52617E]">
              Frequência
            </TableHead>
            <TableHead className="pr-4 text-right text-xs text-[#52617E]">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {fontes.map((fonte) => (
            <TableRow
              key={fonte.id}
              className="border-[#E8EDF4] hover:bg-[#F8FAFD]"
            >
              <TableCell className="py-4 pl-4 font-semibold text-[#101A40]">
                {fonte.nome}
              </TableCell>

              <TableCell className="max-w-[350px] truncate text-[13px] text-[#617398]">
                {fonte.url}
              </TableCell>

              <TableCell>
                <Badge
                  className={`gap-2 rounded-full border-0 px-3 py-1 text-xs font-medium shadow-none ${
                    fonte.ativo
                      ? "bg-[#E9F8EE] text-[#217A4B]"
                      : "bg-[#F0F3F8] text-[#607398]"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      fonte.ativo ? "bg-[#24A65A]" : "bg-[#8494AC]"
                    }`}
                  />
                  {fonte.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>

              <TableCell className="text-[13px] text-[#617398]">
                {fonte.ultimaColeta}
              </TableCell>

              <TableCell className="text-[13px] text-[#617398]">
                {fonte.frequencia}
              </TableCell>

              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => aoEditar(fonte)}
                    aria-label={`Editar ${fonte.nome}`}
                    className="h-9 w-9 border-[#DFE6F0] bg-white text-[#101A40] shadow-none"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path d="M12 20h9M16 4l4 4-11 11-5 1 1-5L16 4Z" />
                    </svg>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => aoAlternarStatus(fonte.id)}
                    aria-label={fonte.ativo ? "Pausar fonte" : "Ativar fonte"}
                    className="h-9 w-9 border-[#DFE6F0] bg-white text-[#101A40] shadow-none"
                  >
                    {fonte.ativo ? "Ⅱ" : "▶"}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {fontes.length === 0 && (
        <p className="py-10 text-center text-sm text-[#8392AD]">
          Nenhuma fonte encontrada.
        </p>
      )}
    </div>
  );
}
