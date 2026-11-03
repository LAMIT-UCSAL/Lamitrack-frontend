import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Globe } from "./Globe";

const update = vi.fn();
const destroy = vi.fn();
const createGlobe = vi.fn(() => ({ update, destroy }));

vi.mock("cobe", () => ({
  default: (...args: unknown[]) => createGlobe(...(args as [])),
}));

// jsdom não tem layout: o canvas "tem" 300px de largura nos testes
let largura = 300;

beforeEach(() => {
  largura = 300;
  vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(
    () => largura,
  );
  document.documentElement.style.setProperty("--color-paper", "#fbfaf8");
  document.documentElement.style.setProperty("--color-cobalt", "#0a3383");
  document.documentElement.style.setProperty("--color-paper-2", "#f2efe8");
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  createGlobe.mockClear();
  update.mockClear();
  destroy.mockClear();
  document.documentElement.removeAttribute("style");
});

function ultimoPhi() {
  const chamadas = update.mock.calls;
  return (chamadas[chamadas.length - 1][0] as { phi: number }).phi;
}

describe("Globe", () => {
  it("é uma imagem com nome", () => {
    render(<Globe />);

    expect(
      screen.getByRole("img", { name: "Globo terrestre com Salvador marcado" }),
    ).toHaveClass("globe__canvas");
  });

  it("cria o globo com as cores dos tokens, Salvador marcado e entra com fade", async () => {
    render(<Globe />);

    await waitFor(() => expect(createGlobe).toHaveBeenCalledOnce());
    const opcoes = (createGlobe.mock.calls[0] as unknown[])[1] as Record<
      string,
      unknown
    >;
    expect(opcoes.width).toBe(300);
    expect(opcoes.markerColor).toEqual([10 / 255, 51 / 255, 131 / 255]);
    expect(opcoes.markers).toEqual([
      { location: [-12.9718, -38.5017], size: 0.09 },
    ]);
    await waitFor(() =>
      expect(screen.getByRole("img")).toHaveClass("is-ready"),
    );
  });

  it("gira sozinho", async () => {
    render(<Globe />);

    await waitFor(() => expect(update).toHaveBeenCalled());
    const primeiro = ultimoPhi();
    await waitFor(() => expect(ultimoPhi()).toBeGreaterThan(primeiro));
  });

  it("com reduced-motion, não gira sozinho", async () => {
    vi.stubGlobal(
      "matchMedia",
      (query: string) =>
        ({
          matches: query.includes("reduce"),
          addEventListener: () => {},
          removeEventListener: () => {},
        }) as unknown as MediaQueryList,
    );
    render(<Globe />);

    await waitFor(() => expect(update.mock.calls.length).toBeGreaterThan(3));
    expect(ultimoPhi()).toBe(0);
  });

  it("é arrastável e fica onde parou ao soltar", async () => {
    vi.stubGlobal(
      "matchMedia",
      (query: string) =>
        ({
          matches: query.includes("reduce"),
          addEventListener: () => {},
          removeEventListener: () => {},
        }) as unknown as MediaQueryList,
    );
    render(<Globe />);
    await waitFor(() => expect(update).toHaveBeenCalled());
    const canvas = screen.getByRole("img");

    fireEvent.pointerDown(canvas, { clientX: 0, clientY: 0 });
    fireEvent.pointerMove(canvas, { clientX: 300, clientY: 0 });
    await waitFor(() => expect(ultimoPhi()).toBeCloseTo(1));
    fireEvent.pointerUp(canvas);
    await waitFor(() => expect(ultimoPhi()).toBeCloseTo(1));
  });

  it("oculto (largura 0), não cria o WebGL", async () => {
    largura = 0;
    render(<Globe />);

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(createGlobe).not.toHaveBeenCalled();
  });

  it("sem WebGL, não quebra a página", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    createGlobe.mockImplementationOnce(() => {
      throw new Error("sem WebGL");
    });
    render(<Globe />);

    await waitFor(() => expect(createGlobe).toHaveBeenCalled());
    expect(screen.getByRole("img")).not.toHaveClass("is-ready");
  });

  it("destrói o globo ao sair da tela", async () => {
    const { unmount } = render(<Globe />);
    await waitFor(() => expect(createGlobe).toHaveBeenCalled());

    unmount();
    expect(destroy).toHaveBeenCalledOnce();
  });
});
