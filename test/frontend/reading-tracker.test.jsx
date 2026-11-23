import { act, cleanup, render } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { requisitar } from "@/services/api";
import ReadingTracker from "../../frontend/src/components/platform/readingTracker";

vi.mock("@/services/api", () => ({ requisitar: vi.fn(async () => ({ saved: true })) }));
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});
it("registra abertura e trinta segundos ativos sem contar aba oculta", async () => {
  vi.useFakeTimers({ toFake: ["setInterval", "clearInterval", "performance"] });
  vi.spyOn(document, "hasFocus").mockReturnValue(true);
  const visible = vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
  render(<ReadingTracker eventId="evento" />);
  expect(requisitar).toHaveBeenCalledWith(
    "/feed/interactions",
    expect.objectContaining({ body: expect.objectContaining({ type: "open" }) }),
  );
  await act(async () => vi.advanceTimersByTime(15000));
  visible.mockReturnValue("hidden");
  await act(async () => vi.advanceTimersByTime(20000));
  visible.mockReturnValue("visible");
  await act(async () => vi.advanceTimersByTime(15000));
  const total = requisitar.mock.calls.reduce(
    (n, [, options]) => n + (options.body.type === "progress" ? options.body.seconds : 0),
    0,
  );
  expect(total).toBe(30);
});
