import { useState } from "react";

import { BroadcastBand } from "~/components/BroadcastBand";
import { Button } from "~/components/Button";
import { CategoryTabs } from "~/components/CategoryTabs";
import { EventCard } from "~/components/EventCard";
import { EventCarousel } from "~/components/EventCarousel";
import { Kicker } from "~/components/Kicker";
import { CATEGORIAS } from "~/lib/categorias";
import { categoriaDoEvento, type Evento } from "~/lib/evento";

import type { Route } from "./+types/home";
import "./home.scss";

export const meta: Route.MetaFunction = () => [
  { title: "LamiTrack" },
  {
    name: "description",
    content: "Vitrine de eventos de tecnologia e inovação da LAMIT.",
  },
];

const FILTROS = ["Todos", ...CATEGORIAS];

// Eventos fictícios no formato da API, só para mostrar o card e o carrossel.
// Os dados reais chegam com a #4/#20.
function exemplo(
  id: number,
  title: string,
  startsAt: string,
  tags: string[],
): Evento {
  return {
    id,
    title,
    description: null,
    startsAt,
    venue: null,
    city: "Salvador",
    uf: "BA",
    latitude: null,
    longitude: null,
    registrationUrl: null,
    source: "exemplo",
    bannerUrl: null,
    tags,
  };
}

const EVENTOS_EXEMPLO = [
  exemplo(1, "Hackathon de exemplo", "2026-11-14T19:00:00", ["Hackathon"]),
  exemplo(2, "Ideathon de exemplo", "2026-11-21T09:00:00", ["Ideathon"]),
  exemplo(3, "Edital de exemplo", "2026-12-05T18:00:00", ["Edital"]),
];

// Página provisória: vitrine dos estilos da LAMIT até a tela Home real (#20).
export default function Home() {
  const [filtro, setFiltro] = useState<string>("Todos");
  const eventos = EVENTOS_EXEMPLO.filter(
    (evento) => filtro === "Todos" || categoriaDoEvento(evento) === filtro,
  );

  return (
    <main id="conteudo">
      <section className="home-intro page-container">
        <Kicker>Vitrine de eventos.</Kicker>
        <h1>LamiTrack</h1>
        <p className="home-intro__lede">
          Eventos de tecnologia e inovação reunidos pela LAMIT. Esta é uma
          página provisória com a prévia dos estilos.
        </p>
        <div className="home-intro__actions">
          <Button href="#eventos">Ver eventos</Button>
          <Button
            variant="secondary"
            href="https://lamitsite.com.br"
            target="_blank"
            rel="noopener noreferrer"
          >
            Conhecer a LAMIT
            <span className="sr-only"> (abre em nova aba)</span>
          </Button>
        </div>
      </section>

      <section
        className="home-section page-container"
        aria-labelledby="titulo-destaques"
      >
        <Kicker>Em destaque.</Kicker>
        <h2 id="titulo-destaques">Últimos eventos.</h2>
        <EventCarousel eventos={EVENTOS_EXEMPLO} label="Últimos eventos" />
      </section>

      <section
        id="eventos"
        className="home-section page-container"
        aria-labelledby="titulo-eventos"
      >
        <Kicker>Agenda.</Kicker>
        <h2 id="titulo-eventos">Próximos eventos.</h2>
        <CategoryTabs
          options={FILTROS}
          active={filtro}
          onChange={setFiltro}
          label="Filtrar por categoria"
        />
        {eventos.length > 0 ? (
          <ul className="event-grid">
            {eventos.map((evento) => (
              <li key={evento.id}>
                <EventCard evento={evento} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="home-note" role="status">
            Nenhum evento de {filtro} por enquanto. Volte em breve.
          </p>
        )}
      </section>

      <BroadcastBand>
        <Kicker>Não espere, construa.</Kicker>
        <h2>A agenda da inovação, num só lugar.</h2>
        <p className="home-band__text">
          Hackathons, ideathons, maratonas, editais e eventos de inovação.
        </p>
      </BroadcastBand>
    </main>
  );
}
