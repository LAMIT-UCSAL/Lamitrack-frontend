import { Link } from "react-router";

import { BroadcastBand } from "~/components/BroadcastBand";
import { Button } from "~/components/Button";
import { EventCard } from "~/components/EventCard";
import { EventCarousel } from "~/components/EventCarousel";
import { Globe } from "~/components/Globe";
import { Kicker } from "~/components/Kicker";
import { Marquee } from "~/components/Marquee";
import { Note } from "~/components/Note";
import { listarEventos, usandoApiSimulada } from "~/lib/api.server";
import { CATEGORIAS } from "~/lib/categorias";
import { SITE_LAMIT } from "~/lib/ecossistema";
import { urlDosFiltros } from "~/lib/filtros-eventos";

import type { Route } from "./+types/home";
import "./home.scss";

export const meta: Route.MetaFunction = () => [
  { title: "LamiTrack" },
  {
    name: "description",
    content: "Vitrine de eventos de tecnologia e inovação da LAMIT.",
  },
];

// Próximos eventos e o total por categoria, da API (real ou simulada)
export async function loader() {
  const [proximos, ...porCategoria] = await Promise.all([
    listarEventos({ size: 6, sort: "startsAt,asc" }),
    ...CATEGORIAS.map((tag) => listarEventos({ tag, size: 1 })),
  ]);
  return {
    eventos: proximos.content,
    numeros: CATEGORIAS.map((categoria, i) => ({
      categoria,
      total: porCategoria[i].totalElements,
    })),
    simulada: usandoApiSimulada(),
  };
}

// Página provisória: vitrine dos estilos da LAMIT até a tela Home real (#20).
export default function Home({ loaderData }: Route.ComponentProps) {
  const { eventos, numeros, simulada } = loaderData;

  return (
    <main id="conteudo">
      {simulada && (
        <div className="page-container home-aviso">
          <Note>
            <p>
              <strong>Dados de exemplo.</strong> A API do LamiTrack ainda não
              está no ar; os eventos e os números são fictícios.
            </p>
          </Note>
        </div>
      )}

      <section className="home-intro page-container">
        <div className="home-intro__text">
          <Kicker>Vitrine de eventos.</Kicker>
          <h1>LamiTrack</h1>
          <p className="home-intro__lede">
            Eventos de tecnologia e inovação reunidos pela LAMIT. Esta é uma
            página provisória com a prévia dos estilos.
          </p>
          <div className="home-intro__actions">
            <Button href="/eventos">Ver eventos</Button>
            <Button
              variant="secondary"
              href={SITE_LAMIT}
              target="_blank"
              rel="noopener noreferrer"
            >
              Conhecer a LAMIT
              <span className="sr-only"> (abre em nova aba)</span>
            </Button>
          </div>
        </div>
        <Globe />
      </section>

      <div className="page-container home-numbers">
        <Marquee
          items={numeros}
          getKey={(numero) => numero.categoria}
          label="Eventos por categoria"
          dividers={false}
          compact
          baseline
          renderItem={(numero) => (
            <Link
              className="home-numbers__item"
              to={urlDosFiltros({ categoria: numero.categoria })}
            >
              <span className="home-numbers__value">{numero.total}</span>
              <span className="home-numbers__label">{numero.categoria}</span>
            </Link>
          )}
        />
      </div>

      <section
        className="home-section page-container"
        aria-labelledby="titulo-destaques"
      >
        <Kicker>Em destaque.</Kicker>
        <h2 id="titulo-destaques">Últimos eventos.</h2>
        <EventCarousel eventos={eventos.slice(0, 3)} label="Últimos eventos" />
      </section>

      <section
        id="eventos"
        className="home-section page-container"
        aria-labelledby="titulo-eventos"
      >
        <Kicker>Agenda.</Kicker>
        <h2 id="titulo-eventos">Próximos eventos.</h2>
        {eventos.length > 0 ? (
          <ul className="event-grid">
            {eventos.map((evento) => (
              <li key={evento.id}>
                <EventCard evento={evento} />
              </li>
            ))}
          </ul>
        ) : (
          <Note role="status">Nenhum evento por enquanto. Volte em breve.</Note>
        )}
        <Link className="home-section__more" to="/eventos">
          Ver todos os eventos <span aria-hidden="true">→</span>
        </Link>
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
