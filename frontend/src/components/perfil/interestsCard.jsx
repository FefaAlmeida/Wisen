import { Plus, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function InterestsCard() {
  const selectedTags = ["Tecnologia", "Meio ambiente", "Saúde"];
  const availableTags = ["Economia", "Política", "Ciência", "Educação", "Sociedade"];

  return (
    <Card className="border border-slate-200/80 shadow-xs bg-white rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold text-[#2B333F]">Interesses</CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Escolha os temas que quer ver nas suas notícias.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Campo de Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar temas..."
            className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 rounded-lg focus-visible:ring-[#E8E191] text-[#2B333F]"
          />
        </div>

        {/* Lista de Tags */}
        <div className="flex flex-wrap gap-2 pt-1">
          {/* Tags Selecionadas */}
          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-[#E8E191] hover:bg-[#d8d181] text-[#2B333F] text-xs font-semibold px-3 py-1.5 rounded-xl gap-1.5 border-none transition-colors cursor-pointer"
            >
              {tag}
              <X className="w-3 h-3 text-[#2B333F]" />
            </Badge>
          ))}

          {/* Tags Disponíveis */}
          {availableTags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="bg-slate-50/80 hover:bg-slate-100 text-[#2B333F]/80 border-slate-200 text-xs font-normal px-3 py-1.5 rounded-xl gap-1.5 transition-colors cursor-pointer"
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
