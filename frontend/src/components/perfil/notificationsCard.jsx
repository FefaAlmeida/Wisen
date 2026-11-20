import { Bell, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ProfileSection, profileSaveAction } from "./profileSection";

export function NotificationsCard({
  notifications,
  onChange,
  onSave,
  saving,
  hasChanges,
  feedback,
}) {
  return (
    <ProfileSection
      icon={Bell}
      title="Notificações"
      description="Escolha como acompanhar seu aprendizado."
    >
      <div className="space-y-5">
        {/* Item 1 */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-wisen-superficie text-wisen-texto-suave shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-wisen-titulo">Lembretes de revisão</h4>
              <p className="text-xs text-wisen-texto-suave leading-relaxed">
                Receba lembretes para revisar conteúdos com base no seu progresso.
              </p>
            </div>
          </div>
          <Switch
            disabled={saving}
            checked={notifications.reviewReminders}
            aria-label="Lembretes de revisão"
            onCheckedChange={(checked) => onChange("reviewReminders", checked)}
            data-wisen-hover="preserve"
          />
        </div>

        {/* Item 2 */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-wisen-superficie text-wisen-texto-suave shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-wisen-titulo">Resumo semanal</h4>
              <p className="text-xs text-wisen-texto-suave leading-relaxed">
                Receba um resumo do seu aprendizado e temas mais lidos.
              </p>
            </div>
          </div>
          <Switch
            disabled={saving}
            checked={notifications.weeklySummary}
            data-wisen-hover="preserve"
            aria-label="Resumo semanal"
            onCheckedChange={(checked) => onChange("weeklySummary", checked)}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-wisen-borda/70 pt-4">
          {feedback ? (
            <p
              role={feedback.type === "error" ? "alert" : "status"}
              className={`text-xs ${feedback.type === "error" ? "text-red-600" : "text-green-700"}`}
            >
              {feedback.text}
            </p>
          ) : (
            <p className="text-xs text-wisen-texto-suave">
              {hasChanges ? "Você tem alterações pendentes." : "Suas preferências estão salvas."}
            </p>
          )}
          <Button
            type="button"
            onClick={onSave}
            disabled={!hasChanges || saving}
            className={profileSaveAction}
          >
            {saving ? "Salvando..." : "Salvar notificações"}
          </Button>
        </div>
      </div>
    </ProfileSection>
  );
}
