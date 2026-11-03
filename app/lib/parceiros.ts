// Parceiros da LAMIT exibidos na Home. Só entra organização com parceria
// CONFIRMADA pelo time e com permissão de uso do logo.
//
// Para adicionar: salve o logo em app/assets/parceiros/ (SVG ou PNG com fundo
// transparente), importe aqui e acrescente na lista. Com a lista vazia, a
// faixa de parceiros não aparece.
//
// Exemplo:
//   import logoExemplo from "~/assets/parceiros/exemplo.svg";
//   { nome: "Exemplo", logo: logoExemplo, site: "https://exemplo.org" },

export type Parceiro = {
  nome: string;
  logo: string;
  site?: string;
};

export const PARCEIROS: Parceiro[] = [];
