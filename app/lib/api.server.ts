import type { FiltrosEventos, Pagina } from "./api";
import type { Evento } from "./evento";
import { consultarEventos, EVENTOS_SIMULADOS } from "./eventos-simulados";

// Cliente da API de eventos. Só roda no servidor (loaders): a URL da API fica
// fora do navegador. Sem LAMITRACK_API_URL, responde com os dados simulados.

function urlDaApi(): string | null {
  const url = process.env.LAMITRACK_API_URL?.trim();
  return url ? url.replace(/\/+$/, "") : null;
}

export function usandoApiSimulada(): boolean {
  return urlDaApi() === null;
}

function parametros(filtros: FiltrosEventos): URLSearchParams {
  const params = new URLSearchParams();
  for (const [chave, valor] of Object.entries(filtros)) {
    if (valor !== undefined && valor !== "") params.set(chave, String(valor));
  }
  return params;
}

async function pedir(caminho: string): Promise<Response> {
  const url = `${urlDaApi()}${caminho}`;
  try {
    return await fetch(url, { headers: { Accept: "application/json" } });
  } catch (error) {
    throw new Error(`API de eventos fora do ar (${url})`, { cause: error });
  }
}

// GET /eventos
export async function listarEventos(
  filtros: FiltrosEventos = {},
): Promise<Pagina<Evento>> {
  if (usandoApiSimulada()) return consultarEventos(EVENTOS_SIMULADOS, filtros);

  const resposta = await pedir(`/eventos?${parametros(filtros)}`);
  if (!resposta.ok) {
    throw new Error(`API de eventos respondeu ${resposta.status}`);
  }
  return (await resposta.json()) as Pagina<Evento>;
}

// GET /eventos/{id}; null quando o evento não existe (404)
export async function buscarEvento(id: number): Promise<Evento | null> {
  if (usandoApiSimulada()) {
    return EVENTOS_SIMULADOS.find((evento) => evento.id === id) ?? null;
  }

  const resposta = await pedir(`/eventos/${id}`);
  if (resposta.status === 404) return null;
  if (!resposta.ok) {
    throw new Error(`API de eventos respondeu ${resposta.status}`);
  }
  return (await resposta.json()) as Evento;
}
