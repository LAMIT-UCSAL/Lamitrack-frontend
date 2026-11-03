import { describe, expect, it } from "vitest";

import {
  categoriaDoEvento,
  formatarCidade,
  formatarData,
  rotuloDaData,
} from "./evento";

describe("categoriaDoEvento", () => {
  it("devolve a primeira tag que é categoria válida", () => {
    expect(
      categoriaDoEvento({ tags: ["tecnologia", "Ideathon", "Hackathon"] }),
    ).toBe("Ideathon");
  });

  it("devolve null quando nenhuma tag é categoria", () => {
    expect(categoriaDoEvento({ tags: ["gastronomia"] })).toBeNull();
    expect(categoriaDoEvento({ tags: [] })).toBeNull();
  });

  it("compara de forma exata", () => {
    expect(categoriaDoEvento({ tags: ["hackathon"] })).toBeNull();
  });
});

describe("formatarData", () => {
  it("mostra dia e mês abreviado", () => {
    expect(formatarData("2026-11-14T19:00:00")).toBe("14 nov");
    expect(formatarData("2026-01-05T09:30:00")).toBe("5 jan");
  });

  it("não muda de dia perto da meia-noite (sem fuso)", () => {
    expect(formatarData("2026-12-31T23:59:00")).toBe("31 dez");
    expect(formatarData("2026-03-01T00:00:00")).toBe("1 mar");
  });

  it("devolve vazio para valores inválidos", () => {
    expect(formatarData("amanhã")).toBe("");
    expect(formatarData("2026-13-01T00:00:00")).toBe("");
  });
});

describe("formatarCidade", () => {
  it("junta cidade e UF", () => {
    expect(formatarCidade({ city: "Salvador", uf: "BA" })).toBe("Salvador/BA");
  });

  it("omite o que estiver faltando", () => {
    expect(formatarCidade({ city: "Salvador", uf: null })).toBe("Salvador");
    expect(formatarCidade({ city: null, uf: "BA" })).toBe("BA");
  });

  it("devolve null sem cidade nem UF", () => {
    expect(formatarCidade({ city: null, uf: null })).toBeNull();
  });
});

describe("rotuloDaData", () => {
  it("em editais, mostra o prazo de inscrição", () => {
    expect(
      rotuloDaData({ startsAt: "2026-11-28T23:59:00", tags: ["Edital"] }),
    ).toBe("Inscrições até 28 nov");
  });

  it("nas outras categorias, só a data", () => {
    expect(
      rotuloDaData({ startsAt: "2026-11-14T08:00:00", tags: ["Hackathon"] }),
    ).toBe("14 nov");
    expect(rotuloDaData({ startsAt: "2026-11-14T08:00:00", tags: [] })).toBe(
      "14 nov",
    );
  });
});
