import { describe, expect, it } from "vitest";

import { CATEGORIAS } from "./categorias";

describe("CATEGORIAS", () => {
  it("são exatamente as 5 categorias válidas, nesta ordem", () => {
    expect(CATEGORIAS).toEqual([
      "Hackathon",
      "Ideathon",
      "Maratona",
      "Edital",
      "Eventos de Inovação",
    ]);
  });
});
