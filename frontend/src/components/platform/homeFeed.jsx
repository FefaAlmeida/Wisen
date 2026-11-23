"use client";
import CardNoticia from "@/components/homeCliente/cardNoticia";
import { State, useResource } from "./shared";
export default function HomeFeed() {
  const resource = useResource("/feed?limit=3");
  return (
    <State resource={resource}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {resource.data?.items?.map((item) => (
          <CardNoticia key={item.id} item={item} onDismiss={resource.reload} />
        ))}
      </div>
      {resource.data?.items?.length === 0 && (
        <p>Novas notícias aparecerão aqui quando estiverem disponíveis.</p>
      )}
    </State>
  );
}
