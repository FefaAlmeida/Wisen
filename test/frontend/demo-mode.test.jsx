import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DemoPage from "../../frontend/src/components/demo/page.jsx";

const mocks = vi.hoisted(() => ({ requisitar: vi.fn(), liveMounted: vi.fn() }));
vi.mock("@/services/api", () => ({ requisitar: mocks.requisitar }));

function Live() {
  mocks.liveMounted();
  return <p>Conteúdo da API</p>;
}

describe("apresentação de demonstração", () => {
  beforeEach(() => {
    mocks.requisitar.mockReset();
    mocks.liveMounted.mockClear();
  });

  it("usa o mock visual sem montar a tela que depende de conteúdo real", async () => {
    mocks.requisitar.mockResolvedValue({ aiProvider: "mock" });
    render(<DemoPage demo={<p>Mock original</p>} live={<Live />} />);
    expect(await screen.findByText("Mock original")).toBeInTheDocument();
    expect(mocks.liveMounted).not.toHaveBeenCalled();
    expect(mocks.requisitar).toHaveBeenCalledTimes(1);
    expect(mocks.requisitar).toHaveBeenCalledWith("/account/status", expect.anything());
  });

  it("mantém o fluxo integrado quando o provedor real está ativo", async () => {
    mocks.requisitar.mockResolvedValue({ aiProvider: "openai" });
    render(<DemoPage demo={<p>Mock original</p>} live={<p>Conteúdo da API</p>} />);
    expect(await screen.findByText("Conteúdo da API")).toBeInTheDocument();
    expect(screen.queryByText("Mock original")).not.toBeInTheDocument();
  });

  it("permite tentar novamente se não conseguir identificar o modo", async () => {
    mocks.requisitar
      .mockRejectedValueOnce(new Error("Conexão indisponível"))
      .mockResolvedValueOnce({ aiProvider: "mock" });
    render(<DemoPage demo={<p>Mock original</p>} live={<p>Conteúdo da API</p>} />);
    expect(await screen.findByRole("alert")).toHaveTextContent("Conexão indisponível");
    await userEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(await screen.findByText("Mock original")).toBeInTheDocument();
  });
});
