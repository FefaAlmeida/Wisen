import { Bell, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export function NotificationsCard({
  notifications,
  onChange,
  onSave,
  saving,
  hasChanges,
  feedback,
}) {
  return (
    <Card className="border border-slate-200/80 shadow-xs bg-white rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold text-[#2B333F]">Notificações</CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Configure seus lembretes de revisão.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Item 1 */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-[#E8E191] rounded-full text-[#2B333F] shrink-0 mt-0.5">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-[#2B333F]">Lembretes de revisão</h4>
              <p className="text-[11px] text-slate-500 leading-tight">
                Receba lembretes para revisar conteúdos com base no seu progresso.
              </p>
            </div>
          </div>
          <Switch
            disabled={saving}
            checked={notifications.reviewReminders}
            aria-label="Lembretes de revisão"
            onCheckedChange={(checked) => onChange("reviewReminders", checked)}
            className="data-[state=checked]:bg-[#E8E191]"
          />
        </div>

        {/* Item 2 */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-[#E8E191] rounded-full text-[#2B333F] shrink-0 mt-0.5">
              <Bell className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-[#2B333F]">Resumo semanal</h4>
              <p className="text-[11px] text-slate-500 leading-tight">
                Receba um resumo do seu aprendizado e temas mais lidos.
              </p>
            </div>
          </div>
          <Switch
            disabled={saving}
            checked={notifications.weeklySummary}
            aria-label="Resumo semanal"
            onCheckedChange={(checked) => onChange("weeklySummary", checked)}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          {feedback ? (
            <p
              role={feedback.type === "error" ? "alert" : "status"}
              className={`text-xs ${feedback.type === "error" ? "text-red-600" : "text-green-700"}`}
            >
              {feedback.text}
            </p>
          ) : (
            <p className="text-xs text-slate-500">
              {hasChanges ? "Você tem alterações pendentes." : "Suas preferências estão salvas."}
            </p>
          )}
          <Button
            type="button"
            onClick={onSave}
            disabled={!hasChanges || saving}
            className="h-8 rounded-lg bg-[#E8E191] px-4 text-xs font-semibold text-[#2B333F] hover:bg-[#d8d181]"
          >
            {saving ? "Salvando..." : "Salvar notificações"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
