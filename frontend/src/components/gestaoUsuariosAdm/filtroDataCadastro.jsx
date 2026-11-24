import { Popover } from "@base-ui/react/popover";
import { CalendarDays } from "lucide-react";
import { useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { ptBR } from "react-day-picker/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const calendarControl =
  "grid size-8 place-items-center rounded-md border border-wisen-destaque bg-wisen-destaque-suave text-wisen-titulo hover:bg-wisen-destaque focus-visible:outline-2 focus-visible:outline-wisen-titulo disabled:opacity-40";
const calendarAction =
  "h-8 border-wisen-destaque bg-wisen-destaque-suave text-wisen-titulo hover:bg-wisen-destaque";

function parseDate(value) {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setFullYear(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function formatDate(date) {
  return [
    String(date.getFullYear()).padStart(4, "0"),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export default function FiltroDataCadastro({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const anchor = useRef(null);
  const trigger = useRef(null);
  const selected = parseDate(value);

  function selectDate(date) {
    onChange(date ? formatDate(date) : "");
    setOpen(false);
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <div ref={anchor} className="group relative w-full min-w-0 sm:w-[165px]">
        <Input
          aria-label="Filtrar por data de cadastro"
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if ((event.altKey && event.key === "ArrowDown") || event.key === "F4") {
              event.preventDefault();
              trigger.current?.click();
            }
          }}
          className="wisen-control pr-10 transition-colors group-hover:bg-wisen-destaque-suave group-hover:text-wisen-titulo [&::-webkit-calendar-picker-indicator]:hidden"
        />
        <Popover.Trigger
          ref={trigger}
          aria-label="Abrir calendário de data de cadastro"
          className="absolute inset-y-0 right-1 my-auto grid size-8 place-items-center rounded-md text-wisen-titulo hover:bg-wisen-cliente-hover focus-visible:outline-2 focus-visible:outline-wisen-titulo data-open:bg-wisen-destaque-suave"
        >
          <CalendarDays aria-hidden="true" className="size-4" />
        </Popover.Trigger>
      </div>
      <Popover.Portal>
        <Popover.Positioner anchor={anchor} sideOffset={6} align="start" className="z-50">
          <Popover.Popup
            aria-label="Calendário de data de cadastro"
            initialFocus={false}
            className="max-h-(--available-height) overflow-auto rounded-xl border border-wisen-borda bg-white p-2 text-sm text-wisen-titulo shadow-lg"
          >
            <DayPicker
              mode="single"
              required
              autoFocus
              locale={ptBR}
              weekStartsOn={1}
              showOutsideDays
              fixedWeeks
              defaultMonth={selected}
              selected={selected}
              onSelect={selectDate}
              classNames={{
                months: "relative",
                month_caption:
                  "mb-1 flex h-10 items-center justify-center rounded-lg bg-[#FBF7E5] px-10 font-semibold capitalize",
                nav: "pointer-events-none absolute inset-x-1 top-1 flex justify-between",
                button_previous: `${calendarControl} pointer-events-auto`,
                button_next: `${calendarControl} pointer-events-auto`,
                chevron: "size-4 fill-current",
                month_grid: "border-collapse",
                weekday: "h-8 text-xs font-medium text-wisen-texto-suave",
                day: "p-px text-center",
                day_button:
                  "grid size-8 place-items-center rounded-md tabular-nums hover:bg-wisen-cliente-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-wisen-titulo sm:size-9",
                outside: "text-wisen-texto-suave",
                today: "[&>button]:ring-1 [&>button]:ring-inset [&>button]:ring-wisen-destaque",
                selected:
                  "[&>button]:bg-wisen-destaque-suave [&>button]:font-semibold [&>button]:text-wisen-titulo [&>button:hover]:bg-wisen-destaque",
              }}
            />
            <div className="mt-2 flex justify-between rounded-lg border border-wisen-borda bg-wisen-superficie p-2">
              <Button
                size="sm"
                variant="outline"
                className={calendarAction}
                onClick={() => selectDate()}
              >
                Limpar
              </Button>
              <Button
                size="sm"
                variant="outline"
                className={calendarAction}
                onClick={() => selectDate(new Date())}
              >
                Hoje
              </Button>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
