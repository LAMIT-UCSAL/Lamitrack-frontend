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

// "Minex Hub · Salvador/BA"; null sem local nenhum
export function formatarLocal(
  evento: Pick<Evento, "venue" | "city" | "uf">,
): string | null {
  const partes = [evento.venue, formatarCidade(evento)].filter(Boolean);
  return partes.length > 0 ? partes.join(" · ") : null;
}
