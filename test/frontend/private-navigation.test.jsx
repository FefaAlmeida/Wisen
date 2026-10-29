import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PrivateNavigation from "../../frontend/src/components/privateNavigation.jsx";

const mocks = vi.hoisted(() => ({ usePathname: vi.fn(), requisitar: vi.fn() }));

vi.mock("next/navigation", () => ({ usePathname: mocks.usePathname }));
vi.mock("@/services/api", () => ({ requisitar: mocks.requisitar }));
vi.mock("next/link", async () => {
  const React = await import("react");
  return {
    default: ({ href, children, ...props }) =>
      React.createElement("a", { href, ...props }, children),
  };
});

describe("navegação privada", () => {
  beforeEach(() => {
    mocks.usePathname.mockReset();
    mocks.requisitar.mockReset();
  });

  it("mostra links, marca a rota e carrega o nome da sessão", async () => {
    mocks.usePathname.mockReturnValue("/paginaBiblioteca");
    mocks.requisitar.mockResolvedValue({ user: { name: "Ana Teste" } });
    render(<PrivateNavigation />);

    expect(screen.getByRole("navigation", { name: "Navegação principal" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Biblioteca" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await waitFor(() => expect(screen.getByText("Ana Teste")).toBeInTheDocument());
    expect(mocks.requisitar).toHaveBeenCalledWith("/auth/session");
  });

  it("não mostra navbar nem consulta sessão em rota pública", () => {
    mocks.usePathname.mockReturnValue("/paginaLogin");
    render(<PrivateNavigation />);
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(mocks.requisitar).not.toHaveBeenCalled();
  });
});
