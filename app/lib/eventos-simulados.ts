import { TAMANHO_PADRAO, type FiltrosEventos, type Pagina } from "./api";
import type { Evento } from "./evento";

// Dados de exemplo enquanto a API do backend não está no ar. Seguem os
// critérios do catálogo de fontes (Lamitrack-backend/docs/fontes.md): só as
// 5 categorias, eventos futuros, Bahia presencial + online; em editais,
// startsAt é o prazo de inscrição. Eventos fictícios.

function evento(
  id: number,
  title: string,
  startsAt: string,
  local: { venue: string | null; city: string | null; uf: string | null },
  tags: string[],
): Evento {
  return {
    id,
    title,
    description: null,
    startsAt,
    ...local,
    latitude: null,
    longitude: null,
    registrationUrl: null,
    source: "simulado",
    bannerUrl: null,
    tags,
  };
}

const SALVADOR = { venue: "Hub de inovação", city: "Salvador", uf: "BA" };
const ONLINE = { venue: "Online", city: null, uf: null };

export const EVENTOS_SIMULADOS: Evento[] = [
  evento(1, "Hackathon de Mobilidade Urbana", "2026-11-14T08:00:00", SALVADOR, [
    "Hackathon",
    "mobilidade",
  ]),
  evento(2, "Ideathon de Saúde Digital", "2026-11-21T09:00:00", ONLINE, [
    "Ideathon",
    "saúde",
  ]),
  evento(
    3,
    "Edital de Apoio a Startups de Base Tecnológica",
    "2026-11-28T23:59:00",
    { venue: null, city: "Salvador", uf: "BA" },
    ["Edital", "startups"],
  ),
  evento(
    4,
    "Maratona de Programação Universitária",
    "2026-12-05T08:30:00",
    { venue: "Campus universitário", city: "Feira de Santana", uf: "BA" },
    ["Maratona", "programação"],
  ),
  evento(5, "Encontro de Inovação Aberta", "2026-12-10T18:00:00", SALVADOR, [
    "Eventos de Inovação",
    "networking",
  ]),
  evento(
    6,
    "Hackathon Online de Dados Abertos",
    "2026-12-12T10:00:00",
    ONLINE,
    ["Hackathon", "dados abertos"],
  ),
  evento(
    7,
    "Edital de Bolsas de Inovação Tecnológica",
    "2026-12-15T23:59:00",
    { venue: null, city: null, uf: "BA" },
    ["Edital", "bolsas"],
  ),
  evento(
    8,
    "Ideathon de Economia Criativa",
    "2027-01-16T09:00:00",
    { venue: "Centro de economia criativa", city: "Salvador", uf: "BA" },
    ["Ideathon", "economia criativa"],
  ),
  evento(
    9,
    "Semana de Empreendedorismo e Tecnologia",
    "2027-01-25T19:00:00",
    { venue: "Auditório central", city: "Vitória da Conquista", uf: "BA" },
    ["Eventos de Inovação", "empreendedorismo"],
  ),
  evento(
    10,
    "Hackathon de Energia e Sustentabilidade",
    "2027-02-06T08:00:00",
    { venue: "Centro de pesquisa", city: "Camaçari", uf: "BA" },
    ["Hackathon", "energia"],
  ),
  evento(11, "Maratona de Inovação Online", "2027-02-20T14:00:00", ONLINE, [
    "Maratona",
    "inovação",
  ]),
  evento(
    12,
    "Edital de Subvenção para Pesquisa e Desenvolvimento",
    "2027-03-01T23:59:00",
    { venue: null, city: null, uf: null },
    ["Edital", "P&D"],
  ),
  evento(
    13,
    "Conferência de Startups do Nordeste",
    "2027-03-12T09:00:00",
    SALVADOR,
    ["Eventos de Inovação", "startups"],
  ),
  evento(
    14,
    "Hackathon de Agrotech",
    "2027-03-20T08:00:00",
    { venue: "Parque tecnológico", city: "Juazeiro", uf: "BA" },
    ["Hackathon", "agro"],
  ),
];

// Mesma lógica de GET /eventos do backend (EventFilter + Pageable do Spring),
// para a troca pela API real não mudar o comportamento das telas
export function consultarEventos(
  eventos: Evento[],
  filtros: FiltrosEventos = {},
): Pagina<Evento> {
  const { city, uf, tag, date, sort } = filtros;
  let resultado = eventos.filter(
    (e) =>
      (!city || e.city === city) &&
      (!uf || e.uf === uf) &&
      (!tag || e.tags.includes(tag)) &&
      (!date || e.startsAt.startsWith(`${date}T`)),
  );

  if (sort === "startsAt,asc" || sort === "startsAt,desc") {
    const sinal = sort.endsWith("desc") ? -1 : 1;
    resultado = [...resultado].sort(
      (a, b) => sinal * a.startsAt.localeCompare(b.startsAt),
    );
  }

  const size = filtros.size && filtros.size > 0 ? filtros.size : TAMANHO_PADRAO;
  const number = filtros.page && filtros.page > 0 ? filtros.page : 0;
  const totalElements = resultado.length;
  const totalPages = Math.ceil(totalElements / size);
  const content = resultado.slice(number * size, (number + 1) * size);

  return {
    content,
    totalElements,
    totalPages,
    size,
    number,
    numberOfElements: content.length,
    first: number === 0,
    last: number >= totalPages - 1,
    empty: content.length === 0,
  };
}
