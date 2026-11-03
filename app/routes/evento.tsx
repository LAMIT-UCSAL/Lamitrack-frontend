import { data, Link } from "react-router";

import { Button } from "~/components/Button";
import { Kicker } from "~/components/Kicker";
import { Note } from "~/components/Note";
import { buscarEvento, usandoApiSimulada } from "~/lib/api.server";
import {
  categoriaDoEvento,
  formatarCidade,
  formatarDataCompleta,
  linkDoMapa,
  nomeDaFonte,
  rotuloDaData,
  type Evento,
} from "~/lib/evento";

import type { Route } from "./+types/evento";
import "./evento.scss";

export async function loader({ params }: Route.LoaderArgs) {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    throw data("Evento não encontrado", { status: 404 });
  }
  const evento = await buscarEvento(id);
  if (!evento) throw data("Evento não encontrado", { status: 404 });
  return { evento, simulada: usandoApiSimulada() };
}

// Resumo para buscadores e para a prévia do link (WhatsApp, redes):
// "Hackathon · 14 nov · Salvador/BA. Começo da descrição…"
export function resumoDoEvento(evento: Evento): string {
  const partes = [
    categoriaDoEvento(evento) ?? "Evento",
    rotuloDaData(evento),
    formatarCidade(evento) ?? evento.venue,
  ].filter(Boolean);
  const cabeca = partes.join(" · ");
  const texto = evento.description?.replace(/\s+/g, " ").trim();
  if (!texto) return `${cabeca}.`;
  const resumo = `${cabeca}. ${texto}`;
  return resumo.length > 160 ? `${resumo.slice(0, 157).trimEnd()}…` : resumo;
}

// Vai no HTML do servidor: é o que o WhatsApp lê para montar a prévia
export const meta: Route.MetaFunction = ({ loaderData }) => {
  if (!loaderData) return [{ title: "Evento não encontrado · LamiTrack" }];
  const { evento } = loaderData;
  const descricao = resumoDoEvento(evento);
  const tags = [
    { title: `${evento.title} · LamiTrack` },
    { name: "description", content: descricao },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "LamiTrack" },
    { property: "og:title", content: evento.title },
    { property: "og:description", content: descricao },
  ];
  if (evento.bannerUrl) {
    tags.push({ property: "og:image", content: evento.bannerUrl });
  }
  return tags;
};

export default function EventoDetalhe({ loaderData }: Route.ComponentProps) {
  const { evento, simulada } = loaderData;
  const categoria = categoriaDoEvento(evento);
  const edital = categoria === "Edital";
  const cidade = formatarCidade(evento);
  const mapa = linkDoMapa(evento);
  const temas = evento.tags.filter((tag) => tag !== categoria);
  const paragrafos = (evento.description ?? "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <main id="conteudo" className="evento page-container">
      <Link className="evento__voltar" to="/eventos">
        <span aria-hidden="true">←</span> Voltar aos eventos
      </Link>

      {simulada && (
        <Note>
          <p>
            <strong>Dados de exemplo.</strong> A API do LamiTrack ainda não está
            no ar; este evento é fictício.
          </p>
        </Note>
      )}

      <div className="evento__grade">
        <header className="evento__cabeca">
          <div className="evento__midia">
            {evento.bannerUrl && (
              // Decorativa: o título logo abaixo já descreve o evento
              <img src={evento.bannerUrl} alt="" />
            )}
          </div>
          <Kicker>{categoria ?? "Evento"}.</Kicker>
          <h1>{evento.title}</h1>
        </header>

        <aside className="evento__ficha" aria-label="Informações e inscrição">
          <dl className="evento__dados">
            <div>
              <dt>{edital ? "Inscrições até" : "Data"}</dt>
              <dd>
                <time dateTime={evento.startsAt}>
                  {formatarDataCompleta(evento.startsAt)}
                </time>
              </dd>
            </div>
            {(evento.venue || cidade) && (
              <div>
                <dt>Local</dt>
                <dd>
                  {evento.venue && <span>{evento.venue}</span>}
                  {cidade && <span>{cidade}</span>}
                  {mapa && (
                    <a href={mapa} target="_blank" rel="noopener noreferrer">
                      Ver no mapa <span aria-hidden="true">↗</span>
                      <span className="sr-only"> (abre em nova aba)</span>
                    </a>
                  )}
                </dd>
              </div>
            )}
            <div>
              <dt>Fonte</dt>
              <dd>{nomeDaFonte(evento.source)}</dd>
            </div>
          </dl>

          {evento.registrationUrl ? (
            <>
              <Button
                className="evento__cta"
                href={evento.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                arrow={false}
              >
                {edital ? "Ver o edital" : "Fazer inscrição"}
                <span aria-hidden="true">↗</span>
                <span className="sr-only">
                  {" "}
                  (abre o site original em nova aba)
                </span>
              </Button>
              <p className="evento__externo">
                {edital
                  ? "O edital e a inscrição ficam no site de quem publicou."
                  : "A inscrição é feita no site do organizador."}
              </p>
            </>
          ) : (
            <Note>
              <p>O link de inscrição ainda não está disponível.</p>
            </Note>
          )}
        </aside>

        <div className="evento__corpo">
          <section aria-labelledby="titulo-sobre">
            <h2 id="titulo-sobre">Sobre o evento.</h2>
            {paragrafos.length > 0 ? (
              paragrafos.map((paragrafo, i) => (
                <p key={i} className="evento__descricao">
                  {paragrafo}
                </p>
              ))
            ) : (
              <p className="evento__descricao">
                Quem publicou o evento ainda não incluiu uma descrição.
              </p>
            )}
          </section>

          {temas.length > 0 && (
            <section aria-labelledby="titulo-temas">
              <h2 id="titulo-temas">Temas.</h2>
              <ul className="evento__temas">
                {temas.map((tema) => (
                  <li key={tema}>{tema}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
