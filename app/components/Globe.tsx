import { useEffect, useRef, type PointerEvent } from "react";
import type { Globe as CobeGlobe, Marker } from "cobe";

import { corDoToken } from "~/lib/cores";
import { usePrefersReducedMotion } from "~/lib/media";

import "./Globe.scss";

// Salvador, sede da LAMIT (mesmo marcador do protótipo EVE)
export const MARCADORES_PADRAO: Marker[] = [
  { location: [-12.9718, -38.5017], size: 0.09 },
];

// Inclinação do globo (EVE)
const THETA = 0.28;

type GlobeProps = {
  // Passe um array estável (constante ou useMemo): trocar o array recria o globo
  markers?: Marker[];
  // Radianos por quadro (EVE: 0,0035)
  speed?: number;
  label?: string;
  // Legenda do marcador, embaixo do globo
  legend?: string;
};

type Rotacao = {
  phi: number;
  phiOffset: number;
  thetaOffset: number;
  dragPhi: number;
  dragTheta: number;
  inicio: { x: number; y: number } | null;
};

// Globo 3D do hero (porte do globo-eve, lib cobe): gira sozinho, é arrastável,
// não gira com reduced-motion e fica oculto no celular (sem criar o WebGL).
// O cobe só é carregado no cliente.
export function Globe({
  markers = MARCADORES_PADRAO,
  speed = 0.0035,
  label = "Globo terrestre com Salvador marcado",
  legend = "Salvador, BA",
}: GlobeProps) {
  // O cobe envolve o canvas numa div própria: o "pronto" fica no contêiner
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const rotacao = useRef<Rotacao>({
    phi: 0,
    phiOffset: 0,
    thetaOffset: 0,
    dragPhi: 0,
    dragTheta: 0,
    inicio: null,
  });
  // Lida a cada quadro, sem recriar o globo
  const velocidade = useRef(0);

  useEffect(() => {
    velocidade.current = reducedMotion ? 0 : speed;
  }, [reducedMotion, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let globo: CobeGlobe | null = null;
    let frame = 0;
    let cancelado = false;
    // O import do cobe é assíncrono: evita criar dois globos se o
    // ResizeObserver disparar enquanto ele carrega
    let iniciando = false;

    const iniciar = async () => {
      const largura = canvas.offsetWidth;
      if (globo || iniciando || largura === 0) return;
      const base = corDoToken("--color-paper");
      const marcador = corDoToken("--color-cobalt");
      const brilho = corDoToken("--color-paper-2");
      if (!base || !marcador || !brilho) return;

      iniciando = true;
      try {
        const { default: createGlobe } = await import("cobe");
        if (cancelado) return;
        globo = createGlobe(canvas, {
          devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
          width: largura,
          height: largura,
          phi: 0,
          theta: THETA,
          dark: 0,
          diffuse: 1.4,
          mapSamples: 14000,
          mapBrightness: 8,
          baseColor: base,
          markerColor: marcador,
          glowColor: brilho,
          markerElevation: 0.02,
          markers,
          opacity: 0.9,
        });
      } catch (error) {
        // Sem WebGL o espaço fica vazio, sem derrubar a página
        console.warn("Globo: WebGL indisponível.", error);
        return;
      } finally {
        iniciando = false;
      }
      if (cancelado) return;

      const animar = () => {
        const r = rotacao.current;
        if (!r.inicio) r.phi += velocidade.current;
        globo?.update({
          phi: r.phi + r.phiOffset + r.dragPhi,
          theta: THETA + r.thetaOffset + r.dragTheta,
        });
        frame = requestAnimationFrame(animar);
      };
      animar();
      rootRef.current?.classList.add("is-ready");
    };

    // Oculto (celular) tem largura 0: só inicia quando aparecer; depois,
    // acompanha a largura
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            const largura = canvas.offsetWidth;
            if (!globo) void iniciar();
            else if (largura > 0)
              globo.update({ width: largura, height: largura });
          });
    observer?.observe(canvas);
    void iniciar();

    return () => {
      cancelado = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      globo?.destroy();
      rootRef.current?.classList.remove("is-ready");
    };
  }, [markers]);

  // Arrastar: Δx/300 e Δy/1000 (EVE); ao soltar, a rotação fica onde parou
  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    rotacao.current.inicio = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    const r = rotacao.current;
    if (!r.inicio) return;
    r.dragPhi = (event.clientX - r.inicio.x) / 300;
    r.dragTheta = (event.clientY - r.inicio.y) / 1000;
  };

  const handlePointerUp = () => {
    const r = rotacao.current;
    if (!r.inicio) return;
    r.phiOffset += r.dragPhi;
    r.thetaOffset += r.dragTheta;
    r.dragPhi = 0;
    r.dragTheta = 0;
    r.inicio = null;
  };

  return (
    <div ref={rootRef} className="globe">
      <canvas
        ref={canvasRef}
        className="globe__canvas"
        role="img"
        aria-label={label}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
      {/* O nome acessível do canvas já diz o lugar: a legenda é só visual */}
      {legend && (
        <p className="globe__legend" aria-hidden="true">
          {legend}
        </p>
      )}
    </div>
  );
}
