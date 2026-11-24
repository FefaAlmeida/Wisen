"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AdminSummary } from "@/components/admin/adminSummary";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/lib/toast";
import { requisitar } from "@/services/api";

const MINIMUM_AVAILABLE_CATEGORIES = 3;

export default function GestaoCategorias() {
  const [categories, setCategories] = useState([]);
  const [savedCategories, setSavedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const requestController = useRef(null);

  const loadCategories = useCallback(async () => {
    requestController.current?.abort();
    const controller = new AbortController();
    requestController.current = controller;
    setLoading(true);
    setError("");

    try {
      const data = await requisitar("/admin/categories", { signal: controller.signal });
      if (!Array.isArray(data.categories)) {
        throw new Error("A resposta de categorias não contém uma lista válida.");
      }
      if (controller.signal.aborted) return;
      setCategories(data.categories);
      setSavedCategories(data.categories);
    } catch (loadError) {
      if (!controller.signal.aborted) {
        setError(loadError.message || "Não foi possível carregar as categorias.");
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
    return () => requestController.current?.abort();
  }, [loadCategories]);

  const availableCount = categories.filter((category) => category.available).length;
  const hasChanges = categories.some(
    (category) =>
      savedCategories.find((saved) => saved.id === category.id)?.available !== category.available,
  );

  function toggleCategory(id, available) {
    const updated = categories.map((category) =>
      category.id === id ? { ...category, available } : category,
    );
    if (updated.filter((category) => category.available).length < MINIMUM_AVAILABLE_CATEGORIES) {
      setError("Mantenha pelo menos três assuntos disponíveis para os usuários.");
      return;
    }

    setCategories(updated);
    setError("");
  }

  async function saveCategories() {
    if (saving || loading || !hasChanges) return;
    setSaving(true);
    setError("");

    try {
      const data = await requisitar("/admin/categories", {
        method: "PUT",
        body: {
          categories: categories.map(({ id, available }) => ({ id, available })),
        },
      });
      setCategories(data.categories);
      setSavedCategories(data.categories);
      toast.success("Disponibilidade dos assuntos atualizada.");
    } catch (saveError) {
      toast.error(saveError.message || "Não foi possível salvar a disponibilidade.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-w-0 space-y-7">
      <AdminSummary
        title="Categorias de interesse"
        description={`Escolha os assuntos que os usuários podem selecionar nas preferências. Mantenha pelo menos ${MINIMUM_AVAILABLE_CATEGORIES} disponíveis e clique em Salvar disponibilidade para aplicar as mudanças.`}
        loading={loading}
        itemColors="border-transparent bg-[#FBF7E5]"
        items={
          loading || categories.length > 0
            ? [
                `${availableCount} de ${categories.length} disponíveis`,
                `Mínimo de ${MINIMUM_AVAILABLE_CATEGORIES}`,
              ]
            : []
        }
      />
      <Card className="gap-0 rounded-xl border border-[#DCE3ED] bg-white p-0 shadow-none">
        <CardContent className="gap-0 p-0">
          <div className="flex justify-end p-4 sm:p-5">
            <Button
              type="button"
              onClick={saveCategories}
              disabled={loading || saving || !hasChanges}
              className="h-11 w-full rounded-xl bg-[#101A40] px-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#30466E] sm:w-auto"
            >
              {saving ? "Salvando..." : "Salvar disponibilidade"}
            </Button>
          </div>

          {error && (
            <div
              role="alert"
              className="flex flex-wrap items-center justify-between gap-3 px-4 pb-4 text-sm text-red-700 sm:px-5"
            >
              <span>{error}</span>
              {categories.length === 0 && (
                <Button type="button" variant="outline" onClick={loadCategories}>
                  Tentar novamente
                </Button>
              )}
            </div>
          )}

          {loading && (
            <p role="status" className="py-8 text-center text-sm text-wisen-texto-suave">
              Carregando categorias...
            </p>
          )}
          {!loading && !error && categories.length === 0 && (
            <p className="py-8 text-center text-sm text-wisen-texto-suave">
              Nenhuma categoria cadastrada.
            </p>
          )}
          {!loading && categories.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">
                  Disponibilidade das categorias nas preferências
                </caption>
                <thead className="border-y border-[#E8EDF4] bg-[#E8EFFA]">
                  <tr className="text-[10px] font-semibold tracking-wider text-wisen-titulo uppercase">
                    <th scope="col" className="w-full px-4 py-3 sm:px-5">
                      Categoria
                    </th>
                    <th scope="col" className="px-2 py-3 text-center sm:px-4">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-center sm:px-5">
                      Exibir
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDF0F5]">
                  {categories.map((category) => (
                    <tr key={category.id} className="transition-colors hover:bg-[#FBF7E5]">
                      <th scope="row" className="px-4 py-3 font-medium text-wisen-titulo sm:px-5">
                        {category.name}
                        {category.description && (
                          <p className="mt-0.5 text-xs font-normal text-wisen-texto-suave">
                            {category.description}
                          </p>
                        )}
                      </th>
                      <td className="px-2 py-3 text-center whitespace-nowrap sm:px-4">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            category.available
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {category.available ? "Disponível" : "Oculta"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center sm:px-5">
                        <Switch
                          checked={category.available}
                          disabled={
                            saving ||
                            (category.available && availableCount <= MINIMUM_AVAILABLE_CATEGORIES)
                          }
                          onCheckedChange={(available) => toggleCategory(category.id, available)}
                          aria-label={`Disponibilizar ${category.name}`}
                          className="align-middle data-checked:bg-[#EBDD80] data-unchecked:bg-[#ABB8CC] focus-visible:ring-[#EBDD80]/50"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
