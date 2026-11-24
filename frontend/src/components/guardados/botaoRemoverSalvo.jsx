import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BotaoRemoverSalvo({ titulo, aoRemover }) {
  return (
    <Button
      type="button"
      size="icon-lg"
      variant="ghost"
      data-wisen-hover="preserve"
      className="relative z-10 self-start text-wisen-texto-suave hover:bg-wisen-superficie hover:text-wisen-titulo"
      aria-label={`Remover dos salvos: ${titulo}`}
      title="Remover dos salvos"
      onClick={aoRemover}
    >
      <Bookmark className="size-5 fill-current/15" aria-hidden="true" />
    </Button>
  );
}
