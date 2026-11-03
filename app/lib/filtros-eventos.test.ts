import { describe, expect, it } from "vitest";

import {
  lerFiltros,
  normalizarCidade,
  paraApi,
  POR_PAGINA,
  urlDosFiltros,
} from "./filtros-eventos";

describe("normalizarCidade", () => {
  it("põe as iniciais em maiúscula, menos as partículas", () => {
    expect(normalizarCidade("salvador")).toBe("Salvador");
    expect(normalizarCidade("  FEIRA   DE santana ")).toBe("Feira de Santana");
    expect(normalizarCidade("vitória da conquista")).toBe(
      "Vitória da Conquista",
    );
    expect(normalizarCidade("")).toBe("");
  });
});

describe("lerFiltros", () => {
  it("lê os filtros da URL", () => {
    const filtros = lerFiltros(
      new URLSearchParams(
        "categoria=Hackathon&cidade=salvador&data=2026-11-14&pagina=2",
      ),
    );
    expect(filtros).toEqual({
      categoria: "Hackathon",
      cidade: "Salvador",
      data: "2026-11-14",
      pagina: 2,
    });
  });

  it("ignora valores inválidos", () => {
    expect(
      lerFiltros(new URLSearchParams("categoria=Show&data=amanhã&pagina=-3")),
    ).toEqual({ categoria: "", cidade: "", data: "", pagina: 1 });
  });
});

describe("paraApi", () => {
  it("converte para os parâmetros de GET /eventos", () => {
    expect(
      paraApi({
        categoria: "Edital",
        cidade: "Salvador",
        data: "",
        pagina: 3,
      }),
    ).toEqual({
      tag: "Edital",
      city: "Salvador",
      date: undefined,
      page: 2,
      size: POR_PAGINA,
      sort: "startsAt,asc",
    });
  });
});

describe("urlDosFiltros", () => {
  it("monta o link só com o que foi preenchido", () => {
    expect(urlDosFiltros({})).toBe("/eventos");
    expect(urlDosFiltros({ categoria: "Ideathon", pagina: 1 })).toBe(
      "/eventos?categoria=Ideathon",
    );
    expect(
      urlDosFiltros({
        categoria: "Eventos de Inovação",
        cidade: "Feira de Santana",
        pagina: 2,
      }),
    ).toBe(
      "/eventos?categoria=Eventos+de+Inova%C3%A7%C3%A3o&cidade=Feira+de+Santana&pagina=2",
    );
  });
});
