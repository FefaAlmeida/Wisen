
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TabelaUsuarios({
  usuarios,
  selecionados,
  aoSelecionar,
  aoSelecionarTodos,
  aoAbrirUsuario,
}) {
  const todosSelecionados =
    usuarios.length > 0 &&
    usuarios.every((usuario) => selecionados.includes(usuario.id));

  return (
    <div className="w-full overflow-x-auto">
      <Table className="w-full min-w-[800px]">
        <TableHeader>
          <TableRow className="bg-[#F1F5FA] hover:bg-[#F1F5FA]">
            <TableHead className="w-12 pl-4">
              <Checkbox
                checked={todosSelecionados}
                onCheckedChange={(valor) =>
                  aoSelecionarTodos(Boolean(valor))
                }
                aria-label="Selecionar todos os usuários da página"
              />
            </TableHead>

            <TableHead className="text-[12px] text-[#344469]">
              Usuário
            </TableHead>

            <TableHead className="text-[12px] text-[#344469]">
              E-mail
            </TableHead>

            <TableHead className="text-[12px] text-[#344469]">
              Tipo de permissão
            </TableHead>

            <TableHead className="text-[12px] text-[#344469]">
              Status
            </TableHead>

            <TableHead className="text-[12px] text-[#344469]">
              Data de cadastro
            </TableHead>

            <TableHead className="text-right text-[12px] text-[#344469]">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {usuarios.map((usuario) => (
            <TableRow
              key={usuario.id}
              className="cursor-pointer border-[#E8EDF4] hover:bg-[#F7F9FD]"
              onClick={() => aoAbrirUsuario(usuario)}
            >
              <TableCell
                className="pl-4"
                onClick={(evento) => evento.stopPropagation()}
              >
                <Checkbox
                  checked={selecionados.includes(usuario.id)}
                  onCheckedChange={(valor) =>
                    aoSelecionar(usuario.id, Boolean(valor))
                  }
                  aria-label={`Selecionar ${usuario.nome}`}
                />
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E7EEFB] text-[12px] font-semibold text-[#253B71]">
                    {usuario.iniciais}
                  </div>

                  <span className="whitespace-nowrap text-[13px] font-semibold text-[#101A40]">
                    {usuario.nome}
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-[12px] text-[#7183A6]">
                {usuario.email}
              </TableCell>

              <TableCell>
                <Badge
                  className={`rounded-full border-0 px-3 py-1 text-[11px] font-medium shadow-none ${
                    usuario.permissao === "Admin"
                      ? "bg-[#E7EEFC] text-[#30466E]"
                      : "bg-[#FFF7DE] text-[#8B741D]"
                  }`}
                >
                  {usuario.permissao}
                </Badge>
              </TableCell>

              <TableCell>
                <Badge
                  className={`gap-2 rounded-full border-0 px-3 py-1 text-[11px] font-medium shadow-none ${
                    usuario.status === "Ativo"
                      ? "bg-[#E6F6ED] text-[#248554]"
                      : "bg-[#FDEBED] text-[#C34048]"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      usuario.status === "Ativo"
                        ? "bg-[#35AE75]"
                        : "bg-[#E24A55]"
                    }`}
                  />
                  {usuario.status}
                </Badge>
              </TableCell>

              <TableCell className="whitespace-nowrap text-[12px] text-[#7183A6]">
                {usuario.dataCadastro}
              </TableCell>

              <TableCell className="text-right">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={(evento) => {
                    evento.stopPropagation();
                    aoAbrirUsuario(usuario);
                  }}
                  aria-label={`Ver informações de ${usuario.nome}`}
                  className="text-[#344469]"
                >
                  <span className="text-xl">⋮</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {usuarios.length === 0 && (
        <p className="py-12 text-center text-sm text-[#8192B2]">
          Nenhum usuário encontrado.
        </p>
      )}
    </div>
  );
}
