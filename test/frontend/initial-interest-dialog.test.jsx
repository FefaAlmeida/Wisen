import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { InitialInterestDialog } from "../../frontend/src/components/homeCliente/initialInterestDialog.jsx";

describe("onboarding de interesses", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("exige dois interesses antes de permitir salvar e não oferece pular", async () => {
    const profile = {
      preferences: {
        interests: [],
        onboardingCompleted: false,
      },
    };
    const fetchMock = vi.fn((url) => {
      if (url === "/api/categories") {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            categories: [
              { name: "Tecnologia", available: true },
              { name: "Meio ambiente", available: true },
            ],
          }),
        });
      }
      return Promise.resolve({
        ok: true,
        text: async () => JSON.stringify(profile),
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<InitialInterestDialog />);

    const saveButton = await screen.findByRole("button", { name: "Salvar interesses" });
    expect(saveButton).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Agora não" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Tecnologia/ }));
    expect(saveButton).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: /Meio ambiente/ }));
    expect(saveButton).toBeEnabled();

    fireEvent.click(saveButton);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3));
    expect(JSON.parse(fetchMock.mock.calls[2][1].body).interests).toEqual([
      "Tecnologia",
      "Meio ambiente",
    ]);
  });
});
