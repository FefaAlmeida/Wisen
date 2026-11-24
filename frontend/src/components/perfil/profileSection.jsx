import { Card, CardContent } from "@/components/ui/card";

export const profileSaveAction =
  "h-11 w-full rounded-[10px] bg-wisen-titulo px-5 font-semibold text-white shadow-none hover:bg-wisen-texto-forte dark:hover:bg-wisen-texto-forte disabled:bg-[#E8EEF6] disabled:text-[#5C6C85] disabled:opacity-100 sm:w-auto";
export const profileInput =
  "h-12 rounded-[10px] border-wisen-borda bg-wisen-superficie pl-10 text-base text-wisen-titulo shadow-none placeholder:text-wisen-texto-suave focus-visible:border-[#D6B947] focus-visible:ring-2 focus-visible:ring-[#D6B947]/25";
export const profileInputIcon =
  "pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2";

export function ProfileSection({ icon: Icon, title, description, className = "", children }) {
  return (
    <Card
      className={`min-w-0 gap-5 rounded-2xl border-wisen-borda bg-card [--card-spacing:--spacing(5)] sm:[--card-spacing:--spacing(6)] ${className}`}
    >
      <div className="flex items-start gap-3 px-(--card-spacing)">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-wisen-superficie text-wisen-titulo in-data-[wisen-profile]:bg-wisen-titulo in-data-[wisen-profile]:text-wisen-destaque-suave">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-wisen-titulo">{title}</h2>
          <p className="mt-1 text-xs leading-relaxed text-wisen-texto-suave">{description}</p>
        </div>
      </div>
      <CardContent className="gap-0">{children}</CardContent>
    </Card>
  );
}
