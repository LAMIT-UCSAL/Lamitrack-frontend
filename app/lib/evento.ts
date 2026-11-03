import { CATEGORIAS, type Categoria } from "./categorias";

// Evento como a API do backend devolve (EventResponse, Lamitrack-backend).
// Os campos opcionais da tabela `events` chegam como null.
export type Evento = {
  id: number;
  title: string;
  description: string | null;
  // Data e hora locais, sem fuso: "2026-11-14T19:00:00"
  startsAt: string;
  venue: string | null;
  city: string | null;
  uf: string | null;
  latitude: number | null;
  longitude: number | null;
  registrationUrl: string | null;
  source: string;
  bannerUrl: string | null;
  tags: string[];
};

const MESES = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

// A categoria é a primeira tag que for uma das 5 válidas; as demais tags são livres.
export function categoriaDoEvento(
  evento: Pick<Evento, "tags">,
): Categoria | null {
  const categoria = evento.tags.find((tag): tag is Categoria =>
    (CATEGORIAS as readonly string[]).includes(tag),
  );
  return categoria ?? null;
}

// "2026-11-14T19:00:00" → "14 nov". Lê os números da própria string, sem
// `new Date`: assim servidor (UTC) e navegador (UTC−3) mostram o mesmo dia.
export function formatarData(startsAt: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(startsAt);
  if (!match) return "";
  const mes = MESES[Number(match[2]) - 1];
  if (!mes) return "";
  return `${Number(match[3])} ${mes}`;
}

// "Salvador/BA", "Salvador" ou "BA"; null sem nenhum dos dois
export function formatarCidade(
  evento: Pick<Evento, "city" | "uf">,
): string | null {
  const partes = [evento.city, evento.uf].filter(Boolean);
  return partes.length > 0 ? partes.join("/") : null;
}

// Texto da data no card e no carrossel. Em editais, startsAt é o prazo de
// inscrição (catálogo de fontes), então a data vem com "Inscrições até".
export function rotuloDaData(
  evento: Pick<Evento, "startsAt" | "tags">,
): string {
  const data = formatarData(evento.startsAt);
  return categoriaDoEvento(evento) === "Edital"
    ? `Inscrições até ${data}`
    : data;
}

const MESES_POR_EXTENSO = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

const DIAS_DA_SEMANA = [
  "domingo",
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
];

// "2026-11-14T08:00:00" → "sábado, 14 de novembro de 2026 · 8h".
// O dia da semana sai de uma conta em UTC sobre os números da própria data:
// servidor e navegador chegam ao mesmo resultado, em qualquer fuso.
export function formatarDataCompleta(startsAt: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/.exec(startsAt);
  if (!match) return "";
  const [ano, mes, dia] = [match[1], match[2], match[3]].map(Number);
  const nomeDoMes = MESES_POR_EXTENSO[mes - 1];
  if (!nomeDoMes) return "";
  const semana =
    DIAS_DA_SEMANA[new Date(Date.UTC(ano, mes - 1, dia)).getUTCDay()];
  const data = `${semana}, ${dia} de ${nomeDoMes} de ${ano}`;
  if (match[4] === undefined) return data;
  const hora = Number(match[4]);
  const minutos = match[5] === "00" ? "" : match[5];
  return `${data} · ${hora}h${minutos}`;
}

// Nome legível da fonte (campo source da API)
const FONTES: Record<string, string> = {
  sympla: "Sympla",
  fapesb: "FAPESB",
  devpost: "Devpost",
  "parque-tecnologico-ba": "Parque Tecnológico da Bahia",
  manual: "Cadastro da equipe LAMIT",
  simulado: "Dados de exemplo",
};

export function nomeDaFonte(source: string): string {
  return FONTES[source] ?? source;
}

// Link para o mapa (OpenStreetMap) quando o evento tem coordenadas
export function linkDoMapa(
  evento: Pick<Evento, "latitude" | "longitude">,
): string | null {
  const { latitude, longitude } = evento;
  if (latitude === null || longitude === null) return null;
  return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=17/${latitude}/${longitude}`;
}
