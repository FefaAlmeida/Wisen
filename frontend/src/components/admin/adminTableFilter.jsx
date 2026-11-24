import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const adminFilterHover =
  "transition-colors hover:bg-wisen-destaque-suave hover:text-wisen-titulo";
export const adminFilterControl = `wisen-control w-full min-w-0 ${adminFilterHover}`;

export function AdminTableFilter({ label, options, value, onChange, width }) {
  return (
    <Select items={options} value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={label} className={`${adminFilterControl} ${width}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} className="p-1">
        {Object.entries(options).map(([value, label]) => (
          <SelectItem
            key={value}
            value={value}
            className="data-highlighted:bg-wisen-cliente-hover data-highlighted:text-wisen-titulo focus:bg-wisen-cliente-hover focus:text-wisen-titulo"
          >
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
