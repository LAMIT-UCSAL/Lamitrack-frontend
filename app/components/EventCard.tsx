import { useEffect, useRef, type PointerEvent } from "react";
import { Link } from "react-router";

import {
  categoriaDoEvento,
  formatarCidade,
  rotuloDaData,
  type Evento,
} from "~/lib/evento";
import { prefersReducedMotion } from "~/lib/media";

import "./EventCard.scss";

export type EventCardProps = {
  evento: Evento;
};

// Inclinação máxima do tilt, em graus (mesmo valor da loja)
const MAX_TILT = 6;

// Card "ficha de transmissão": meta em ouro (categoria · data), título, o local
// (venue) e um rodapé com a cidade/UF em cobalto, sem repetir a cidade. Recebe o evento como a API devolve; o card
// inteiro é clicável pelo link do título, que leva ao detalhe (/eventos/:id).
export function EventCard({ evento }: EventCardProps) {
  const categoria = categoriaDoEvento(evento);
  const data = rotuloDaData(evento);
  const cidade = formatarCidade(evento);
  const cardRef = useRef<HTMLElement>(null);
  const frameRef = useRef(0);

  // Não deixa um quadro do tilt pendente depois que o card sai da tela
  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  // Tilt sutil só com mouse e sem reduced-motion (versão React do TiltedCard do site)
  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const card = cardRef.current;
    if (!card || event.pointerType !== "mouse" || prefersReducedMotion()) {
      return;
    }
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      card.classList.add("is-tilting");
      card.style.setProperty("--tilt-x", `${(-y * MAX_TILT).toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${(x * MAX_TILT).toFixed(2)}deg`);
    });
  }

  function handlePointerLeave() {
    const card = cardRef.current;
    if (!card) return;
    cancelAnimationFrame(frameRef.current);
    card.classList.remove("is-tilting");
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <article
      ref={cardRef}
      className="event-card"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="event-card__media">
        {evento.bannerUrl ? (
          // Decorativa: o título ao lado já diz do que se trata
          <img
            className="event-card__image"
            src={evento.bannerUrl}
            alt=""
            loading="lazy"
          />
        ) : (
          <span className="event-card__placeholder" aria-hidden="true">
            LAMIT
          </span>
        )}
      </div>
      <div className="event-card__info">
        <p className="event-card__meta">
          {categoria && (
            <>
              <span>{categoria}</span>
              <span aria-hidden="true"> · </span>
            </>
          )}
          <time dateTime={evento.startsAt}>{data}</time>
        </p>
        <h3 className="event-card__title">
          <Link className="event-card__link" to={`/eventos/${evento.id}`}>
            {evento.title}
          </Link>
        </h3>
        {evento.venue && <p className="event-card__location">{evento.venue}</p>}
        <div className="event-card__footer">
          {cidade && <span className="event-card__city">{cidade}</span>}
          <span className="event-card__cta" aria-hidden="true">
            Ver evento →
          </span>
        </div>
      </div>
    </article>
  );
}
