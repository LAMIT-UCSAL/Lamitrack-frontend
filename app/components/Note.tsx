import type { ReactNode } from "react";

import "./Note.scss";

type NoteProps = {
  children: ReactNode;
  // "status" anuncia a mudança ao leitor de tela (ex.: filtro sem resultado)
  role?: "status" | "note";
  className?: string;
};

// Nota informativa: borda esquerda dourada sobre paper-2 (padrão
// .product-detail__delivery-note da loja)
export function Note({ children, role = "note", className }: NoteProps) {
  return (
    <div className={className ? `note ${className}` : "note"} role={role}>
      {children}
    </div>
  );
}
