import { ChevronRight, Lock, LogOut } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SecurityCard() {
  return (
    <Card className="border border-slate-200/80 shadow-xs bg-white rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold text-[#2B333F]">Segurança da conta</CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Gerencie sua senha e sessão.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Opção 1 */}
        <button
          type="button"
          className="w-full flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#E8E191] rounded-full text-[#2B333F] shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-[#2B333F] group-hover:opacity-80 transition-opacity">
                Alterar senha
              </h4>
              <p className="text-[11px] text-slate-500 leading-tight">
                Atualize sua senha para manter sua conta segura.
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#2B333F] transition-colors" />
        </button>

        <div className="border-t border-slate-100" />

        {/* Opção 2 */}
        <button
          type="button"
          className="w-full flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#E8E191] rounded-full text-[#2B333F] shrink-0">
              <LogOut className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-[#2B333F] group-hover:opacity-80 transition-opacity">
                Encerrar sessão
              </h4>
              <p className="text-[11px] text-slate-500 leading-tight">
                Desconecte sua conta deste dispositivo.
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#2B333F] transition-colors" />
        </button>
      </CardContent>
    </Card>
  );
}
