import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Calendar, Bell } from "lucide-react";

export function NotificationsCard() {
  return (
    <Card className="border border-slate-200/80 shadow-xs bg-white rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold text-slate-800">Notificações</CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Configure seus lembretes de revisão.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Item 1: Lembretes de revisão */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-amber-100 rounded-full text-amber-900 shrink-0 mt-0.5">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-slate-800">Lembretes de revisão</h4>
              <p className="text-[11px] text-slate-500 leading-tight">
                Receba lembretes para revisar conteúdos com base no seu progresso.
              </p>
            </div>
          </div>
          <Switch defaultChecked className="data-[state=checked]:bg-amber-400" />
        </div>

        {/* Item 2: Resumo semanal */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-amber-100 rounded-full text-amber-900 shrink-0 mt-0.5">
              <Bell className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-slate-800">Resumo semanal</h4>
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