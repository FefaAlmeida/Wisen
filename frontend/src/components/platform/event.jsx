"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Exposure,
  Frame,
  Generation,
  Panel,
  requisitar,
  SaveButton,
  State,
  statusText,
  useResource,
} from "./shared";
export default function EventPage() {
  const id = useSearchParams().get("id");
  const resource = useResource(id ? `/events/${id}` : "/feed");
  const [message, setMessage] = useState("");
  if (!id)
    return (
      <Frame title="Acontecimentos">
        <Link href="/paginaExplorar">Escolha um evento em Explorar</Link>
      </Frame>
    );
  const data = resource.data;
  async function gap(conceptId) {
    try {
      await requisitar("/interactions", {
        method: "POST",
        body: { conceptId, type: "gap", requestId: crypto.randomUUID() },
      });
      setMessage("Lacuna registrada. Abra o conceito para ver a explicação e as revisões.");
      resource.reload();
    } catch (e) {
      setMessage(e.message);
    }
  }
  return (
    <Frame title="Acontecimento" active="Notícias">
      <State resource={resource}>
        {data && (
          <>
            <Exposure concepts={data.concepts} />
            <Link href="/paginaExplorar" className="mb-4 inline-block underline">
              Voltar para notícias
            </Link>
            <Panel>
              <h2 className="mb-4 max-w-prose text-3xl font-semibold">{data.title}</h2>
              <p className="mb-6 max-w-prose leading-8 text-[#65748B]">{data.summary}</p>
              <SaveButton type="event" id={id} />
            </Panel>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
              <div>
                <Panel title="Explicação para você">
                  <Generation target={{ eventId: id }} />
                </Panel>
                <Panel title="Fontes e linha do tempo">
                  <ol className="space-y-5">
                    {data.articles.map((a) => (
                      <li key={a.id}>
                        <p className="text-xs text-[#65748B]">
                          {a.published_at
                            ? new Date(a.published_at).toLocaleString("pt-BR")
                            : "Data não informada"}{" "}
                          · {a.source}
                        </p>
                        <Link
                          className="mt-2 block font-medium underline"
                          href={`/artigo?id=${a.id}`}
                        >
                          {a.title}
                        </Link>
                        <a
                          className="text-sm underline"
                          href={a.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Publicação original
                        </a>
                      </li>
                    ))}
                  </ol>
                </Panel>
              </div>
              <div>
                <Panel title="Conceitos relacionados">
                  {data.concepts.map((c) => (
                    <div key={c.id} className="mb-4 border-b pb-4">
                      <Link className="font-semibold underline" href={`/paginaConceito?id=${c.id}`}>
                        {c.name}
                      </Link>
                      <p className="mt-1 text-sm text-[#65748B]">
                        {statusText[c.status] ?? "Ainda não avaliado"}
                      </p>
                      <button
                        type="button"
                        onClick={() => gap(c.id)}
                        className="mt-2 text-sm underline"
                      >
                        Não sei
                      </button>
                    </div>
                  ))}
                  <p role="status" className="text-sm">
                    {message}
                  </p>
                </Panel>
                {data.related.length > 0 && (
                  <Panel title="Acontecimentos relacionados">
                    {data.related.map((e) => (
                      <Link
                        key={e.id}
                        href={`/paginaEvento?id=${e.id}`}
                        className="mb-3 block underline"
                      >
                        {e.title}
                      </Link>
                    ))}
                  </Panel>
                )}
                <Panel title="Instituições e pessoas">
                  {data.entities.map((n) => (
                    <p key={n.id} className="mb-3">
                      {n.name}
                      <span className="block text-sm text-[#65748B]">{n.description}</span>
                    </p>
                  ))}
                </Panel>
              </div>
            </div>
          </>
        )}
      </State>
    </Frame>
  );
}
