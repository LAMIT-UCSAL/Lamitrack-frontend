import type { FiltrosEventos } from "./api";
import { CATEGORIAS, type Categoria } from "./categorias";

// Filtros da tela /eventos, guardados na URL (dá para compartilhar o link
// filtrado): ?categoria=Hackathon&cidade=Salvador&data=2026-11-14&pagina=2

export const POR_PAGINA = 12;

export type FiltrosDaTela = {
  categoria: Categoria | "";
  cidade: string;
  // AAAA-MM-DD ou ""
  data: string;
  // Começa em 1 (na API, page começa em 0)
  pagina: number;
};

const PARTICULAS = new Set(["de", "da", "do", "das", "dos", "e"]);

// O backend compara a cidade com igualdade exata ("salvador" ≠ "Salvador"):
// "feira de santana" vira "Feira de Santana"
export function normalizarCidade(texto: string): string {
  return texto
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("pt-BR")
    .split(" ")
    .map((palavra, i) =>
      i > 0 && PARTICULAS.has(palavra)
        ? palavra
        : palavra.charAt(0).toLocaleUpperCase("pt-BR") + palavra.slice(1),
    )
    .join(" ");
}

export function lerFiltros(params: URLSearchParams): FiltrosDaTela {
  const categoria = params.get("categoria") ?? "";
  const data = params.get("data") ?? "";
  const pagina = Number.parseInt(params.get("pagina") ?? "1", 10);
  return {
    categoria: (CATEGORIAS as readonly string[]).includes(categoria)
      ? (categoria as Categoria)
      : "",
    cidade: normalizarCidade(params.get("cidade") ?? ""),
    data: /^\d{4}-\d{2}-\d{2}$/.test(data) ? data : "",
    pagina: Number.isFinite(pagina) && pagina > 0 ? pagina : 1,
  };
}

// Parâmetros de GET /eventos, sempre em ordem de data
export function paraApi(filtros: FiltrosDaTela): FiltrosEventos {
  return {
    tag: filtros.categoria || undefined,
    city: filtros.cidade || undefined,
    date: filtros.data || undefined,
    page: filtros.pagina - 1,
    size: POR_PAGINA,
    sort: "startsAt,asc",
  };
}

// Link para /eventos com os filtros; omite o que está vazio e a página 1
export function urlDosFiltros(filtros: Partial<FiltrosDaTela>): string {
  const params = new URLSearchParams();
  if (filtros.categoria) params.set("categoria", filtros.categoria);
  if (filtros.cidade) params.set("cidade", filtros.cidade);
  if (filtros.data) params.set("data", filtros.data);
  if (filtros.pagina && filtros.pagina > 1) {
    params.set("pagina", String(filtros.pagina));
  }
  const query = params.toString();
  return query ? `/eventos?${query}` : "/eventos";
}
