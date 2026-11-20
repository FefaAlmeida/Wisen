import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CatalogoConceitos } from "../../frontend/src/components/biblioteca/catalogoConceitos.jsx";
import { DemoContext } from "../../frontend/src/components/demo/mode.jsx";
import PaginaConceito from "../../frontend/src/components/demo/paginaConceito.jsx";

vi.mock("@/services/api", () => ({
  requisitar: vi.fn().mockResolvedValue({ user: { id: "test-user" } }),
}));

const navigation = vi.hoisted(() => ({ name: "Inflação" }));
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams({ conceito: navigation.name }),
}));
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));
vi.mock("../../frontend/src/components/platform/shared.jsx", () => ({
  Frame: ({ children }) => <main>{children}</main>,
}));

describe("detalhe de conceito", () => {
  beforeEach(() => {
    localStorage.clear();
    navigation.name = "Inflação";
  });

  it("abre o conceito escolhido e oferece conexões com destinos distintos", () => {
    navigation.name = "Taxa Selic";
    render(<PaginaConceito />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Taxa Selic");
    expect(screen.getByRole("heading", { name: "Na prática" })).toBeVisible();
    expect(screen.getByRole("link", { name: /^Inflação/ })).toHaveAttribute(
      "href",
      "/paginaConceito?conceito=Infla%C3%A7%C3%A3o",
    );
    expect(screen.getByRole("link", { name: "Política monetária" })).toHaveAttribute(
      "href",
      "/paginaConceito?conceito=Pol%C3%ADtica%20monet%C3%A1ria",
    );
  });

  it("reinicia as marcações locais ao navegar para outro conceito", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<PaginaConceito />);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Salvar conceito" })).toBeEnabled(),
    );
    await user.click(screen.getByRole("button", { name: "Salvar conceito" }));
    await user.click(screen.getByRole("button", { name: "Ainda tenho dúvidas" }));
    expect(screen.getByRole("button", { name: "Conceito salvo" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("status")).toHaveTextContent("Dúvida marcada");
    navigation.name = "Aquecimento global";
    rerender(<PaginaConceito />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Aquecimento global");
    expect(screen.getByRole("button", { name: "Salvar conceito" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: "Ainda tenho dúvidas" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("mostra os conceitos salvos na biblioteca e mantém a remoção ao reabrir", async () => {
    const user = userEvent.setup();
    const detail = render(<PaginaConceito />);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Salvar conceito" })).toBeEnabled(),
    );
    await user.click(screen.getByRole("button", { name: "Salvar conceito" }));
    detail.unmount();

    const library = render(
      <DemoContext value={true}>
        <CatalogoConceitos />
      </DemoContext>,
    );
    await user.click(screen.getByRole("button", { name: "Conceitos salvos" }));
    expect(await screen.findByRole("heading", { name: "Conceitos salvos (1)" })).toBeVisible();
    expect(screen.getByRole("link", { name: /^Inflação/ })).toHaveAttribute(
      "href",
      "/paginaConceito?conceito=Infla%C3%A7%C3%A3o",
    );
    expect(screen.queryByRole("link", { name: "Taxa Selic" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Remover Inflação dos salvos" }));
    expect(await screen.findByText("Você ainda não salvou nenhum conceito.")).toBeVisible();
    library.unmount();

    render(<PaginaConceito />);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Salvar conceito" })).toBeEnabled(),
    );
    expect(screen.getByRole("button", { name: "Salvar conceito" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("não substitui um conceito desconhecido por inflação", () => {
    navigation.name = "Não existe";
    render(<PaginaConceito />);
    expect(screen.getByRole("heading", { name: "Conceito não encontrado" })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "Inflação" })).not.toBeInTheDocument();
  });
});
