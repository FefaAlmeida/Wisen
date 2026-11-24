import { ArrowUpRight } from "lucide-react";
import { AdminZuzuPortrait } from "@/components/admin/adminZuzuPortrait";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function UserStatus({ status }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
        status === "Ativo" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
      }`}
    >
      {status}
    </span>
  );
}
function Account({ user }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar size="lg" aria-hidden="true">
        <AvatarImage src={user.avatarUrl} alt="" />
        <AvatarFallback className="bg-[#EEF2F8] text-xs font-medium text-[#526584]">
          {user.iniciais}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="text-sm font-medium text-wisen-titulo">{user.nome}</p>
        <p className="mt-1 break-all text-xs text-[#7182A1]">{user.email}</p>
      </div>
    </div>
  );
}
export default function TabelaUsuarios({ usuarios, aoAbrirUsuario }) {
  if (!usuarios.length)
    return (
      <div className="px-5 py-14 text-center">
        <AdminZuzuPortrait className="mx-auto mb-3" />
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
          <thead className="border-y border-[#E8EDF4]">
            <tr className="text-[10px] font-bold tracking-wider text-[#30466E] uppercase">
              <th scope="col" className="px-5 py-3">
                Usuário
              </th>
              <th scope="col" className="px-4 py-3">
                Perfil
              </th>
              <th scope="col" className="px-4 py-3 text-center">
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
                  <Account user={user} />
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs ${user.permissao === "Admin" ? "text-[#526584]" : "text-[#7182A1]"}`}
                  >
                    {user.permissao === "Admin" ? "Administrador" : "Usuário"}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
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
                    className="text-xs text-[#526584] hover:bg-transparent hover:text-wisen-destaque dark:hover:bg-transparent"
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
            <Account user={user} />
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
              className="h-10 w-full border-wisen-borda text-xs text-[#526584] hover:bg-wisen-admin-control-hover active:bg-wisen-admin-control-hover"
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
