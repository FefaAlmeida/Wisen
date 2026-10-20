import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, X, Plus } from "lucide-react";

export function InterestsCard() {
  const selectedTags = ["Tecnologia", "Meio ambiente", "Saúde"];
  const availableTags = ["Economia", "Política", "Ciência", "Educação", "Sociedade"];

  return (
    <Card className="border border-slate-200/80 shadow-xs bg-white rounded-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold text-slate-800">Interesses</CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Escolha os temas que quer ver nas suas notícias.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Campo de Pesquisa de Temas */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Buscar temas..." 
            className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 rounded-lg focus-visible:ring-amber-400"
          />
        </div>

        {/* Lista de Tags */}
        <div className="flex flex-wrap gap-2 pt-1">
          {/* Tags Selecionadas (Amarelas) */}
          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-amber-100 hover:bg-amber-200/80 text-amber-950 text-xs font-medium px-3 py-1.5 rounded-xl gap-1.5 border-none transition-colors cursor-pointer"
            >
              {tag}
              <X className="w-3 h-3 text-amber-800" />
            </Badge>
          ))}

          {/* Tags Disponíveis (Neutras) */}
          {availableTags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="bg-slate-50/80 hover:bg-slate-100 text-slate-600 border-slate-200 text-xs font-normal px-3 py-1.5 rounded-xl gap-1.5 transition-colors cursor-pointer"
            >
              {tag}
              <Plus className="w-3 h-3 text-slate-400" />
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}