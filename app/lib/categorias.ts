// As 5 únicas categorias válidas de evento (RF08). Na interface, a categoria
// aparece como rótulo de meta em gold-ink, caixa alta (decisão da story 5.25):
// o nome diferencia, não a cor.
export const CATEGORIAS = [
  "Hackathon",
  "Ideathon",
  "Maratona",
  "Edital",
  "Eventos de Inovação",
] as const;

export type Categoria = (typeof CATEGORIAS)[number];
