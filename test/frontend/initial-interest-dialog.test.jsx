import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { InitialInterestDialog } from "../../frontend/src/components/homeCliente/initialInterestDialog.jsx";

function mockProfile(preferences = {}, saveError = false, name = "Ana") {
  const fetchMock = vi.fn((url, options) => {
    if (url === "/api/locations/options") {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          locations: [
            { countryCode: "BR", countryName: "Brasil", stateId: 2021, stateName: "São Paulo" },
            {
              countryCode: "US",
              countryName: "Estados Unidos",
              stateId: 1416,
              stateName: "Califórnia",
            },
            { countryCode: "AI", countryName: "Anguila", stateId: null, stateName: null },
          ],
        }),
      });
    }
    if (url === "/api/categories") {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          categories: [{ name: "Tecnologia" }, { name: "Meio ambiente" }, { name: "Saúde" }],
        }),
      });
    }
    return Promise.resolve({
      ok: !(options?.method === "PUT" && saveError),
      json: async () => ({ user: { name: "Lia" }, message: "Falha ao salvar" }),
      text: async () =>
        JSON.stringify(
          options?.method === "PUT"
            ? { user: { name: "Lia" }, message: "Falha ao salvar" }
            : {
                user: { name },
                location: name ? { countryCode: "BR", stateId: 2021 } : null,
                preferences: { interests: [], onboardingCompleted: false, ...preferences },
              },
        ),
    });
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

async function selectInterests() {
  await screen.findByRole("button", { name: "Continuar" });
  fireEvent.click(screen.getByRole("button", { name: /Tecnologia/ }));
  fireEvent.click(screen.getByRole("button", { name: /Meio ambiente/ }));
  fireEvent.click(screen.getByRole("button", { name: /Saúde/ }));
  fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
}

const savedBody = (mock) =>
  JSON.parse(mock.mock.calls.find(([, options]) => options?.method === "PUT")[1].body);

async function selectLocation() {
  fireEvent.click(screen.getByRole("button", { name: "Mostrar localizações" }));
  fireEvent.change(screen.getByRole("combobox", { name: "Localização" }), {
    target: { value: "sao paulo" },
  });
  fireEvent.click(await screen.findByRole("option", { name: "São Paulo, Brasil" }));
  await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
}

