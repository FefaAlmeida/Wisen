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
        <CardTitle className="text-base font-bold text-slate-800">Dados pessoais</CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Atualize suas informações de perfil.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          {/* Avatar com o ícone de câmera */}
          <div className="relative shrink-0">
            <Avatar className="w-20 h-20 border border-slate-100">
              <AvatarImage 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&auto=format&fit=crop" 
                alt="Natalia Bragagnolo" 
              />
              <AvatarFallback className="bg-amber-100 text-amber-900 font-medium">NB</AvatarFallback>
            </Avatar>
            <button 
              type="button" 
              className="absolute bottom-0 right-0 p-1.5 bg-amber-100 hover:bg-amber-200 text-slate-700 rounded-full border-2 border-white shadow-xs transition-colors cursor-pointer"
              title="Alterar foto"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Campos de Nome e E-mail */}
          <div className="flex-1 space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">Nome</label>
              <Input 
                defaultValue="Natalia Bragagnolo" 
                className="h-9 text-xs bg-slate-50/50 border-slate-200 focus-visible:ring-amber-400 rounded-lg" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">E-mail</label>
              <Input 
                defaultValue="natalia@email.com" 
                className="h-9 text-xs bg-slate-50/50 border-slate-200 focus-visible:ring-amber-400 rounded-lg" 
              />
            </div>
          </div>
        </div>

        {/* Botão Salvar Alterações */}
        <div className="pt-2 pl-24">
          <Button className="bg-amber-100/80 hover:bg-amber-200 text-slate-800 font-medium text-xs h-9 px-5 rounded-xl border-none shadow-none transition-colors">
            Salvar alterações
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}