
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const logs = [
  {
    id: 1,
    data: "01/10/2026 08:12",
    fonte: "Agência Brasil",
    erro: "Timeout na conexão com o feed RSS (30s)",
    status: "Falha",
  },
  {
    id: 2,
    data: "30/09/2026 22:41",
    fonte: "Portal Tecnologia",
    erro: "Feed indisponível (HTTP 503)",
    status: "Falha",
  },
  {
    id: 3,
    data: "30/09/2026 14:18",
    fonte: "Meio Ambiente News",
    erro: "XML inválido no feed",
    status: "Falha",
  },
  {
    id: 4,
    data: "29/09/2026 19:07",
    fonte: "Valor Econômico",
    erro: "Link quebrado em item do feed",
    status: "Aviso",
  },
];

export default function LogsColeta() {
  return (
    <Card className="gap-0 rounded-xl border border-[#E3E9F1] bg-white p-0 shadow-none">
      <CardContent className="p-5">
        <h2 className="mb-4 text-[20px] font-semibold text-[#101A40]">
          Logs de erro de coleta
        </h2>

        <div className="overflow-x-auto">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow className="bg-[#F1F5FA] hover:bg-[#F1F5FA]">
                <TableHead>Data e hora</TableHead>
                <TableHead>Fonte</TableHead>
                <TableHead>Erro</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-[13px] text-[#617398]">
                    {log.data}
                  </TableCell>

                  <TableCell className="text-[13px] text-[#617398]">
                    {log.fonte}
                  </TableCell>

                  <TableCell className="text-[13px] text-[#617398]">
                    {log.erro}
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={`gap-2 rounded-full border-0 px-3 py-1 text-xs shadow-none ${
                        log.status === "Falha"
                          ? "bg-[#FDEDEE] text-[#A72C31]"
                          : "bg-[#FFF6E5] text-[#A87313]"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          log.status === "Falha"
                            ? "bg-[#E53A35]"
                            : "bg-[#F1A721]"
                        }`}
                      />
                      {log.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
