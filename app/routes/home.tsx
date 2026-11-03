import { useState } from "react";

import { BroadcastBand } from "~/components/BroadcastBand";
import { Button } from "~/components/Button";
import { CategoryTabs } from "~/components/CategoryTabs";
import { EventCard, type EventCardProps } from "~/components/EventCard";
import { Kicker } from "~/components/Kicker";
import { CATEGORIAS } from "~/lib/categorias";

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

// Evento fictício, só para mostrar o card. Os dados reais chegam com a #4/#20.
const EVENTO_EXEMPLO: EventCardProps = {
  title: "Hackathon de exemplo",
  category: "Hackathon",
  date: "14 nov",
  dateTime: "2026-11-14",
  location: "Salvador, BA",
  href: "#eventos",
};

// Página provisória: vitrine dos estilos da LAMIT até a tela Home real (#20).
export default function Home() {
  const [filtro, setFiltro] = useState<string>("Todos");
  const eventos = [EVENTO_EXEMPLO].filter(
    (evento) => filtro === "Todos" || evento.category === filtro,
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
            href="https://ligalamit.com.br"
            target="_blank"
            rel="noopener noreferrer"
          >
            Conhecer a LAMIT
            <span className="sr-only"> (abre em nova aba)</span>
          </Button>
        </div>
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
              <li key={evento.title}>
                <EventCard {...evento} />
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
