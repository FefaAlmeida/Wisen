import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const paginationButton =
  "size-8 text-gray-600 hover:bg-transparent hover:text-wisen-link-hover dark:hover:bg-transparent";

export function AdminTableFooter({
  countLabel,
  paginationLabel,
  loading,
  page,
  pages,
  onPageChange,
}) {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-[#E8EDF4] bg-[#FAFBFD] px-4 py-4 sm:px-5">
      <p aria-live="polite" className="text-xs tabular-nums text-wisen-texto-suave">
        {!loading && countLabel}
      </p>
      <nav aria-label={paginationLabel} className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Página anterior"
          disabled={loading || page === 1}
          onClick={() => onPageChange(page - 1)}
          className={paginationButton}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="px-2 text-xs tabular-nums text-gray-600">
          {page} de {pages}
        </span>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Próxima página"
          disabled={loading || page === pages}
          onClick={() => onPageChange(page + 1)}
          className={paginationButton}
        >
          <ChevronRight className="size-4" />
        </Button>
      </nav>
    </footer>
  );
}
