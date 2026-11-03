import { Form, Link, useNavigate, useNavigation } from "react-router";

import { Button } from "~/components/Button";
import { CategoryTabs } from "~/components/CategoryTabs";
import { EventCard } from "~/components/EventCard";
import { Kicker } from "~/components/Kicker";
import { Note } from "~/components/Note";
import { listarEventos, usandoApiSimulada } from "~/lib/api.server";
import { CATEGORIAS, type Categoria } from "~/lib/categorias";
import { lerFiltros, paraApi, urlDosFiltros } from "~/lib/filtros-eventos";

import type { Route } from "./+types/eventos";
import "./eventos.scss";

export const meta: Route.MetaFunction = () => [
  { title: "Eventos · LamiTrack" },
  {
    name: "description",
    content:
      "Hackathons, ideathons, maratonas, editais e eventos de inovação na Bahia e online.",
  },
];

// Os filtros vêm da URL e os eventos, do servidor (SSR)
export async function loader({ request }: Route.LoaderArgs) {
  const filtros = lerFiltros(new URL(request.url).searchParams);
  const eventos = await listarEventos(paraApi(filtros));
  return { filtros, eventos, simulada: usandoApiSimulada() };
}

const TODOS = "Todos";

function textoDoTotal(total: number): string {
  return total === 1 ? "1 evento" : `${total} eventos`;
}

export default function Eventos({ loaderData }: Route.ComponentProps) {
  const { filtros, eventos, simulada } = loaderData;
  const navigate = useNavigate();
  const carregando = useNavigation().state === "loading";
  const temFiltro = Boolean(
    filtros.categoria || filtros.cidade || filtros.data,
  );
  const pagina = eventos.number + 1;

  // Trocar a categoria mantém cidade e data e volta para a página 1
  const trocarCategoria = (opcao: string) => {
    const categoria = opcao === TODOS ? "" : (opcao as Categoria);
    navigate(urlDosFiltros({ ...filtros, categoria, pagina: 1 }));
  };

  return (
    <main id="conteudo" className="eventos page-container">
      <header className="eventos__head">
        <Kicker>Agenda.</Kicker>
        <h1>Eventos.</h1>
        <p className="eventos__lede">
          Hackathons, ideathons, maratonas, editais e eventos de inovação na
          Bahia e online.
        </p>
      </header>

      {simulada && (
        <Note>
          <p>
            <strong>Dados de exemplo.</strong> A API do LamiTrack ainda não está
            no ar; estes eventos são fictícios.
          </p>
        </Note>
      )}

      <section className="eventos__filtros" aria-label="Filtros">
        <CategoryTabs
          options={[TODOS, ...CATEGORIAS]}
          active={filtros.categoria || TODOS}
          onChange={trocarCategoria}
          label="Filtrar por categoria"
        />
        <Form method="get" action="/eventos" className="eventos__form">
          {filtros.categoria && (
            <input type="hidden" name="categoria" value={filtros.categoria} />
          )}
          <div className="campo">
            <label className="campo__rotulo" htmlFor="filtro-cidade">
              Cidade
            </label>
            <input
              // A key recria o campo quando o filtro muda (ex.: "Limpar filtros")
              key={filtros.cidade}
              id="filtro-cidade"
              className="campo__entrada"
              type="text"
              name="cidade"
              defaultValue={filtros.cidade}
              placeholder="Ex.: Salvador"
              autoComplete="address-level2"
            />
          </div>
          <div className="campo">
            <label className="campo__rotulo" htmlFor="filtro-data">
              Data
            </label>
            <input
              key={filtros.data}
              id="filtro-data"
              className="campo__entrada"
              type="date"
              name="data"
              defaultValue={filtros.data}
            />
          </div>
          <div className="eventos__acoes">
            <Button type="submit" variant="secondary">
              Filtrar
            </Button>
            {temFiltro && (
              <Link className="eventos__limpar" to="/eventos">
                Limpar filtros
              </Link>
            )}
          </div>
        </Form>
      </section>

      <section
        className="eventos__resultados"
        aria-labelledby="titulo-resultados"
        aria-busy={carregando}
      >
        <h2
          id="titulo-resultados"
          className="eventos__total"
          aria-live="polite"
        >
          {textoDoTotal(eventos.totalElements)}
        </h2>

        {eventos.empty ? (
          <Note role="status">
            <p>Nenhum evento encontrado com esses filtros.</p>
            {temFiltro && (
              <p>
                <Link to="/eventos">Limpar filtros e ver todos</Link>
              </p>
            )}
          </Note>
        ) : (
          <ul className="event-grid">
            {eventos.content.map((evento) => (
              <li key={evento.id}>
                <EventCard evento={evento} />
              </li>
            ))}
          </ul>
        )}

        {eventos.totalPages > 1 && (
          <nav className="eventos__paginacao" aria-label="Paginação">
            {!eventos.first ? (
              <Link to={urlDosFiltros({ ...filtros, pagina: pagina - 1 })}>
                <span aria-hidden="true">←</span> Anterior
              </Link>
            ) : (
              <span />
            )}
            <span aria-current="page">
              Página {pagina} de {eventos.totalPages}
            </span>
            {!eventos.last ? (
              <Link to={urlDosFiltros({ ...filtros, pagina: pagina + 1 })}>
                Próxima <span aria-hidden="true">→</span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </section>
    </main>
  );
}
