import { Link, useNavigate } from "react-router";

import { BroadcastBand } from "~/components/BroadcastBand";
import { Button } from "~/components/Button";
import { CategoryTabs } from "~/components/CategoryTabs";
import { EventCard } from "~/components/EventCard";
import { EventCarousel } from "~/components/EventCarousel";
import { Globe } from "~/components/Globe";
import { Kicker } from "~/components/Kicker";
import { Marquee } from "~/components/Marquee";
import { Note } from "~/components/Note";
import { PartnerStrip } from "~/components/PartnerStrip";
import { listarEventos, usandoApiSimulada } from "~/lib/api.server";
import { CATEGORIAS, type Categoria } from "~/lib/categorias";
import { SITE_LAMIT } from "~/lib/ecossistema";
import { lerFiltros, urlDosFiltros } from "~/lib/filtros-eventos";
import { FORMULARIO_PARCERIA, PARCEIROS } from "~/lib/parceiros";

import type { Route } from "./+types/home";
import "./home.scss";

export const meta: Route.MetaFunction = () => [
  { title: "LamiTrack · Agenda de inovação da LAMIT" },
  {
    name: "description",
    content:
      "Hackathons, ideathons, maratonas, editais e eventos de inovação na Bahia e online, reunidos pela LAMIT.",
  },
  { property: "og:type", content: "website" },
  { property: "og:site_name", content: "LamiTrack" },
  { property: "og:title", content: "LamiTrack · Agenda de inovação da LAMIT" },
  {
    property: "og:description",
    content:
      "Hackathons, ideathons, maratonas, editais e eventos de inovação na Bahia e online.",
  },
];

const PROXIMOS = 6;
const TODOS = "Todos";

// Tudo da API (real ou simulada), nada escrito à mão: os destaques, os
// próximos da categoria escolhida (?categoria=…) e os números da faixa
export async function loader({ request }: Route.LoaderArgs) {
  const { categoria } = lerFiltros(new URL(request.url).searchParams);
  const [destaques, proximos, total, ...porCategoria] = await Promise.all([
    listarEventos({ size: 3, sort: "startsAt,asc" }),
    listarEventos({
      tag: categoria || undefined,
      size: PROXIMOS,
      sort: "startsAt,asc",
    }),
    listarEventos({ size: 1 }),
    ...CATEGORIAS.map((tag) => listarEventos({ tag, size: 1 })),
  ]);
  return {
    categoria,
    destaques: destaques.content,
    proximos: proximos.content,
    numeros: [
      {
        rotulo: "eventos na agenda",
        total: total.totalElements,
        url: "/eventos",
      },
      ...CATEGORIAS.map((c, i) => ({
        rotulo: c,
        total: porCategoria[i].totalElements,
        url: urlDosFiltros({ categoria: c }),
      })),
    ],
    simulada: usandoApiSimulada(),
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { categoria, destaques, proximos, numeros, simulada } = loaderData;
  const navigate = useNavigate();

  // A categoria fica na URL (dá para compartilhar) sem rolar a página ao topo
  const trocarCategoria = (opcao: string) => {
    const escolhida = opcao === TODOS ? "" : (opcao as Categoria);
    navigate(escolhida ? `/?categoria=${encodeURIComponent(escolhida)}` : "/", {
      preventScrollReset: true,
    });
  };

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

      <section className="home-intro page-container" aria-labelledby="titulo">
        <div className="home-intro__text">
          <Kicker>LamiTrack.</Kicker>
          <h1 id="titulo">A agenda da inovação na Bahia.</h1>
          <p className="home-intro__lede">
            Hackathons, ideathons, maratonas, editais e eventos de inovação, na
            Bahia e online, reunidos pela LAMIT.
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
          getKey={(numero) => numero.rotulo}
          label="A agenda em números"
          dividers={false}
          compact
          baseline
          renderItem={(numero) => (
            <Link className="home-numbers__item" to={numero.url}>
              <span className="home-numbers__value">{numero.total}</span>
              <span className="home-numbers__label">{numero.rotulo}</span>
            </Link>
          )}
        />
      </div>

      {destaques.length > 0 && (
        <section
          className="home-section page-container"
          aria-labelledby="titulo-destaques"
        >
          <Kicker>Em destaque.</Kicker>
          <h2 id="titulo-destaques">Os próximos da agenda.</h2>
          <EventCarousel eventos={destaques} label="Próximos da agenda" />
        </section>
      )}

      <section
        id="eventos"
        className="home-section page-container"
        aria-labelledby="titulo-eventos"
      >
        <Kicker>Agenda.</Kicker>
        <h2 id="titulo-eventos">Próximos eventos.</h2>
        <CategoryTabs
          options={[TODOS, ...CATEGORIAS]}
          active={categoria || TODOS}
          onChange={trocarCategoria}
          label="Filtrar por categoria"
        />
        {proximos.length > 0 ? (
          <ul className="event-grid">
            {proximos.map((evento) => (
              <li key={evento.id}>
                <EventCard evento={evento} />
              </li>
            ))}
          </ul>
        ) : (
          <Note role="status">
            <p>
              {categoria
                ? `Nenhum evento de ${categoria} por enquanto. Volte em breve.`
                : "Nenhum evento por enquanto. Volte em breve."}
            </p>
          </Note>
        )}
        <Link className="home-section__more" to={urlDosFiltros({ categoria })}>
          {categoria ? `Ver todos de ${categoria}` : "Ver todos os eventos"}{" "}
          <span aria-hidden="true">→</span>
        </Link>
      </section>

      <PartnerStrip parceiros={PARCEIROS} formulario={FORMULARIO_PARCERIA} />

      <BroadcastBand>
        <Kicker>Feito pela LAMIT.</Kicker>
        <h2>Não espere, construa.</h2>
        <p className="home-band__text">
          A LAMIT reúne estudantes e comunidade em torno de inovação, tecnologia
          e empreendedorismo.
        </p>
      </BroadcastBand>
    </main>
  );
}
