import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FormularioCadastro from "../../frontend/src/components/formularioCadastro.jsx";
import FormularioLogin from "../../frontend/src/components/formularioLogin.jsx";

const mocks = vi.hoisted(() => ({ requisitar: vi.fn() }));

vi.mock("@/services/api", () => ({ requisitar: mocks.requisitar }));
vi.mock("next/link", async () => {
  const React = await import("react");
  return {
    default: ({ href, children, ...props }) =>
      React.createElement("a", { href, ...props }, children),
  };
});

describe("formulários de autenticação", () => {
  beforeEach(() => mocks.requisitar.mockReset());

  it("envia cadastro e mostra conflitos de e-mail", async () => {
    const user = userEvent.setup();
    mocks.requisitar.mockRejectedValueOnce(new Error("Este e-mail já está cadastrado"));
    render(<FormularioCadastro />);

    await user.type(screen.getByLabelText("Nome completo"), "Ana Teste");
    await user.type(screen.getByLabelText("E-mail"), "ana@example.test");
    await user.type(screen.getByLabelText("Senha"), "senha-segura-123");
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    await expect(screen.findByRole("alert")).resolves.toHaveTextContent(
      "Este e-mail já está cadastrado",
    );
    expect(mocks.requisitar).toHaveBeenCalledWith("/auth/register", {
      method: "POST",
      body: {
        name: "Ana Teste",
        email: "ana@example.test",
        password: "senha-segura-123",
      },
    });
  });

  it("envia o sinal de lembrar-me e apresenta credenciais inválidas", async () => {
    const user = userEvent.setup();
    mocks.requisitar.mockRejectedValueOnce(new Error("E-mail ou senha inválidos"));
    render(<FormularioLogin />);

    await user.type(screen.getByLabelText("E-mail"), "ana@example.test");
    await user.type(screen.getByLabelText("Senha"), "senha-incorreta");
    await user.click(screen.getByRole("checkbox", { name: "Lembrar de mim" }));
    fireEvent.submit(screen.getByRole("form", { name: "Entrar" }));

    await expect(screen.findByRole("alert")).resolves.toHaveTextContent(
      "E-mail ou senha inválidos",
    );
    expect(mocks.requisitar).toHaveBeenCalledWith("/auth/login", {
      method: "POST",
      body: {
        email: "ana@example.test",
        password: "senha-incorreta",
        remember: true,
      },
    });
  });
});
