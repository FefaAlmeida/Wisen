import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import FormularioAuth from "../../frontend/src/components/formularioAuth.jsx";
import { renderWithToasts } from "./render-with-toasts";

const mocks = vi.hoisted(() => ({ requisitar: vi.fn() }));
vi.mock("@/services/api", () => ({ requisitar: mocks.requisitar }));

describe("autenticação unificada", () => {
  beforeEach(() => {
    mocks.requisitar.mockReset();
    mocks.requisitar.mockImplementation(async (path) => {
      if (path === "/locations/options")
        return {
          locations: [
            { countryCode: "BR", countryName: "Brasil", stateId: 2021, stateName: "São Paulo" },
          ],
        };
      throw new Error(`Unexpected request: ${path}`);
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  async function continueWithEmail(exists, createAccount = !exists) {
    mocks.requisitar.mockResolvedValueOnce({ exists });
    const user = userEvent.setup();
    renderWithToasts(<FormularioAuth glass />);
    expect(screen.queryByLabelText("Senha")).not.toBeInTheDocument();
    await user.type(screen.getByLabelText("E-mail"), "Ana@Example.test");
    await user.click(screen.getByRole("button", { name: "Continuar" }));
    expect(mocks.requisitar).toHaveBeenCalledWith("/auth/check-email", {
      method: "POST",
      body: { email: "ana@example.test" },
    });
    if (createAccount) {
      await user.click(screen.getByRole("button", { name: "Quero criar uma conta" }));
    }
    return user;
  }

  it("permite tentar login quando a consulta não encontra o e-mail", async () => {
    const user = await continueWithEmail(false, false);
    expect(screen.getByRole("heading", { name: "E-mail não encontrado." })).toBeVisible();
    expect(screen.queryByLabelText("Senha")).not.toBeInTheDocument();
    expect(mocks.requisitar).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Já tenho conta" }));
    await user.type(screen.getByLabelText("Senha"), "senha-existente");
    mocks.requisitar.mockRejectedValueOnce(new Error("E-mail ou senha inválidos"));
    await user.click(screen.getByRole("button", { name: "Entrar", exact: true }));
    expect(mocks.requisitar).toHaveBeenLastCalledWith("/auth/login", {
      method: "POST",
      body: { email: "ana@example.test", password: "senha-existente", remember: false },
    });
    expect(await screen.findByRole("alert")).toHaveTextContent("E-mail ou senha inválidos");
  });

  it.each([true, false])(
    "continua no cartão com onboarding após autenticar (login: %s)",
    async (exists) => {
      window.history.replaceState(null, "", "/auth?next=%2FpaginaGuardados");
      const user = await continueWithEmail(exists);
      mocks.requisitar.mockResolvedValueOnce({ user: { role: "user" } });
      mocks.requisitar.mockResolvedValueOnce({
        categories: [{ name: "Economia" }, { name: "Juros" }, { name: "Tecnologia" }],
      });
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          text: async () =>
            JSON.stringify({
              user: { name: "" },
              preferences: { interests: [], onboardingCompleted: false },
            }),
        }),
      );
      await user.type(screen.getByLabelText("Senha"), "senha-segura-123");
      await user.click(
        screen.getByRole("button", { name: exists ? "Entrar" : "Criar conta", exact: true }),
      );
      expect(
        await screen.findByRole("heading", { level: 1, name: "Nome Completo" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("region", { name: "Personalize sua experiência" }),
      ).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Wisen, página inicial" })).toBeInTheDocument();
      expect(screen.queryByLabelText("Senha")).not.toBeInTheDocument();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(window.location.pathname).toBe("/onboarding");
      expect(window.location.search).toBe("?next=%2FpaginaGuardados");
    },
  );

  it("mostra o carregamento no mesmo cartão enquanto prepara o onboarding de uma nova conta", async () => {
    window.history.replaceState(null, "", "/auth");
    const user = await continueWithEmail(false);
    const brand = screen.getByRole("link", { name: "Wisen, página inicial" });
    let resolveProfile;
    vi.stubGlobal(
      "fetch",
      vi.fn(
        () =>
          new Promise((resolve) => {
            resolveProfile = resolve;
          }),
      ),
    );
    mocks.requisitar.mockResolvedValueOnce({ user: { role: "user" } });
    mocks.requisitar.mockResolvedValueOnce({ categories: [{ name: "Economia" }] });
    await user.type(screen.getByLabelText("Senha"), "senha-segura-123");
    await user.click(screen.getByRole("button", { name: "Criar conta" }));
    expect(screen.getByRole("status")).toHaveTextContent("Preparando seu perfil…");
    expect(screen.queryByLabelText("Senha")).not.toBeInTheDocument();
    expect(window.location.pathname).toBe("/auth");
    resolveProfile({
      ok: true,
      text: async () =>
        JSON.stringify({
          user: { name: "" },
          preferences: { interests: [], onboardingCompleted: false },
        }),
    });
    await screen.findByRole("heading", { name: "Nome Completo" });
    expect(screen.queryByText("Preparando seu perfil…")).not.toBeInTheDocument();
    expect(window.location.pathname).toBe("/onboarding");
    expect(screen.getByRole("link", { name: "Wisen, página inicial" })).toBe(brand);
  });

  it("retoma o onboarding ao abrir diretamente a nova rota", async () => {
    window.history.replaceState(null, "", "/onboarding?next=%2FpaginaGuardados");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () =>
          JSON.stringify({
            user: { name: "Ana" },
            location: { countryCode: "BR", stateId: 2021 },
            preferences: { interests: [], onboardingCompleted: false },
          }),
      }),
    );
    mocks.requisitar.mockResolvedValueOnce({ categories: [{ name: "Economia" }] });
    renderWithToasts(<FormularioAuth glass initialOnboarding />);
    expect(
      await screen.findByRole("heading", { name: "Quais assuntos interessam a você?" }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Senha")).not.toBeInTheDocument();
    expect(window.location.pathname).toBe("/onboarding");
    expect(window.location.search).toBe("?next=%2FpaginaGuardados");
  });

  it("mostra login e envia senha com lembrar de mim", async () => {
    const user = await continueWithEmail(true);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Que bom te ver de novo.");
    expect(
      screen.queryByText("Entre ou crie sua conta usando seu e-mail."),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toHaveAttribute("autocomplete", "current-password");
    expect(screen.getByRole("button", { name: "Esqueci minha senha" })).toBeEnabled();
    mocks.requisitar.mockRejectedValueOnce(new Error("E-mail ou senha inválidos"));
    await user.type(screen.getByLabelText("Senha"), "senha-incorreta");
    await user.click(screen.getByRole("checkbox", { name: "Lembrar de mim" }));
    await user.click(screen.getByRole("button", { name: "Entrar", exact: true }));
    expect(await screen.findByRole("alert")).toHaveTextContent("E-mail ou senha inválidos");
    expect(mocks.requisitar).toHaveBeenLastCalledWith("/auth/login", {
      method: "POST",
      body: { email: "ana@example.test", password: "senha-incorreta", remember: true },
    });
  });

  it("cria conta sem nome e transforma conflito em login", async () => {
    const user = await continueWithEmail(false);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Prazer em te conhecer.");
    expect(
      screen.queryByText("Entre ou crie sua conta usando seu e-mail."),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toHaveAttribute("autocomplete", "new-password");
    expect(screen.getByLabelText("Senha")).toHaveAttribute("minlength", "8");
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    mocks.requisitar.mockRejectedValueOnce(Object.assign(new Error("duplicate"), { status: 409 }));
    await user.type(screen.getByLabelText("Senha"), "senha-segura-123");
    await user.click(screen.getByRole("button", { name: "Criar conta" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Entre com sua senha");
    expect(mocks.requisitar).toHaveBeenLastCalledWith("/auth/register", {
      method: "POST",
      body: { email: "ana@example.test", password: "senha-segura-123" },
    });
    expect(screen.getByLabelText("Senha")).toHaveValue("");
    expect(screen.getByRole("button", { name: "Entrar", exact: true })).toBeEnabled();
  });

  it("trocar e-mail exige nova consulta e limpa senha", async () => {
    const user = await continueWithEmail(false);
    await user.type(screen.getByLabelText("Senha"), "senha-antiga-123");
    expect(screen.getByLabelText("E-mail")).toHaveAttribute("readonly");
    await user.click(screen.getByRole("button", { name: "trocar" }));
    expect(screen.getByLabelText("E-mail")).not.toHaveAttribute("readonly");
    await waitFor(() => expect(screen.getByLabelText("E-mail")).toHaveFocus());
    await user.clear(screen.getByLabelText("E-mail"));
    expect(screen.queryByLabelText("Senha")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Seu próximo capítulo começa aqui.",
    );
    expect(screen.getByText("Entre ou crie sua conta usando seu e-mail.")).toBeInTheDocument();
    await user.type(screen.getByLabelText("E-mail"), "outra@example.test");
    mocks.requisitar.mockResolvedValueOnce({ exists: true });
    await user.click(screen.getByRole("button", { name: "Continuar" }));
    expect(screen.getByLabelText("Senha")).toHaveValue("");
  });

  it("permite tentar novamente após falha e bloqueia envios simultâneos", async () => {
    const user = userEvent.setup();
    renderWithToasts(<FormularioAuth />);
    await user.type(screen.getByLabelText("E-mail"), "ana@example.test");
    let rejectRequest;
    mocks.requisitar.mockImplementationOnce(
      () =>
        new Promise((_, reject) => {
          rejectRequest = reject;
        }),
    );
    const form = screen.getByRole("form");
    fireEvent.submit(form);
    fireEvent.submit(form);
    expect(mocks.requisitar).toHaveBeenCalledTimes(1);
    rejectRequest(new Error("Tente novamente mais tarde"));
    expect(await screen.findByRole("alert")).toHaveTextContent("Tente novamente mais tarde");
    await waitFor(() => expect(screen.getByRole("button", { name: "Continuar" })).toBeEnabled());
    expect(screen.queryByLabelText("Senha")).not.toBeInTheDocument();
  });

  it("recupera acesso dentro do auth com o e-mail preenchido e permite voltar", async () => {
    const user = await continueWithEmail(true);
    await user.type(screen.getByLabelText("Senha"), "senha-antiga");
    await user.click(screen.getByRole("button", { name: "Esqueci minha senha" }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Recupere seu acesso.");
    expect(screen.getByLabelText("E-mail")).toHaveValue("ana@example.test");
    expect(screen.queryByLabelText("Senha")).not.toBeInTheDocument();
    mocks.requisitar.mockResolvedValueOnce({});
    await user.click(screen.getByRole("button", { name: "Enviar link de recuperação" }));
    expect(mocks.requisitar).toHaveBeenLastCalledWith("/account/forgot", {
      method: "POST",
      body: { email: "ana@example.test" },
    });
    expect(screen.getByRole("status")).toHaveTextContent("Se a conta existir");
    await user.click(screen.getByRole("button", { name: "Voltar para entrar" }));
    expect(screen.getByRole("button", { name: "Continuar" })).toBeEnabled();
  });

  it("confirma a nova senha antes de usar o token e remove o token após sucesso", async () => {
    const user = userEvent.setup();
    const token = "a".repeat(43);
    window.history.replaceState(null, "", `/auth?action=reset&token=${token}`);
    renderWithToasts(<FormularioAuth glass initialAction="reset" resetToken={token} />);
    await user.type(screen.getByLabelText("Nova senha", { exact: true }), "senha-segura-nova");
    await user.type(screen.getByLabelText("Confirmar nova senha"), "senha-diferente");
    await user.click(screen.getByRole("button", { name: "Salvar nova senha" }));
    expect(screen.getByRole("alert")).toHaveTextContent("As senhas precisam ser iguais.");
    expect(mocks.requisitar).not.toHaveBeenCalled();
    await user.clear(screen.getByLabelText("Confirmar nova senha"));
    await user.type(screen.getByLabelText("Confirmar nova senha"), "senha-segura-nova");
    mocks.requisitar.mockResolvedValueOnce({});
    await user.click(screen.getByRole("button", { name: "Salvar nova senha" }));
    expect(mocks.requisitar).toHaveBeenCalledWith("/account/reset", {
      method: "POST",
      body: { token, password: "senha-segura-nova" },
    });
    expect(screen.getByRole("status")).toHaveTextContent("Senha redefinida.");
    expect(window.location.search).not.toContain("token");
    expect(screen.queryByLabelText("Nova senha", { exact: true })).not.toBeInTheDocument();
  });

  it("permite solicitar outro link quando o token expirou", async () => {
    const user = userEvent.setup();
    renderWithToasts(<FormularioAuth glass initialAction="reset" resetToken={"b".repeat(43)} />);
    await user.type(screen.getByLabelText("Nova senha", { exact: true }), "senha-segura-nova");
    await user.type(screen.getByLabelText("Confirmar nova senha"), "senha-segura-nova");
    mocks.requisitar.mockRejectedValueOnce(
      Object.assign(new Error("Link inválido ou expirado"), { status: 400 }),
    );
    await user.click(screen.getByRole("button", { name: "Salvar nova senha" }));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Este link é inválido, expirou ou já foi usado.",
    );
    await user.click(screen.getByRole("button", { name: "Solicitar novo link" }));
    expect(screen.getByLabelText("E-mail")).toBeEnabled();
    expect(screen.getByRole("button", { name: "Enviar link de recuperação" })).toBeEnabled();
  });
});
