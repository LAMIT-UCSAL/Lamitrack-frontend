import { useEffect, useRef, useState, type ReactNode } from "react";

import { usePrefersReducedMotion } from "~/lib/media";

import "./Marquee.scss";

type MarqueeProps<T> = {
  items: T[];
  renderItem: (item: T) => ReactNode;
  getKey: (item: T) => string | number;
  // Nome da faixa para leitor de tela (ex.: "Parceiros da LAMIT")
  label: string;
  // Velocidade em px/s, normal e com o mouse em cima (padrões do EVE)
  speed?: number;
  hoverSpeed?: number;
  // Filetes em cima e embaixo
  dividers?: boolean;
  // Blur e espaçamento menores, para faixas estreitas
  compact?: boolean;
  // Alinha os itens pela linha de base (número grande + rótulo)
  baseline?: boolean;
};

type Estado = { posicao: number; velocidade: number };

// Um quadro da animação: a velocidade se aproxima do alvo aos poucos (sem
// trancos ao entrar/sair com o mouse) e a posição volta um período inteiro ao
// passar dele, o que mantém o loop sem emenda.
export function passoDoMarquee(
  { posicao, velocidade }: Estado,
  alvo: number,
  deltaSegundos: number,
  periodo: number,
): Estado {
  const delta = Math.min(deltaSegundos, 0.1);
  const novaVelocidade =
    velocidade + (alvo - velocidade) * Math.min(1, delta * 4);
  let novaPosicao = posicao - novaVelocidade * delta;
  if (periodo > 0 && Math.abs(novaPosicao) >= periodo) {
    novaPosicao += periodo;
  }
  return { posicao: novaPosicao, velocidade: novaVelocidade };
}

// Faixa deslizante genérica (porte do marquee do EVE): desacelera no hover sem
// parar, para com o foco dentro ou pelo botão de pausa (WCAG 2.2.2) e, com
// reduced-motion, vira uma faixa parada com rolagem horizontal.
export function Marquee<T>({
  items,
  renderItem,
  getKey,
  label,
  speed = 40,
  hoverSpeed = 14,
  dividers = true,
  compact = false,
  baseline = false,
}: MarqueeProps<T>) {
  const reducedMotion = usePrefersReducedMotion();
  const [pausado, setPausado] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  // Lidos a cada quadro sem reiniciar a animação
  const controle = useRef({ hover: false, foco: false, pausado: false });
  const velocidades = useRef({ speed, hoverSpeed });

  useEffect(() => {
    controle.current.pausado = pausado;
  }, [pausado]);

  useEffect(() => {
    velocidades.current = { speed, hoverSpeed };
  }, [speed, hoverSpeed]);

  const total = items.length;

  useEffect(() => {
    const track = trackRef.current;
    if (!track || reducedMotion || total === 0) return;

    // Distância real entre o primeiro item e a sua cópia: com gap e larguras
    // variáveis, scrollWidth / 2 erraria por meio gap
    let periodo = 0;
    const medir = () => {
      const filhos = track.children;
      if (filhos.length < total * 2) return;
      const inicio = (filhos[0] as HTMLElement).offsetLeft;
      const copia = (filhos[total] as HTMLElement).offsetLeft;
      if (copia - inicio > 0) periodo = copia - inicio;
    };
    medir();
    // Remede quando a largura muda (fonte carregando, janela redimensionada)
    const resizeObserver =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(medir);
    resizeObserver?.observe(track);

    const alvo = () => {
      const { hover, foco, pausado: parado } = controle.current;
      if (parado || foco) return 0;
      return hover ? velocidades.current.hoverSpeed : velocidades.current.speed;
    };

    let estado: Estado = { posicao: 0, velocidade: alvo() };
    let ultimo = 0;
    let frame = 0;
    const animar = (agora: number) => {
      const delta = ultimo ? (agora - ultimo) / 1000 : 0;
      ultimo = agora;
      estado = passoDoMarquee(estado, alvo(), delta, periodo);
      track.style.transform = `translateX(${estado.posicao}px)`;
      frame = requestAnimationFrame(animar);
    };
    frame = requestAnimationFrame(animar);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      track.style.transform = "";
    };
  }, [reducedMotion, total]);

  if (total === 0) return null;

  const classes = [
    "marquee",
    dividers && "marquee--dividers",
    compact && "marquee--compact",
    baseline && "marquee--baseline",
    reducedMotion && "marquee--static",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className={classes}
      aria-label={label}
      onMouseEnter={() => (controle.current.hover = true)}
      onMouseLeave={() => (controle.current.hover = false)}
      onFocus={() => (controle.current.foco = true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          controle.current.foco = false;
        }
      }}
    >
      <div className="marquee__viewport">
        <div ref={trackRef} className="marquee__track">
          {items.map((item) => (
            <div key={getKey(item)} className="marquee__item">
              {renderItem(item)}
            </div>
          ))}
          {/* Cópia só para o loop sem emenda: invisível para leitor de tela e Tab */}
          {!reducedMotion &&
            items.map((item) => (
              <div
                key={`copia-${getKey(item)}`}
                className="marquee__item"
                aria-hidden="true"
                inert
              >
                {renderItem(item)}
              </div>
            ))}
        </div>
      </div>
      {!reducedMotion && (
        <>
          <div className="marquee__blur marquee__blur--left" aria-hidden="true">
            {CAMADAS.map((camada) => (
              <span key={camada} />
            ))}
          </div>
          <div
            className="marquee__blur marquee__blur--right"
            aria-hidden="true"
          >
            {CAMADAS.map((camada) => (
              <span key={camada} />
            ))}
          </div>
          <button
            type="button"
            className="marquee__pause"
            aria-label={`Pausar a faixa "${label}"`}
            aria-pressed={pausado}
            onClick={() => setPausado((valor) => !valor)}
          >
            <span aria-hidden="true">{pausado ? "▶" : "❚❚"}</span>
          </button>
        </>
      )}
    </section>
  );
}

// 6 camadas de blur crescente em cada borda (o desenho fica no SCSS)
const CAMADAS = [0, 1, 2, 3, 4, 5];
