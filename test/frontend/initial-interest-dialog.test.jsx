import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { InitialInterestDialog } from "../../frontend/src/components/homeCliente/initialInterestDialog.jsx";

function mockProfile(preferences = {}, saveError = false) {
  const fetchMock = vi.fn((url, options) => {
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
      text: async () =>
        JSON.stringify(
          options?.method === "PUT"
            ? { message: "Falha ao salvar" }
            : { preferences: { interests: [], onboardingCompleted: false, ...preferences } },
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

describe("onboarding em etapas", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("mostra uma pergunta por etapa, permite voltar e salva as respostas juntas", async () => {
    const fetchMock = mockProfile();
    render(<InitialInterestDialog />);
    expect(await screen.findByRole("button", { name: "Continuar" })).toBeDisabled();
    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Tecnologia/ }));
    expect(screen.getByRole("button", { name: "Continuar" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: /Meio ambiente/ }));
    expect(screen.getByRole("button", { name: "Continuar" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: /Saúde/ }));
    expect(screen.getByRole("button", { name: "Continuar" })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
    expect(screen.getByText("Etapa 2 de 2")).toBeInTheDocument();
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

  it("pula só a familiaridade e mantém os interesses", async () => {
    const fetchMock = mockProfile();
    render(<InitialInterestDialog />);
    await selectInterests();
    fireEvent.click(screen.getByLabelText("Estou começando"));
    fireEvent.click(screen.getByRole("button", { name: "Pular esta etapa" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(savedBody(fetchMock)).toEqual({
      interests: ["Tecnologia", "Meio ambiente", "Saúde"],
      onboardingCompleted: true,
    });
  });

  it("só permite concluir sem familiaridade ao clicar explicitamente em Pular", async () => {
    const fetchMock = mockProfile();
    render(<InitialInterestDialog />);
    await selectInterests();
    expect(screen.getByRole("button", { name: "Concluir" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Concluir" }));
    expect(fetchMock.mock.calls.some(([, options]) => options?.method === "PUT")).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "Pular esta etapa" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(savedBody(fetchMock)).toEqual({
      interests: ["Tecnologia", "Meio ambiente", "Saúde"],
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
