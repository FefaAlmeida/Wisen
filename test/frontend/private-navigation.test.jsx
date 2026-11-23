import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AdminSidebar } from "../../frontend/src/components/admin/adminSidebar.jsx";
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
    expect(
      screen.getByRole("navigation", { name: "Navegação principal" }).querySelectorAll("a"),
    ).toHaveLength(6);
    expect(
      Array.from(
        screen.getByRole("navigation", { name: "Navegação principal" }).querySelectorAll("a"),
        (link) => link.getAttribute("aria-label"),
      ),
    ).toEqual(["Início", "Notícias", "Conceitos", "Revisões", "Aprendizado", "Salvos"]);
    expect(screen.getByRole("link", { name: "Aprendizado" })).toHaveAttribute(
      "href",
      "/paginaConhecimento",
    );
    expect(screen.getByRole("link", { name: "Conceitos" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Notícias" })).toHaveAttribute(
      "href",
      "/paginaExplorar",
    );
    expect(screen.getByRole("link", { name: "Revisões" })).toHaveAttribute(
      "href",
      "/paginaRevisoes",
    );
    expect(fetch).not.toHaveBeenCalled();
    expect(screen.queryByRole("link", { name: "Painel administrativo" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Configurações" })).not.toBeInTheDocument();
  });

  it("usa texto branco, realce amarelo, logo transparente ao lado do nome e ícones reforçados", () => {
    render(<Sidebar activeItem="Início" />);

    const activeLink = screen.getByRole("link", { name: "Início" });
    const inactiveLink = screen.getByRole("link", { name: "Notícias" });
    expect(activeLink).toHaveClass("bg-wisen-destaque-suave", "text-[#202D3A]");
    expect(inactiveLink).toHaveClass("text-white", "hover:bg-white/10");
    expect(inactiveLink.querySelector("svg")).toHaveAttribute("stroke-width", "2.2");

    const logo = screen.getAllByAltText("Logo Wisen")[0];
    expect(logo).toHaveClass("size-10", "object-contain", "lg:size-11");
    expect(logo.getAttribute("src")).toContain("logoWisen-simbolo-transparente.png");
    expect(logo).not.toHaveClass("rounded-full", "bg-[#f3f0e8]");
    expect(logo.parentElement).toHaveClass("inline-flex", "items-center", "gap-2.5");
    expect(logo.parentElement).not.toHaveClass("flex-col");
    expect(logo.parentElement).toHaveTextContent("Wisen");
  });

  it("mantém a navegação do cliente sem acesso administrativo", () => {
    render(<Sidebar activeItem="Início" />);
    expect(screen.queryByRole("link", { name: "Painel administrativo" })).not.toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("permite tentar novamente quando a saída do administrador falha", async () => {
    const userEvent = (await import("@testing-library/user-event")).default;
    fetch.mockRejectedValue(new Error("offline"));
    render(<AdminSidebar activeItem="Visão geral" />);
    const button = screen.getByRole("button", { name: "Sair da conta" });
    await userEvent.click(button);
    expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível sair da conta");
    expect(button).toBeEnabled();
    expect(fetch).toHaveBeenCalledWith(
      "/api/auth/logout",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("mantém os destinos de administração com o estilo da sidebar do cliente", () => {
    render(<AdminSidebar activeItem="Visão geral" />);

    expect(screen.getAllByRole("link", { name: "Visão geral" })[0]).toHaveClass(
      "bg-wisen-destaque-suave",
      "text-[#202D3A]",
    );
    expect(screen.getAllByRole("link", { name: "Revisão de eventos" })[0]).toHaveAttribute(
      "href",
      "/paginaCuradoriaEventosAdm",
    );
  });
});
