import { Bell, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export function NotificationsCard() {
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
          <Switch defaultChecked className="data-[state=checked]:bg-[#E8E191]" />
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
          <Switch />
        </div>
      </CardContent>
    </Card>
  );
}
