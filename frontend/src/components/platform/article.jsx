"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Frame, Generation, Panel, SaveButton, State, useResource } from "./shared";
export default function ArticlePage() {
  const id = useSearchParams().get("id");
  const resource = useResource(`/reading/${id ?? "missing"}`);
  const [passage, setPassage] = useState("");
  const data = resource.data;
  return (
    <Frame title="Leitura" active="Notícias">
      <State resource={resource}>
        {data && (
          <>
            <Panel>
              <h2 className="mb-4 text-3xl font-semibold">{data.title}</h2>
              <p className="mb-5 text-sm">
                {data.attribution ?? data.source} ·{" "}
                <a href={data.url} target="_blank" rel="noreferrer" className="underline">
                  Ler na fonte original
                </a>
              </p>
              {data.event_id && (
                <Link href={`/paginaEvento?id=${data.event_id}`} className="mb-5 block underline">
                  Ver acontecimento e conceitos
                </Link>
              )}
              <SaveButton type="article" id={id} />
              <article
                onMouseUp={() => {
                  const selection = window.getSelection()?.toString().trim();
                  if (selection) setPassage(selection.slice(0, 5000));
                }}
                className="mt-8 max-w-prose whitespace-pre-wrap text-lg leading-9"
              >
                {data.content ??
                  "A leitura interna deste artigo não está disponível. Acesse a publicação original."}
              </article>
            </Panel>
            {data.content && (
              <Panel title="Entenda um trecho">
                <label className="mb-3 block text-sm" htmlFor="trecho">
                  Selecione no texto ou cole um trecho deste artigo
                </label>
                <textarea
                  id="trecho"
                  value={passage}
                  onChange={(e) => setPassage(e.target.value)}
                  maxLength={5000}
                  className="mb-4 min-h-28 w-full rounded-lg border p-3"
                />
                {passage && (
                  <Generation
                    key={passage}
                    target={{ articleId: id }}
                    operation="passage"
                    passage={passage}
                  />
                )}
              </Panel>
            )}
          </>
        )}
      </State>
    </Frame>
  );
}
