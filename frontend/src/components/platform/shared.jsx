"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AdminSidebar } from "@/components/admin/adminSidebar";
import { BarraBusca } from "@/components/barraBusca";
import { ConnectionsBackground } from "@/components/homeCliente/connectionsBackground";
import MenuPerfil from "@/components/homeCliente/menuPerfil";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { requisitar } from "@/services/api";

export { requisitar };

const generationError = (error) =>
  ({
    BUDGET_EXHAUSTED:
      "O limite mensal de IA foi atingido. Conteúdos já disponíveis continuam acessíveis.",
    DAILY_LIMIT: "Você atingiu seu limite de gerações de hoje. Tente novamente amanhã.",
    EMAIL_UNVERIFIED: "Confirme seu e-mail para gerar explicações.",
  })[error] ?? error;
export const statusText = { gap: "Lacuna", review: "Em revisão", mastered: "Dominado" };
export function useResource(path) {
  const [state, setState] = useState({ data: null, error: "", loading: true });
  const [version, reload] = useState(0);
  // biome-ignore lint/correctness/useExhaustiveDependencies: version triggers an explicit retry.
  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, error: "", loading: true });
    requisitar(path, { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) setState({ data, error: "", loading: false });
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setState({ data: null, error: error.message, loading: false });
      });
    return () => controller.abort();
  }, [path, version]);
  return { ...state, reload: () => reload((v) => v + 1) };
}
export function Frame({
  title,
  active = "Início",
  admin = false,
  pageSearch,
  onPageSearchChange,
  children,
}) {
  return (
    <div className="min-h-screen bg-[#F0F4F9] text-[#101A40]">
      {admin ? <AdminSidebar activeItem={active} /> : <Sidebar activeItem={active} />}
      <main className="relative isolate min-h-screen px-5 pb-16 pt-20 sm:ml-[128px] sm:px-8 sm:pt-8 lg:ml-[220px]">
        <ConnectionsBackground fadeTop={false} />
        <div className="relative z-10 mx-auto max-w-6xl">
          <header className="mb-8 flex items-center justify-between gap-4">
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <div className="flex shrink-0 items-center gap-3">
              <div className="hidden w-56 xl:block">
                <BarraBusca value={pageSearch} onQueryChange={onPageSearchChange} />
              </div>
              <MenuPerfil />
            </div>
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}
export function State({ resource, children }) {
  if (resource.loading) return <p role="status">Carregando…</p>;
  if (resource.error)
    return (
      <div role="alert" className="space-y-3 rounded-xl bg-white p-5">
        <p>{resource.error}</p>
        <Button onClick={resource.reload}>Tentar novamente</Button>
      </div>
    );
  return children;
}
export function Panel({ title, children }) {
  return (
    <section className="mb-6 rounded-2xl border border-[#DEE5ED] bg-white p-5 sm:p-7">
      {title && <h2 className="mb-4 text-xl font-semibold">{title}</h2>}
      {children}
    </section>
  );
}
export function EventList({ items = [] }) {
  return items.length ? (
    <div className="divide-y divide-[#DEE5ED]">
      {items.map((item) => (
        <article key={item.id} className="py-5 first:pt-0">
          <p className="mb-2 text-xs text-[#65748B]">
            {new Date(item.updated_at).toLocaleDateString("pt-BR")}
            {item.source_count ? ` · ${item.source_count} fonte(s)` : ""}
          </p>
          <h2 className="text-xl font-semibold">
            <Link className="hover:underline" href={`/paginaEvento?id=${item.id}`}>
              {item.title}
            </Link>
          </h2>
          <p className="mt-2 max-w-prose text-sm leading-7 text-[#65748B]">{item.summary}</p>
        </article>
      ))}
    </div>
  ) : (
    <p className="text-[#65748B]">
      Ainda não há eventos disponíveis. Novos conteúdos aparecerão após o processamento das fontes.
    </p>
  );
}
export function SaveButton({ type, id }) {
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);
  async function save() {
    setBusy(true);
    try {
      await requisitar("/saved", { method: "POST", body: { type, id } });
      setFeedback("Salvo na sua biblioteca");
    } catch (e) {
      setFeedback(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <span className="inline-flex flex-wrap items-center gap-3">
      <Button variant="outline" disabled={busy} onClick={save}>
        Salvar
      </Button>
      <span role="status" className="text-sm">
        {feedback}
      </span>
    </span>
  );
}
export function Familiarity() {
  const resource = useResource("/preferences/familiarity");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function select(value) {
    setBusy(true);
    try {
      await requisitar("/preferences/familiarity", {
        method: "PUT",
        body: { familiarity: value || null },
      });
      setMessage("Familiaridade salva. Seu conhecimento será acompanhado durante o uso.");
      resource.reload();
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Panel title="Seu ponto de partida">
      <label htmlFor="familiaridade" className="mb-3 block text-sm text-[#65748B]">
        Como você se sente ao ler sobre economia? Isso ajusta a linguagem, sem testar seu
        conhecimento.
      </label>
      <select
        id="familiaridade"
        disabled={busy || resource.loading}
        value={resource.data?.familiarity ?? ""}
        onChange={(e) => select(e.target.value)}
        className="max-w-full rounded-lg border bg-white p-3"
      >
        <option value="">Prefiro responder depois</option>
        <option value="beginner">Estou começando</option>
        <option value="basic">Entendo o básico</option>
        <option value="experienced">Já acompanho economia</option>
      </select>
      <p role="status" className="mt-3 text-sm">
        {message || resource.error}
      </p>
    </Panel>
  );
}
export function AccountNotice() {
  const resource = useResource("/account/status");
  const [message, setMessage] = useState("");
  if (!resource.data || resource.data.user.email_verified_at) return null;
  return (
    <Panel title="Confirme seu e-mail">
      <p className="mb-4 text-sm">
        Você pode explorar o conteúdo. Para gerar explicações personalizadas, confirme seu e-mail.
      </p>
      <Button
        variant="outline"
        onClick={async () => {
          try {
            setMessage((await requisitar("/account/verification", { method: "POST" })).message);
          } catch (e) {
            setMessage(e.message);
          }
        }}
      >
        Reenviar confirmação
      </Button>
      <p role="status" className="mt-3 text-sm">
        {message}
      </p>
    </Panel>
  );
}
export function Generation({ target, operation = "explanation", passage, onCompleted }) {
  const [task, setTask] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!task || !["pending", "processing"].includes(task.status)) return;
    const controller = new AbortController();
    const timer = setTimeout(
      () =>
        requisitar(`/generations/${task.id}`, { signal: controller.signal })
          .then((data) => {
            setTask(data);
            if (data.status === "completed") onCompleted?.();
          })
          .catch((e) => {
            if (!controller.signal.aborted) setError(e.message);
          }),
      1500,
    );
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [task, onCompleted]);
  async function generate(op) {
    setBusy(true);
    setError("");
    try {
      const result = await requisitar("/generations", {
        method: "POST",
        body: { ...target, operation: op, ...(passage ? { passage } : {}) },
      });
      setTask(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const pending = task && ["pending", "processing"].includes(task.status);
  return (
    <div className="space-y-4">
      <Button disabled={busy || pending} onClick={() => generate(operation)}>
        {busy || pending
          ? "Preparando explicação…"
          : operation === "passage"
            ? "Explicar trecho"
            : operation === "concept"
              ? "Explicar conceito"
              : "Explicar para mim"}
      </Button>
      {error && <p role="alert">{error}</p>}
      {task?.error && <p role="status">{generationError(task.error)}</p>}
      {task?.result?.text && (
        <div className="max-w-prose whitespace-pre-wrap text-base leading-8">
          <p>{task.result.text}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button variant="outline" disabled={busy || pending} onClick={() => generate("deepen")}>
              Aprofundar
            </Button>
            <Feedback taskId={task.id} />
          </div>
        </div>
      )}
    </div>
  );
}
function Feedback({ taskId }) {
  const [message, setMessage] = useState("");
  async function send(useful) {
    try {
      await requisitar(`/generations/${taskId}/feedback`, {
        method: "POST",
        body: { useful, clear: useful, unnecessary: !useful },
      });
      setMessage("Feedback registrado");
    } catch (e) {
      setMessage(e.message);
    }
  }
  return (
    <>
      <Button variant="outline" onClick={() => send(true)}>
        Ajudou a entender
      </Button>
      <Button variant="outline" onClick={() => send(false)}>
        Preciso de outra explicação
      </Button>
      <span role="status" className="text-sm">
        {message}
      </span>
    </>
  );
}

export function Exposure({ concepts }) {
  const ids = concepts.map((c) => c.id).join(",");
  const sent = useRef(new Set());
  useEffect(() => {
    for (const conceptId of ids.split(",").filter(Boolean)) {
      if (sent.current.has(conceptId)) continue;
      sent.current.add(conceptId);
      requisitar("/interactions", {
        method: "POST",
        body: { conceptId, type: "exposure", requestId: crypto.randomUUID() },
      }).catch(() => sent.current.delete(conceptId));
    }
  }, [ids]);
  return null;
}
