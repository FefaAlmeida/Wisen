import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Sidebar from "../../frontend/src/components/sidebar.jsx";

vi.mock("next/link", async () => {
  const React = await import("react");
  return {
    default: ({ href, children, ...props }) =>
      React.createElement("a", { href, ...props }, children),
  };
});

describe("navegação privada", () => {
  beforeEach(() => vi.stubGlobal("fetch", vi.fn()));
  afterEach(() => vi.unstubAllGlobals());

  it("marca a biblioteca e oculta o painel administrativo para usuário comum", async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ user: { role: "user" } }) });
    render(<Sidebar activeItem="Conceitos" />);
    expect(screen.getByRole("navigation", { name: "Navegação principal" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Meu conhecimento" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Explorar" })).toHaveAttribute(
      "href",
      "/paginaExplorar",
    );
    await vi.waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(screen.queryByRole("link", { name: "Painel administrativo" })).not.toBeInTheDocument();
  });

  it("usa texto branco, realce amarelo, logo ao lado do nome e ícones reforçados", () => {
    render(<Sidebar activeItem="Início" />);

    const activeLink = screen.getByRole("link", { name: "Início" });
    const inactiveLink = screen.getByRole("link", { name: "Explorar" });
    expect(activeLink).toHaveClass("bg-[#EBDD80]", "text-[#202D3A]");
    expect(inactiveLink).toHaveClass("text-white", "hover:bg-[#EBDD80]", "hover:text-[#202D3A]");
    expect(inactiveLink.querySelector("svg")).toHaveAttribute("stroke-width", "2.2");

    const logo = screen.getAllByAltText("Logo Wisen")[0];
    expect(logo.parentElement).toHaveTextContent("Wisen");
  });

  it("oferece acesso ao painel para administrador", async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ user: { role: "admin" } }) });
    render(<Sidebar activeItem="Início" />);
    expect(await screen.findByRole("link", { name: "Painel administrativo" })).toHaveAttribute(
      "href",
      "/paginaInicioAdm",
    );
  });
});
