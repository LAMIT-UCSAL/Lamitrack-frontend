// Tipos da API de eventos do backend (Lamitrack-backend, EventController).
// Ficam fora do .server.ts para as telas poderem usá-los.

// Página do Spring Data (PageImpl serializado direto, Spring Boot 3.5)
export type Pagina<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};

// Filtros de GET /eventos: combinam com AND; city, uf e tag por igualdade
// exata; date (AAAA-MM-DD) pelo dia de startsAt
export type FiltrosEventos = {
  city?: string;
  uf?: string;
  tag?: string;
  date?: string;
  page?: number;
  size?: number;
  // Ex.: "startsAt,asc" (parâmetro sort do Spring)
  sort?: string;
};

// Padrão do Spring Data quando a página não informa size
export const TAMANHO_PADRAO = 20;
