import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { prefersReducedMotion, REDUCED_MOTION } from "~/lib/media";

import { Grainient } from "./Grainient";
import "./BroadcastBand.scss";

type BroadcastBandProps = {
  children?: ReactNode;
  className?: string;
  // "thin": filete de 6px do topo do rodapé, decorativo e sempre estático
  variant?: "default" | "thin";
};

let webgl2: boolean | undefined;

function supportsWebGL2(): boolean {
  if (webgl2 === undefined) {
    try {
      webgl2 =
        typeof WebGL2RenderingContext !== "undefined" &&
        document.createElement("canvas").getContext("webgl2") !== null;
    } catch {
      webgl2 = false;
    }
  }
  return webgl2;
}

function subscribe(onChange: () => void) {
  if (typeof window.matchMedia !== "function") return () => {};
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

// Cores do gradiente lidas dos tokens ("cobalto âmbar"), para não repetir hex
// no componente. String vazia = sem animação, só o fallback em CSS.
function getColors(): string {
  if (prefersReducedMotion() || !supportsWebGL2()) return "";
  const styles = getComputedStyle(document.documentElement);
  const cobalt = styles.getPropertyValue("--color-cobalt").trim();
  const amber = styles.getPropertyValue("--color-amber").trim();
  return cobalt && amber ? `${cobalt} ${amber}` : "";
}

const getServerColors = () => "";

// Faixa Grainient (padrão .broadcast-band da loja). O HTML do servidor já vem
// com o fallback em CSS; no cliente, com WebGL2, sem reduced-motion e quando a
// faixa chega perto da tela, o gradiente animado aparece por cima com um fade.
export function BroadcastBand({
  children,
  className,
  variant = "default",
}: BroadcastBandProps) {
  const colors = useSyncExternalStore(subscribe, getColors, getServerColors);
  const [failed, setFailed] = useState(false);
  const isThin = variant === "thin";
  const [cobalt, amber] = colors.split(" ");
  const bandRef = useRef<HTMLDivElement>(null);
  // O WebGL só liga quando a faixa chega perto da tela: no celular, a faixa do
  // fim da página não gasta CPU nem bateria enquanto ninguém a vê
  const [perto, setPerto] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    const band = bandRef.current;
    if (perto || isThin || !band) return;
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((entrada) => entrada.isIntersecting)) {
          setPerto(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(band);
    return () => observer.disconnect();
  }, [perto, isThin]);

  const classes = [
    "broadcast-band",
    isThin && "broadcast-band--thin",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (isThin) return <div className={classes} aria-hidden="true" />;

  return (
    <div ref={bandRef} className={classes}>
      {colors && perto && !failed && (
        <Grainient
          className="broadcast-band__canvas"
          color1={cobalt}
          color2={amber}
          color3={cobalt}
          onError={() => setFailed(true)}
        />
      )}
      <div className="broadcast-band__inner page-container">{children}</div>
    </div>
  );
}
