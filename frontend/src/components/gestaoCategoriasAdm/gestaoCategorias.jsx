"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { requisitar } from "@/services/api";

const MINIMUM_AVAILABLE_CATEGORIES = 3;

export default function GestaoCategorias() {
  const [categories, setCategories] = useState([]);
  const [savedCategories, setSavedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
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
    setFeedback("");
  }

  async function saveCategories() {
    if (saving || loading || !hasChanges) return;
    setSaving(true);
    setError("");
    setFeedback("");

    try {
      const data = await requisitar("/admin/categories", {
        method: "PUT",
        body: {
          categories: categories.map(({ id, available }) => ({ id, available })),
        },
      });
      setCategories(data.categories);
      setSavedCategories(data.categories);
      setFeedback("Disponibilidade dos assuntos atualizada.");
    } catch (saveError) {
      setError(saveError.message || "Não foi possível salvar a disponibilidade.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="gap-0 rounded-xl border border-[#DCE3ED] bg-white p-0 shadow-none">
      <CardContent className="p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-[20px] font-semibold text-[#101A40]">Assuntos disponíveis</h2>
            <p className="mt-1 text-[13px] text-[#7183A6]">
              {availableCount} assuntos aparecem nas preferências dos usuários.
            </p>
          </div>
          <Button
            type="button"
            onClick={saveCategories}
            disabled={loading || saving || !hasChanges}
            className="bg-[#101A40] text-white hover:bg-[#253452]"
          >
            {saving ? "Salvando..." : "Salvar disponibilidade"}
          </Button>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-red-700"
          >
            <span>{error}</span>
            {categories.length === 0 && (
              <Button type="button" variant="outline" onClick={loadCategories}>
                Tentar novamente
              </Button>
            )}
          </div>
        )}
        {feedback && (
          <p role="status" className="mb-4 text-sm text-emerald-700">
            {feedback}
          </p>
        )}

        {loading ? (
          <p className="py-8 text-center text-sm text-[#7183A6]">Carregando assuntos...</p>
        ) : (
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-[#E6ECF4] px-4 py-3"
              >
                <div>
                  <p className="font-medium text-[#101A40]">{category.name}</p>
                  {category.description && (
                    <p className="mt-0.5 text-xs text-[#7183A6]">{category.description}</p>
                  )}
                  <p className="mt-1 text-xs text-[#7183A6]">
                    {category.available ? "Disponível para os usuários" : "Oculto das preferências"}
                  </p>
                </div>
                <Switch
                  checked={category.available}
                  disabled={
                    loading ||
                    saving ||
                    (category.available && availableCount <= MINIMUM_AVAILABLE_CATEGORIES)
                  }
                  onCheckedChange={(available) => toggleCategory(category.id, available)}
                  aria-label={`Disponibilizar ${category.name}`}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
