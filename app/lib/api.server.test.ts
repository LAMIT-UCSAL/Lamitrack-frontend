import { afterEach, describe, expect, it, vi } from "vitest";

import { buscarEvento, listarEventos, usandoApiSimulada } from "./api.server";
import { EVENTOS_SIMULADOS } from "./eventos-simulados";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

function respostaJson(corpo: unknown, status = 200) {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("sem LAMITRACK_API_URL (API simulada)", () => {
  it("usa os dados simulados", async () => {
    vi.stubEnv("LAMITRACK_API_URL", "");
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);

    expect(usandoApiSimulada()).toBe(true);
    const pagina = await listarEventos({ tag: "Edital" });
    expect(pagina.totalElements).toBeGreaterThan(0);
    expect(pagina.content.every((e) => e.tags.includes("Edital"))).toBe(true);
    expect(await buscarEvento(1)).toEqual(EVENTOS_SIMULADOS[0]);
    expect(await buscarEvento(999)).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe("com LAMITRACK_API_URL (API real)", () => {
  it("chama GET /eventos com os filtros na query", async () => {
    vi.stubEnv("LAMITRACK_API_URL", "https://api.exemplo.com/");
    const pagina = { content: [], totalElements: 0 };
    const fetch = vi.fn().mockResolvedValue(respostaJson(pagina));
    vi.stubGlobal("fetch", fetch);

    expect(usandoApiSimulada()).toBe(false);
    const resultado = await listarEventos({
      city: "Salvador",
      tag: "Hackathon",
      page: 1,
      size: 12,
      sort: "startsAt,asc",
      date: "",
    });

    expect(resultado).toEqual(pagina);
    const url = new URL(fetch.mock.calls[0][0] as string);
    expect(url.origin + url.pathname).toBe("https://api.exemplo.com/eventos");
    expect(Object.fromEntries(url.searchParams)).toEqual({
      city: "Salvador",
      tag: "Hackathon",
      page: "1",
      size: "12",
      sort: "startsAt,asc",
    });
  });

  it("GET /eventos/{id}: devolve o evento ou null no 404", async () => {
    vi.stubEnv("LAMITRACK_API_URL", "https://api.exemplo.com");
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(respostaJson(EVENTOS_SIMULADOS[1]))
      .mockResolvedValueOnce(respostaJson({}, 404));
    vi.stubGlobal("fetch", fetch);

    expect(await buscarEvento(2)).toEqual(EVENTOS_SIMULADOS[1]);
    expect(fetch.mock.calls[0][0]).toBe("https://api.exemplo.com/eventos/2");
    expect(await buscarEvento(3)).toBeNull();
  });

  it("erro do servidor ou rede fora do ar viram erro claro", async () => {
    vi.stubEnv("LAMITRACK_API_URL", "https://api.exemplo.com");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(respostaJson({}, 500))
        .mockRejectedValueOnce(new TypeError("fetch failed")),
    );

    await expect(listarEventos()).rejects.toThrow(
      "API de eventos respondeu 500",
    );
    await expect(listarEventos()).rejects.toThrow("API de eventos fora do ar");
  });
});
