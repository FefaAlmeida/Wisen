
import { Input } from "@/components/ui/input";

export function BarraBusca() {
  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-4 z-10 h-[18px] w-[18px] -translate-y-1/2 text-[#8D9BB2]"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </svg>

      <Input
        type="search"
        aria-label="Buscar termo ou conceito"
        placeholder="Buscar termo ou conceito..."
        className="h-12 w-full rounded-[10px] border border-[#DCE3ED] bg-white pr-4 pl-11 text-[14px] text-[#192344] shadow-none placeholder:text-[#9AA6BA] focus-visible:border-[#A9B8CD] focus-visible:ring-2 focus-visible:ring-[#DCE5F2]"
      />
    </div>
  );
}
