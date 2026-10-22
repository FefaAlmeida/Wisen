
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function BarraBusca() {
  return (
    <div role="search" className="relative w-full">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7182A1]"
        size={16}
      />

      <Input
        type="search"
        aria-label="Buscar termo ou conceito"
        placeholder="Buscar termo ou conceito..."
        className="h-9 rounded-full border-[#DCE3ED] bg-white/90 pl-9 text-[11px] shadow-sm placeholder:text-[#8794AA] focus-visible:ring-[#DCE5F2]"
      />
    </div>
  );
}
