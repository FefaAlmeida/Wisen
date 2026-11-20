import { AlertCircle, Inbox, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Notice({ tone = "success", children }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-xl border p-4 text-sm leading-6 ${tone === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}
    >
      {children}
    </div>
  );
}

export function Feedback({ tone = "empty", title, description, onRetry, children }) {
  const Icon = tone === "loading" ? LoaderCircle : tone === "error" ? AlertCircle : Inbox;
  return (
    <div
      role={tone === "error" ? "alert" : tone === "loading" ? "status" : undefined}
      className={`wisen-panel flex flex-col items-center gap-3 p-6 text-center sm:p-8 ${tone === "error" ? "border-red-200" : ""}`}
    >
      <span
        className={`rounded-xl p-3 ${tone === "error" ? "bg-red-50 text-red-700" : "bg-wisen-superficie text-wisen-texto-suave"}`}
      >
        <Icon
          aria-hidden="true"
          className={`size-5 ${tone === "loading" ? "motion-safe:animate-spin" : ""}`}
        />
      </span>
      <p className="text-sm font-semibold text-wisen-titulo">{title}</p>
      {description && (
        <p className="max-w-lg text-sm leading-6 text-wisen-texto-suave">{description}</p>
      )}
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
      {children}
    </div>
  );
}
