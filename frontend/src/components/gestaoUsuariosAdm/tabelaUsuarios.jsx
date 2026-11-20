import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UserStatus({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-medium ${status === "Ativo" ? "text-emerald-700" : "text-[#9B6266]"}`}
    >
      <span
        aria-hidden="true"
        className={`size-1.5 shrink-0 rounded-full ${status === "Ativo" ? "bg-emerald-500" : "bg-[#BF7B80]"}`}
      />
      {status}
    </span>
  );
}
function Account({ user, onOpen }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        aria-hidden="true"
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#EEF2F8] text-xs font-medium text-[#526584]"
      >
        {user.iniciais}
      </span>
      <div className="min-w-0">
        <button
          type="button"
          onClick={() => onOpen(user)}
          className="text-left text-sm font-medium text-wisen-titulo outline-none hover:underline focus-visible:underline"
        >
          {user.nome}
        </button>
        <p className="mt-1 break-all text-xs text-[#7182A1]">{user.email}</p>
      </div>
    </div>
  );
}
export default function TabelaUsuarios({ usuarios, aoAbrirUsuario }) {
  if (!usuarios.length)
    return (
      <div className="px-5 py-14 text-center">
        <h3 className="text-sm font-medium text-wisen-titulo">Nenhum usuário encontrado</h3>
        <p className="mt-2 text-sm text-[#7182A1]">
          Tente outro nome, e-mail ou combinação de filtros.
        </p>
      </div>
    );
  return (
    <div className="@container/users min-w-0">
      <div className="hidden overflow-x-auto @min-[48rem]/users:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Contas cadastradas e configurações de acesso</caption>
          <thead className="border-y border-[#E8EDF4] bg-[#FAFBFD]">
            <tr className="text-[10px] font-semibold tracking-wider text-[#8190A8] uppercase">
              <th scope="col" className="px-5 py-3">
                Usuário
              </th>
              <th scope="col" className="px-4 py-3">
                Perfil
              </th>
              <th scope="col" className="px-4 py-3">
                Acesso
              </th>
              <th scope="col" className="px-4 py-3">
                Cadastro
              </th>
              <th scope="col" className="px-5 py-3 text-right">
                <span className="sr-only">Gerenciar conta</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDF0F5]">
            {usuarios.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-wisen-admin-hover">
                <td className="px-5 py-4">
                  <Account user={user} onOpen={aoAbrirUsuario} />
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-md px-2 py-1 text-xs ${user.permissao === "Admin" ? "bg-[#EEF2F8] text-[#526584]" : "text-[#7182A1]"}`}
                  >
                    {user.permissao === "Admin" ? "Administrador" : "Usuário"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <UserStatus status={user.status} />
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-xs tabular-nums text-[#7182A1]">
                  {user.dataCadastro}
                </td>
                <td className="px-5 py-4 text-right">
                  <Button
                    variant="ghost"
                    onClick={() => aoAbrirUsuario(user)}
                    aria-label={`Gerenciar ${user.nome}`}
                    className="text-xs text-[#526584] hover:bg-wisen-admin-hover"
                  >
                    Gerenciar
                    <ArrowUpRight className="size-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="divide-y divide-[#E8EDF4] border-t border-[#E8EDF4] @min-[48rem]/users:hidden">
        {usuarios.map((user) => (
          <article key={user.id} className="min-w-0 space-y-4 p-4 sm:p-5">
            <Account user={user} onOpen={aoAbrirUsuario} />
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <UserStatus status={user.status} />
              <span className="text-[#7182A1]">
                {user.permissao === "Admin" ? "Administrador" : "Usuário"}
              </span>
              <span className="text-[#7182A1]">Desde {user.dataCadastro}</span>
            </div>
            <Button
              variant="outline"
              onClick={() => aoAbrirUsuario(user)}
              aria-label={`Gerenciar ${user.nome}`}
              className="h-10 w-full border-wisen-borda text-xs text-[#526584] hover:bg-wisen-admin-hover"
            >
              Gerenciar conta
              <ArrowUpRight className="size-3.5" />
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
