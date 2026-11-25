import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const adminFilterHover =
  "transition-colors hover:bg-wisen-admin-control-hover hover:text-wisen-titulo";
export const adminFilterControl = `wisen-control w-full min-w-0 ${adminFilterHover}`;

export function AdminTableFilter({ label, options, value, onChange, width }) {
  return (
    <Select items={options} value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={label} className={`${adminFilterControl} ${width}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} className="p-1">
        {(Array.isArray(options)
          ? options
          : Object.entries(options).map(([value, label]) => ({ value, label }))
        ).map(({ value, label }) => (
          <SelectItem
            key={value}
            value={value}
            className="data-highlighted:bg-wisen-admin-control-hover data-highlighted:text-wisen-titulo focus:bg-wisen-admin-control-hover focus:text-wisen-titulo dark:focus:bg-wisen-admin-control-hover dark:focus:text-wisen-titulo [&>span:first-child]:min-w-0 [&>span:first-child]:whitespace-normal"
          >
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
