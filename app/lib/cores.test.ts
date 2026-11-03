import { afterEach, describe, expect, it } from "vitest";

import { corDoToken, hexToRgb } from "./cores";

afterEach(() => {
  document.documentElement.removeAttribute("style");
});

describe("hexToRgb", () => {
  it("converte hex de 6 ou 3 dígitos em RGB normalizado", () => {
    expect(hexToRgb("#0A3383")).toEqual([10 / 255, 51 / 255, 131 / 255]);
    expect(hexToRgb(" c17402 ")).toEqual([193 / 255, 116 / 255, 2 / 255]);
    expect(hexToRgb("#fff")).toEqual([1, 1, 1]);
    expect(hexToRgb("#0a3")).toEqual([0, 170 / 255, 51 / 255]);
    expect(hexToRgb("azul")).toEqual([1, 1, 1]);
  });
});

describe("corDoToken", () => {
  it("lê o token CSS como RGB", () => {
    document.documentElement.style.setProperty("--color-cobalt", "#0a3383");
    expect(corDoToken("--color-cobalt")).toEqual([
      10 / 255,
      51 / 255,
      131 / 255,
    ]);
  });

  it("devolve null sem o token", () => {
    expect(corDoToken("--color-inexistente")).toBeNull();
  });
});
