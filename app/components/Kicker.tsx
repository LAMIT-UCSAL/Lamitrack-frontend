import type { ReactNode } from "react";

import "./Kicker.scss";

type KickerProps = {
  children: ReactNode;
  className?: string;
};

// Rótulo curto que abre toda seção, com o filete dourado antes.
// Voz: frase curta, afirmativa, com ponto final ("Lamit em competição.").
export function Kicker({ children, className }: KickerProps) {
  return (
    <p className={className ? `kicker ${className}` : "kicker"}>{children}</p>
  );
}
