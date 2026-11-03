import { describe, expect, it } from "vitest";

import { categoriaDoEvento, type Evento } from "./evento";
import { consultarEventos, EVENTOS_SIMULADOS } from "./eventos-simulados";

function evento(
  id: number,
  city: string | null,
  uf: string | null,
  startsAt: string,
  tags: string[],
): Evento {
  return {
    id,
    title: `Evento ${id}`,
    description: null,
    startsAt,
    venue: null,
    city,
    uf,
    latitude: null,
    longitude: null,
    registrationUrl: null,
    source: "teste",
    bannerUrl: null,
    tags,
  };
}

// Mesmo desenho do EventListControllerIntegrationTest do backend
const EVENTOS = [
  evento(1, "Aracaju", "SE", "2026-09-20T10:00:00", ["música"]),
  evento(2, "Aracaju", "SE", "2026-09-21T10:00:00", ["teatro"]),
  evento(3, "Maceió", "AL", "2026-09-20T23:59:00", ["música"]),
  evento(4, "Salvador", "BA", "2026-09-19T08:00:00", ["dança"]),
  evento(5, "Salvador", "BA", "2026-09-22T08:00:00", ["teatro"]),
];

describe("consultarEventos (mesma lógica de GET /eventos)", () => {
  it("sem filtro, devolve tudo na página padrão do Spring", () => {
    const pagina = consultarEventos(EVENTOS);

    expect(pagina).toMatchObject({
      totalElements: 5,
      totalPages: 1,
      size: 20,
      number: 0,
      numberOfElements: 5,
      first: true,
      last: true,
      empty: false,
    });
  });

  it("filtra por cidade e por UF com igualdade exata", () => {
    expect(consultarEventos(EVENTOS, { city: "Aracaju" }).totalElements).toBe(
      2,
    );
    expect(consultarEventos(EVENTOS, { city: "aracaju" }).totalElements).toBe(
      0,
    );
    expect(
      consultarEventos(EVENTOS, { uf: "AL" }).content.map((e) => e.city),
    ).toEqual(["Maceió"]);
  });

  it("filtra por tag e pelo dia de startsAt", () => {
    expect(consultarEventos(EVENTOS, { tag: "música" }).totalElements).toBe(2);
    expect(
      consultarEventos(EVENTOS, { date: "2026-09-20" }).content.map(
        (e) => e.id,
      ),
    ).toEqual([1, 3]);
  });

  it("combina filtros com AND", () => {
    const pagina = consultarEventos(EVENTOS, {
      city: "Aracaju",
      tag: "música",
      date: "2026-09-20",
    });
    expect(pagina.content.map((e) => e.id)).toEqual([1]);
  });

  it("pagina com page e size", () => {
    const segunda = consultarEventos(EVENTOS, { page: 1, size: 2 });
    expect(segunda).toMatchObject({
      totalElements: 5,
      totalPages: 3,
      size: 2,
      number: 1,
      first: false,
      last: false,
    });
    expect(segunda.content.map((e) => e.id)).toEqual([3, 4]);

    const alem = consultarEventos(EVENTOS, { page: 9, size: 2 });
    expect(alem.empty).toBe(true);
    expect(alem.content).toEqual([]);
  });

  it("ordena por startsAt com sort", () => {
    const pagina = consultarEventos(EVENTOS, { sort: "startsAt,asc" });
    expect(pagina.content.map((e) => e.id)).toEqual([4, 1, 3, 2, 5]);
  });
});

describe("EVENTOS_SIMULADOS (critérios do catálogo de fontes)", () => {
  it("todo evento tem uma das 5 categorias nas tags", () => {
    for (const e of EVENTOS_SIMULADOS) {
      expect(categoriaDoEvento(e), e.title).not.toBeNull();
    }
  });

  it("todas as categorias aparecem", () => {
    const categorias = new Set(EVENTOS_SIMULADOS.map(categoriaDoEvento));
    expect(categorias.size).toBe(5);
  });

  it("são futuros em relação à criação dos dados (2026-11-03)", () => {
    for (const e of EVENTOS_SIMULADOS) {
      expect(e.startsAt > "2026-11-03", e.title).toBe(true);
    }
  });

  it("são da Bahia ou online (sem cidade)", () => {
    for (const e of EVENTOS_SIMULADOS) {
      if (e.city) expect(e.uf, e.title).toBe("BA");
    }
    expect(EVENTOS_SIMULADOS.some((e) => e.venue === "Online")).toBe(true);
  });

  it("cobrem os campos da tela de detalhe", () => {
    expect(EVENTOS_SIMULADOS.every((e) => e.description)).toBe(true);
    expect(EVENTOS_SIMULADOS.some((e) => e.registrationUrl === null)).toBe(
      true,
    );
    expect(EVENTOS_SIMULADOS.some((e) => e.latitude !== null)).toBe(true);
    for (const e of EVENTOS_SIMULADOS) {
      if (e.registrationUrl) {
        expect(new URL(e.registrationUrl).hostname).toBe("example.com");
      }
    }
  });

  it("têm ids únicos", () => {
    const ids = EVENTOS_SIMULADOS.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
