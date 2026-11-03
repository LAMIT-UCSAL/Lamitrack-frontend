import { describe, expect, it } from "vitest";

import {
  categoriaDoEvento,
  formatarCidade,
  formatarData,
  formatarDataCompleta,
  linkDoMapa,
  nomeDaFonte,
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

describe("formatarDataCompleta", () => {
  it("escreve dia da semana, data e hora por extenso", () => {
    expect(formatarDataCompleta("2026-11-14T08:00:00")).toBe(
      "sábado, 14 de novembro de 2026 · 8h",
    );
    expect(formatarDataCompleta("2026-11-28T23:59:00")).toBe(
      "sábado, 28 de novembro de 2026 · 23h59",
    );
    expect(formatarDataCompleta("2027-03-01T19:30:00")).toBe(
      "segunda-feira, 1 de março de 2027 · 19h30",
    );
  });

  it("não muda de dia perto da meia-noite (sem fuso)", () => {
    expect(formatarDataCompleta("2026-12-31T23:59:00")).toBe(
      "quinta-feira, 31 de dezembro de 2026 · 23h59",
    );
    expect(formatarDataCompleta("2027-01-01T00:00:00")).toBe(
      "sexta-feira, 1 de janeiro de 2027 · 0h",
    );
  });

  it("devolve vazio para valores inválidos", () => {
    expect(formatarDataCompleta("amanhã")).toBe("");
  });
});

describe("nomeDaFonte", () => {
  it("traduz as fontes conhecidas e mantém as outras", () => {
    expect(nomeDaFonte("sympla")).toBe("Sympla");
    expect(nomeDaFonte("fapesb")).toBe("FAPESB");
    expect(nomeDaFonte("nova-fonte")).toBe("nova-fonte");
  });
});

describe("linkDoMapa", () => {
  it("monta o link com as coordenadas", () => {
    expect(linkDoMapa({ latitude: -12.97, longitude: -38.5 })).toBe(
      "https://www.openstreetmap.org/?mlat=-12.97&mlon=-38.5#map=17/-12.97/-38.5",
    );
  });

  it("sem coordenadas, não há link", () => {
    expect(linkDoMapa({ latitude: null, longitude: -38.5 })).toBeNull();
  });
});
