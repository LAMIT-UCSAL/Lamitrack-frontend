import { useEffect, useRef, type PointerEvent } from "react";

import type { Categoria } from "~/lib/categorias";
import { prefersReducedMotion } from "~/lib/media";

import "./EventCard.scss";

export type EventCardProps = {
  title: string;
  category: Categoria;
  // Data já formatada para leitura ("14 nov") e a mesma data em ISO para o <time>
  date: string;
  dateTime: string;
  location: string;
  href: string;
  // Sem preço informado, o evento é gratuito
  price?: string;
  imageSrc?: string;
  imageAlt?: string;
};

// Inclinação máxima do tilt, em graus (mesmo valor da loja)
const MAX_TILT = 6;

// Card "ficha de transmissão": meta em ouro, título, local e um rodapé com o
// dado principal em cobalto. O card inteiro é clicável pelo link do título.
export function EventCard({
  title,
  category,
  date,
  dateTime,
  location,
  href,
  price,
  imageSrc,
  imageAlt = "",
}: EventCardProps) {
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
        {imageSrc ? (
          <img
            className="event-card__image"
            src={imageSrc}
            alt={imageAlt}
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
          <span>{category}</span>
          <span aria-hidden="true"> · </span>
          <time dateTime={dateTime}>{date}</time>
        </p>
        <h3 className="event-card__title">
          <a className="event-card__link" href={href}>
            {title}
          </a>
        </h3>
        <p className="event-card__location">{location}</p>
        <div className="event-card__footer">
          {price ? (
            <span className="event-card__price">{price}</span>
          ) : (
            <span className="event-card__free">Gratuito</span>
          )}
          <span className="event-card__cta" aria-hidden="true">
            Ver evento →
          </span>
        </div>
      </div>
    </article>
  );
}
