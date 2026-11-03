import { useEffect, useState, type FocusEvent } from "react";
import { Link } from "react-router";

import { categoriaDoEvento, formatarData, type Evento } from "~/lib/evento";
import { usePrefersReducedMotion } from "~/lib/media";

import "./EventCarousel.scss";

// Mesmo intervalo do carrossel do protótipo EVE
export const INTERVALO_MS = 4000;

type EventCarouselProps = {
  eventos: Evento[];
  // Nome da região para leitor de tela (ex.: "Últimos eventos")
  label: string;
};

// Carrossel de eventos no padrão do WAI-ARIA: avança a cada 4 s, para com o
// mouse ou o foco dentro dele e não se move sozinho com reduced-motion. Sem
// botão de pausa, por decisão do time. Só o slide visível recebe foco.
export function EventCarousel({ eventos, label }: EventCarouselProps) {
  const total = eventos.length;
  const [atual, setAtual] = useState(0);
  const [hover, setHover] = useState(false);
  const [foco, setFoco] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const autoAvanco = total > 1 && !reducedMotion;
  const girando = autoAvanco && !hover && !foco;

  useEffect(() => {
    if (!girando) return;
    const id = window.setInterval(
      () => setAtual((indice) => (indice + 1) % total),
      INTERVALO_MS,
    );
    return () => window.clearInterval(id);
  }, [girando, total]);

  if (total === 0) return null;

  // Se a lista encolher, o índice continua válido
  const indice = atual % total;
  const irPara = (proximo: number) => setAtual((proximo + total) % total);

  // O foco andando entre os controles não conta como saída do carrossel
  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setFoco(false);
    }
  };

  return (
    <section
      className="event-carousel"
      aria-roledescription="carrossel"
      aria-label={label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFoco(true)}
      onBlur={handleBlur}
    >
      {total > 1 && (
        <div className="event-carousel__controls">
          <button
            type="button"
            className="event-carousel__button"
            aria-label="Evento anterior"
            onClick={() => irPara(indice - 1)}
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            type="button"
            className="event-carousel__button"
            aria-label="Próximo evento"
            onClick={() => irPara(indice + 1)}
          >
            <span aria-hidden="true">›</span>
          </button>
          <div className="event-carousel__dots">
            {eventos.map((evento, i) => (
              <button
                key={evento.id}
                type="button"
                className="event-carousel__dot"
                aria-label={`Ir para o evento ${i + 1}: ${evento.title}`}
                aria-current={i === indice ? "true" : undefined}
                onClick={() => irPara(i)}
              />
            ))}
          </div>
        </div>
      )}

      <div
        className="event-carousel__track"
        aria-live={girando ? "off" : "polite"}
        style={{ transform: `translateX(-${indice * 100}%)` }}
      >
        {eventos.map((evento, i) => {
          const categoria = categoriaDoEvento(evento);
          return (
            <div
              key={evento.id}
              className="event-carousel__slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} de ${total}`}
              inert={i !== indice}
            >
              {evento.bannerUrl && (
                // Decorativa: o título do slide já descreve o evento
                <img
                  className="event-carousel__image"
                  src={evento.bannerUrl}
                  alt=""
                  loading={i === 0 ? "eager" : "lazy"}
                />
              )}
              <div className="event-carousel__info">
                <p className="event-carousel__meta">
                  {categoria && (
                    <>
                      <span>{categoria}</span>
                      <span aria-hidden="true"> · </span>
                    </>
                  )}
                  <time dateTime={evento.startsAt}>
                    {formatarData(evento.startsAt)}
                  </time>
                </p>
                <h3 className="event-carousel__title">
                  <Link
                    className="event-carousel__link"
                    to={`/eventos/${evento.id}`}
                  >
                    {evento.title}
                  </Link>
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
