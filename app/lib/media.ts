// Consultas de mídia seguras para SSR: no servidor (e no jsdom sem matchMedia)
// respondem "não", e o componente fica no comportamento mais calmo.

function matches(query: string): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(query).matches
  );
}

export function prefersReducedMotion(): boolean {
  return matches("(prefers-reduced-motion: reduce)");
}
