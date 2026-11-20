import { Card, CardContent } from "@/components/ui/card";

export const profileSaveAction =
  "h-10 w-full rounded-xl bg-wisen-destaque-suave px-5 text-xs font-semibold text-wisen-titulo shadow-none hover:bg-[#EBDD80] sm:w-auto";

export function ProfileSection({ icon: Icon, title, description, className = "", children }) {
  return (
    <Card
      className={`min-w-0 gap-5 border-wisen-borda bg-wisen-card [--card-spacing:--spacing(5)] sm:[--card-spacing:--spacing(6)] ${className}`}
    >
      <div className="flex items-start gap-3 px-(--card-spacing)">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-wisen-superficie text-wisen-titulo">
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
