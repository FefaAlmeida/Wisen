import { cn } from "cn";
import { SegmentedButton, segmentListStyle } from "@/components/ui/segmented-control";

export function SeletorSegmentado({ label, options, value, onChange, className = "" }) {
  return (
    <fieldset className={cn(segmentListStyle, className)} aria-label={label}>
      {options.map((option) => (
        <SegmentedButton
          key={option.value}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </SegmentedButton>
      ))}
    </fieldset>
  );
}
