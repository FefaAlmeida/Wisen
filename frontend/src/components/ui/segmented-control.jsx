import { cn } from "cn";
import { Button } from "./button";

const segmentListStyle =
  "inline-flex w-fit max-w-full flex-wrap items-center justify-start gap-1 rounded-2xl border border-wisen-borda bg-white p-1";
const segmentStyle =
  "group/segment h-11 gap-2 rounded-xl px-3 text-sm font-semibold text-wisen-titulo hover:bg-wisen-superficie hover:text-wisen-titulo data-active:bg-wisen-cliente-hover data-active:text-wisen-titulo data-active:hover:bg-wisen-cliente-hover";
const segmentCountStyle =
  "rounded-full bg-wisen-superficie px-2 text-xs leading-5 group-data-active/segment:bg-wisen-selecao";

function SegmentedButton({ "aria-pressed": pressed, className, ...props }) {
  return (
    <Button
      type="button"
      variant="ghost"
      aria-pressed={pressed}
      data-active={pressed ? "" : undefined}
      data-wisen-hover="preserve"
      className={cn(segmentStyle, className)}
      {...props}
    />
  );
}

export { SegmentedButton, segmentCountStyle, segmentListStyle, segmentStyle };
