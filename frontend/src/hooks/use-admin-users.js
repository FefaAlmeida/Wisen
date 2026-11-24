"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usuariosIniciais } from "@/data/usuariosDemo";
import { toast } from "@/lib/toast";
import { requisitar } from "@/services/api";

const storageKey = "wisen:usuarios:v1";
const formatDate = (value, time = false) =>
  value
    ? new Date(value)[time ? "toLocaleString" : "toLocaleDateString"]("pt-BR")
    : "Não informado";
function describe(before, after) {
  const changes = [];
  if (before.permissao !== after.permissao)
    changes.push(
      `Perfil: ${before.permissao === "Admin" ? "Administrador" : "Usuário"} → ${after.permissao === "Admin" ? "Administrador" : "Usuário"}`,
    );
  if (before.status !== after.status) changes.push(`Acesso: ${before.status} → ${after.status}`);
  if ((before.limite ?? 30) !== (after.limite ?? 30))
    changes.push(`Limite diário: ${before.limite ?? 30} → ${after.limite}`);
  return changes.join(" · ");
}
export function useAdminUsers(demo) {
  const [users, setUsers] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [historyError, setHistoryError] = useState("");
  const lock = useRef(false);
  const reload = useCallback(
    async (signal) => {
      setLoading(true);
      setHistoryLoading(true);
      setError("");
      setHistoryError("");
      try {
        if (demo) {
          const stored = localStorage.getItem(storageKey);
          const parsed = stored ? JSON.parse(stored) : { users: usuariosIniciais, history: [] };
          if (!Array.isArray(parsed.users) || !Array.isArray(parsed.history))
            throw new Error("Não foi possível ler os dados salvos da demonstração.");
          setUsers(parsed.users);
          setHistory(parsed.history);
        } else {
          const accountsRequest = requisitar("/admin/users", { signal })
            .then((accounts) =>
              accounts.items.map((user) => {
                const name = user.name.trim();
                return {
                  id: user.id,
                  nome: name || "Nome não informado",
                  email: user.email,
                  avatarUrl: user.has_avatar ? `/api/admin/users/${user.id}/avatar` : undefined,
                  iniciais: (name || user.email)
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")
                    .toLocaleUpperCase("pt-BR"),
                  permissao: user.role === "admin" ? "Admin" : "Usuário",
                  status: user.active ? "Ativo" : "Bloqueado",
                  dataCadastro: formatDate(user.created_at),
                  limite: user.generation_limit,
                };
              }),
            )
            .then((accounts) => {
              if (!signal?.aborted) setUsers(accounts);
              return accounts;
            })
            .catch((failure) => {
              if (!signal?.aborted) setError(failure.message);
              return [];
            })
            .finally(() => {
              if (!signal?.aborted) setLoading(false);
            });
          const auditRequest = requisitar("/admin/audit", { signal }).catch((failure) => {
            if (!signal?.aborted) setHistoryError(failure.message);
            return null;
          });
          const [accounts, audit] = await Promise.all([accountsRequest, auditRequest]);
          if (signal?.aborted || !audit) return;
          const names = new Map(accounts.map((user) => [user.id, user.nome]));
          setHistory(
            audit.items
              .filter((entry) => entry.action === "user")
              .map((entry) => {
                const before = entry.before_data || {};
                const after = entry.after_data || {};
                return {
                  id: entry.id,
                  usuarioId: entry.target_id,
                  usuario: names.get(entry.target_id) || "Conta indisponível",
                  data: formatDate(entry.created_at, true),
                  descricao:
                    describe(
                      {
                        permissao: before.role === "admin" ? "Admin" : "Usuário",
                        status: before.active ? "Ativo" : "Bloqueado",
                        limite: before.generation_limit,
                      },
                      {
                        permissao: (after.role ?? before.role) === "admin" ? "Admin" : "Usuário",
                        status: after.active ? "Ativo" : "Bloqueado",
                        limite: after.generationLimit,
                      },
                    ) || "Configurações da conta salvas.",
                };
              }),
          );
        }
      } catch (failure) {
        if (!signal?.aborted) {
          if (demo) setError(failure.message);
          setHistoryError(failure.message);
        }
      } finally {
        if (!signal?.aborted) {
          if (demo) setLoading(false);
          setHistoryLoading(false);
        }
      }
    },
    [demo],
  );
  useEffect(() => {
    const controller = new AbortController();
    reload(controller.signal);
    return () => controller.abort();
  }, [reload]);
  async function save(id, values) {
    if (lock.current) return false;
    const current = users.find((user) => user.id === id);
    if (!current) return false;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      const changes = describe(current, { ...current, ...values });
      if (!changes) return true;
      if (demo) {
        const nextUsers = users.map((user) => (user.id === id ? { ...user, ...values } : user));
        const nextHistory = [
          {
            id: crypto.randomUUID(),
            usuarioId: id,
            usuario: current.nome,
            descricao: changes,
            data: new Date().toLocaleString("pt-BR"),
          },
          ...history,
        ];
        localStorage.setItem(
          storageKey,
          JSON.stringify({ users: nextUsers, history: nextHistory }),
        );
        setUsers(nextUsers);
        setHistory(nextHistory);
      } else {
        await requisitar("/admin/actions", {
          method: "POST",
          body: {
            action: "user",
            id,
            active: values.status === "Ativo",
            generationLimit: Number(values.limite),
            ...(current.permissao !== "Admin" && values.permissao === "Admin" && { role: "admin" }),
          },
        });
        await reload();
      }
      return true;
    } catch (failure) {
      toast.error(
        demo
          ? "Não foi possível salvar neste navegador. Tente novamente."
          : failure.message || "Não foi possível atualizar a conta.",
      );
      return false;
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return { users, history, loading, historyLoading, busy, error, historyError, reload, save };
}
