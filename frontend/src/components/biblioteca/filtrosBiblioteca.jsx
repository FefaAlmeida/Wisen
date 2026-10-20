
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FiltrosBiblioteca() {
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-4">

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2.5">

        <Button
          size="sm"
          className="h-9 rounded-full border-0 bg-[#F8EDA6] px-5 text-[13px] font-medium text-[#192344] shadow-none hover:bg-[#F1E18A]"
        >
          Todas (124)
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-9 rounded-full border-[#DCE3ED] bg-white/80 px-4 text-[13px] font-normal text-[#607092] shadow-none hover:bg-white hover:text-[#192344]"
        >
          <span className="mr-2 h-2 w-2 rounded-full bg-[#FF6469]" />
          Minhas lacunas (28)
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-9 rounded-full border-[#DCE3ED] bg-white/80 px-4 text-[13px] font-normal text-[#607092] shadow-none hover:bg-white hover:text-[#192344]"
        >
          <span className="mr-2 h-2 w-2 rounded-full bg-[#FFD33D]" />
          Em revisão (36)
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-9 rounded-full border-[#DCE3ED] bg-white/80 px-4 text-[13px] font-normal text-[#607092] shadow-none hover:bg-white hover:text-[#192344]"
        >
          <span className="mr-2 h-2 w-2 rounded-full bg-[#33B27C]" />
          Dominados (60)
        </Button>
      </div>

  
<Select defaultValue="relevantes">
  <SelectTrigger
    className="h-9 w-[165px] rounded-lg border border-[#E1E7F0] bg-[#F8FAFD] px-3 text-xs font-medium text-[#344469] shadow-none focus:ring-0 [&>svg:last-child]:h-3.5 [&>svg:last-child]:w-3.5"
  >
    <div className="flex min-w-0 items-center gap-2">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-3.5 w-3.5 shrink-0"
      >
        <path d="M4 7h16M4 17h16" />
        <path d="M9 4v6M15 14v6" />
      </svg>

      <SelectValue />
    </div>
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="relevantes">Mais relevantes</SelectItem>
    <SelectItem value="recentes">Mais recentes</SelectItem>
    <SelectItem value="alfabetica">Ordem alfabética</SelectItem>
  </SelectContent>
</Select>


    </div>
  );
}
