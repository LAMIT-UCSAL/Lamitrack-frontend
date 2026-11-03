import { useState, useSyncExternalStore, type ReactNode } from "react";

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

// Nada a observar: o suporte a WebGL2 e os tokens não mudam com a página aberta
const subscribe = () => () => {};

// Cores do gradiente lidas dos tokens ("cobalto âmbar"), para não repetir hex
// no componente. String vazia = sem animação, só o fallback em CSS.
function getColors(): string {
  if (!supportsWebGL2()) return "";
  const styles = getComputedStyle(document.documentElement);
  const cobalt = styles.getPropertyValue("--color-cobalt").trim();
  const amber = styles.getPropertyValue("--color-amber").trim();
  return cobalt && amber ? `${cobalt} ${amber}` : "";
}

const getServerColors = () => "";

// Faixa Grainient (padrão .broadcast-band da loja). O HTML do servidor já vem
// com o fallback em CSS; no cliente, com WebGL2, o gradiente animado aparece
// por cima com um fade.
export function BroadcastBand({
  children,
  className,
  variant = "default",
}: BroadcastBandProps) {
  const colors = useSyncExternalStore(subscribe, getColors, getServerColors);
  const [failed, setFailed] = useState(false);
  const isThin = variant === "thin";
  const [cobalt, amber] = colors.split(" ");

  const classes = [
    "broadcast-band",
    isThin && "broadcast-band--thin",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (isThin) return <div className={classes} aria-hidden="true" />;

  return (
    <div className={classes}>
      {colors && !failed && (
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