describe("onboarding em etapas", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("conclui no auth somente depois de salvar as preferências", async () => {
    const fetchMock = mockProfile();
    const onComplete = vi.fn();
    render(<InitialInterestDialog embedded onComplete={onComplete} />);
    await selectInterests();
    expect(onComplete).not.toHaveBeenCalled();
    fireEvent.click(screen.getByLabelText("Entendo o básico"));
    fireEvent.click(screen.getByRole("button", { name: "Concluir" }));
    await waitFor(() => expect(onComplete).toHaveBeenCalledOnce());
    expect(savedBody(fetchMock)).toMatchObject({ onboardingCompleted: true, familiarity: "basic" });
  });

  it("libera o destino imediatamente para um perfil já personalizado", async () => {
    mockProfile({ interests: ["Tecnologia", "Meio ambiente", "Saúde"], onboardingCompleted: true });
    const onComplete = vi.fn();
    render(<InitialInterestDialog embedded onComplete={onComplete} />);
    await waitFor(() => expect(onComplete).toHaveBeenCalledOnce());
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("permite recarregar o perfil após falha sem sair do auth", async () => {
    const fetchMock = mockProfile();
    fetchMock.mockRejectedValueOnce(new Error("Conexão indisponível"));
    render(<InitialInterestDialog embedded onComplete={vi.fn()} />);
    expect(await screen.findByRole("alert")).toHaveTextContent("Conexão indisponível");
    fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(await screen.findByRole("button", { name: /Tecnologia/ })).toBeInTheDocument();
  });

  it("pede e salva o nome antes dos interesses sem concluir onboarding", async () => {
    const fetchMock = mockProfile({}, false, "");
    render(<InitialInterestDialog />);
    const input = await screen.findByRole("textbox", { name: "Nome Completo" });
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");
    expect(screen.getByRole("button", { name: "Continuar" })).toBeDisabled();
    expect(screen.queryByRole("button", { name: /Tecnologia/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Pular esta etapa" })).not.toBeInTheDocument();
    fireEvent.change(input, { target: { value: " Lia " } });
    await selectLocation();
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
    expect(await screen.findByRole("button", { name: /Tecnologia/ })).toBeInTheDocument();
    expect(savedBody(fetchMock)).toEqual({
      name: "Lia",
      location: { countryCode: "BR", stateId: 2021 },
    });
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "2");
    fireEvent.click(screen.getByRole("button", { name: "Voltar" }));
    expect(screen.getByRole("textbox", { name: "Nome Completo" })).toHaveValue(" Lia ");
  });

  it("preserva nome e etapa quando o salvamento do nome falha", async () => {
    mockProfile({}, true, "");
    render(<InitialInterestDialog />);
    fireEvent.change(await screen.findByRole("textbox", { name: "Nome Completo" }), {
      target: { value: "Lia" },
    });
    await selectLocation();
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Falha ao salvar");
    expect(screen.getByRole("textbox", { name: "Nome Completo" })).toHaveValue("Lia");
  });

  it("mantém as três etapas ao recarregar com o nome já salvo", async () => {
    mockProfile({}, false, "Ana Silva");
    render(<InitialInterestDialog embedded />);
    await screen.findByRole("button", { name: /Tecnologia/ });
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuemax", "3");
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "2");
    fireEvent.click(screen.getByRole("button", { name: "Voltar" }));
    expect(screen.getByRole("textbox", { name: "Nome Completo" })).toHaveValue("Ana Silva");
    expect(screen.getByRole("combobox", { name: "Localização" })).toHaveValue("São Paulo, Brasil");
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");
  });

  it("busca região e país no mesmo campo e não aceita texto sem selecionar uma opção", async () => {
    const fetchMock = mockProfile({}, false, "");
    render(<InitialInterestDialog embedded />);
    fireEvent.change(await screen.findByRole("textbox", { name: "Nome Completo" }), {
      target: { value: "Ana Silva" },
    });
    await selectLocation();
    expect(screen.getByRole("button", { name: "Continuar" })).toBeEnabled();
    const input = screen.getByRole("combobox", { name: "Localização" });
    expect(screen.queryByRole("combobox", { name: "País" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Mostrar localizações" }));
    fireEvent.change(input, { target: { value: "estados unidos" } });
    expect(screen.getByText("Continuar").closest("button")).toBeDisabled();
    await screen.findByRole("option", { name: "Califórnia, Estados Unidos" });
    expect(screen.queryByRole("option", { name: "São Paulo, Brasil" })).not.toBeInTheDocument();
    fireEvent.change(input, { target: { value: "Anguila" } });
    fireEvent.click(await screen.findByRole("option", { name: "Anguila" }));
    expect(screen.getByRole("button", { name: "Continuar" })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
    await screen.findByRole("button", { name: /Tecnologia/ });
    expect(savedBody(fetchMock)).toEqual({
      name: "Ana Silva",
      location: { countryCode: "AI", stateId: null },
    });
  });

  it("mostra uma pergunta por etapa, permite voltar e salva as respostas juntas", async () => {
    const fetchMock = mockProfile();
    render(<InitialInterestDialog />);
    expect(await screen.findByRole("button", { name: "Continuar" })).toBeDisabled();
    expect(
      screen.queryByRole("textbox", { name: "Buscar temas de interesse" }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("button", { pressed: false })).toHaveLength(3);
    expect(
      screen.queryByText(/Depois, você pode ajustar suas escolhas no perfil/),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Tecnologia/ }));
    expect(screen.getByRole("button", { name: "Continuar" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: /Meio ambiente/ }));
    expect(screen.getByRole("button", { name: "Continuar" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: /Saúde/ }));
    expect(screen.getByRole("button", { name: "Continuar" })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "3");
    expect(screen.queryByText("Quais assuntos interessam a você?")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Concluir" })).toBeDisabled();
    fireEvent.click(screen.getByLabelText("Entendo o básico"));
    fireEvent.click(screen.getByRole("button", { name: "Voltar" }));
    expect(screen.getByRole("button", { name: "Continuar" })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
    expect(screen.getByLabelText("Entendo o básico")).toBeChecked();
    fireEvent.click(screen.getByRole("button", { name: "Concluir" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(savedBody(fetchMock)).toEqual({
      interests: ["Tecnologia", "Meio ambiente", "Saúde"],
      familiarity: "basic",
      onboardingCompleted: true,
    });
  });

  it("exige três interesses mesmo em um perfil antigo com onboarding concluído", async () => {
    mockProfile({ interests: ["Tecnologia", "Meio ambiente"], onboardingCompleted: true });
    render(<InitialInterestDialog />);
    expect(await screen.findByRole("button", { name: "Continuar" })).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Pular esta etapa" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Saúde/ }));
    expect(screen.getByRole("button", { name: "Continuar" })).toBeEnabled();
  });

  it("requires familiarity before completing onboarding", async () => {
    const fetchMock = mockProfile();
    render(<InitialInterestDialog />);
    await selectInterests();
    expect(screen.queryByRole("button", { name: /Pular/ })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Concluir" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Concluir" }));
    expect(fetchMock.mock.calls.some(([, options]) => options?.method === "PUT")).toBe(false);
    fireEvent.click(screen.getAllByRole("radio")[0]);
    fireEvent.click(screen.getByRole("button", { name: "Concluir" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(savedBody(fetchMock)).toMatchObject({
      familiarity: "beginner",
      onboardingCompleted: true,
    });
  });

  it("mantém o diálogo aberto ao pressionar Escape nas duas etapas", async () => {
    mockProfile();
    render(<InitialInterestDialog />);
    await screen.findByRole("button", { name: "Continuar" });
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await selectInterests();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Concluir" })).toBeDisabled();
  });

  it("mantém a etapa e a resposta quando o salvamento falha", async () => {
    mockProfile({}, true);
    render(<InitialInterestDialog />);
    await selectInterests();
    fireEvent.click(screen.getByLabelText("Estou começando"));
    fireEvent.click(screen.getByRole("button", { name: "Concluir" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Falha ao salvar");
    expect(screen.getByLabelText("Estou começando")).toBeChecked();
    expect(screen.getByRole("button", { name: "Concluir" })).toBeEnabled();
  });
});
