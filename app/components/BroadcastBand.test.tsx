import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { BroadcastBand } from "./BroadcastBand";
import { Grainient } from "./Grainient";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("BroadcastBand", () => {
  it("sem WebGL2 (jsdom), mostra só o fallback em CSS com o conteúdo", () => {
    const { container } = render(
      <BroadcastBand>
        <h2>Não espere, construa.</h2>
      </BroadcastBand>,
    );

    expect(container.firstChild).toHaveClass("broadcast-band");
    expect(
      screen.getByRole("heading", { name: "Não espere, construa." }),
    ).toBeInTheDocument();
    expect(container.querySelector(".broadcast-band__canvas")).toBeNull();
  });

  it("com WebGL2, monta a camada animada e volta ao fallback se o contexto falhar", async () => {
    vi.resetModules();
    vi.stubGlobal("WebGL2RenderingContext", class {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    // Contexto "existe" no teste de suporte, mas o ogl não consegue usá-lo
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      {} as RenderingContext,
    );
    document.documentElement.style.setProperty("--color-cobalt", "#0A3383");
    document.documentElement.style.setProperty("--color-amber", "#C17402");
    const { BroadcastBand: BandaNova } = await import("./BroadcastBand");

    const { container } = render(<BandaNova>Faixa</BandaNova>);

    expect(container.querySelector(".broadcast-band__canvas")).not.toBeNull();
    await waitFor(() =>
      expect(container.querySelector(".broadcast-band__canvas")).toBeNull(),
    );
    expect(screen.getByText("Faixa")).toBeInTheDocument();

    vi.unstubAllGlobals();
    document.documentElement.removeAttribute("style");
  });

  it("a variante fina é decorativa e não tem conteúdo", () => {
    const { container } = render(<BroadcastBand variant="thin" />);

    const faixa = container.firstChild as HTMLElement;
    expect(faixa).toHaveClass("broadcast-band", "broadcast-band--thin");
    expect(faixa).toHaveAttribute("aria-hidden", "true");
    expect(faixa).toBeEmptyDOMElement();
  });
});

describe("Grainient", () => {
  it("sem WebGL, avisa o erro e não quebra a página", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    const onError = vi.fn();

    const { container } = render(
      <Grainient
        color1="#0A3383"
        color2="#C17402"
        color3="#0A3383"
        className="broadcast-band__canvas"
        onError={onError}
      />,
    );

    await waitFor(() => expect(onError).toHaveBeenCalled());
    const camada = container.firstChild as HTMLElement;
    expect(camada).toHaveAttribute("aria-hidden", "true");
    expect(camada).not.toHaveClass("is-ready");
    expect(camada.querySelector("canvas")).toBeNull();
  });
});
