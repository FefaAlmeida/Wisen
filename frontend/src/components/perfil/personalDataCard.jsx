import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

export function PersonalDataCard() {
  return (
    <Card className="border border-slate-200/80 shadow-xs bg-white rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold text-[#2B333F]">Dados pessoais</CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Atualize suas informações de perfil.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          {/* Avatar com botão de câmera */}
          <div className="relative shrink-0">
            <Avatar className="w-20 h-20 border border-slate-100">
              <AvatarImage 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&auto=format&fit=crop" 
                alt="Natalia Bragagnolo" 
              />
              <AvatarFallback className="bg-[#E8E191] text-[#2B333F] font-bold">NB</AvatarFallback>
            </Avatar>
            <button 
              type="button" 
              className="absolute bottom-0 right-0 p-1.5 bg-[#E8E191] hover:bg-[#d8d181] text-[#2B333F] rounded-full border-2 border-white shadow-xs transition-colors cursor-pointer"
              title="Alterar foto"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Inputs de Nome e E-mail */}
          <div className="flex-1 space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#2B333F]">Nome</label>
              <Input 
                defaultValue="Natalia Bragagnolo" 
                className="h-9 text-xs bg-slate-50/50 border-slate-200 focus-visible:ring-[#E8E191] rounded-lg text-[#2B333F]" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#2B333F]">E-mail</label>
              <Input 
                defaultValue="natalia@email.com" 
                className="h-9 text-xs bg-slate-50/50 border-slate-200 focus-visible:ring-[#E8E191] rounded-lg text-[#2B333F]" 
              />
            </div>
          </div>
        </div>

        {/* Botão Salvar Alterações */}
        <div className="pt-2 pl-24">
          <Button className="bg-[#E8E191] hover:bg-[#d8d181] text-[#2B333F] font-semibold text-xs h-9 px-5 rounded-xl border-none shadow-none transition-colors">
            Salvar alterações
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}