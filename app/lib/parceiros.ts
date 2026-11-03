import gdgLauroDeFreitas from "~/assets/parceiros/gdg-lauro-de-freitas.webp";
import gdgSalvador from "~/assets/parceiros/gdg-salvador.webp";
import issoNaoEUmRadio from "~/assets/parceiros/isso-nao-e-um-radio.webp";
import nexupp from "~/assets/parceiros/nexupp.webp";
import redBull from "~/assets/parceiros/red-bull.webp";
import rocketseat from "~/assets/parceiros/rocketseat.webp";
import scupp from "~/assets/parceiros/scupp.webp";
import stemParaAsMinas from "~/assets/parceiros/stem-para-as-minas.webp";

// Parceiros da LAMIT exibidos na Home: a mesma lista do site institucional
// (Lamit-site/src/data/home.js, logos em public/media/partners/). Quando a
// lista do site mudar, atualize aqui também.
//
// Para adicionar: salve o logo em app/assets/parceiros/ (fundo transparente,
// feito para fundo claro), importe aqui e acrescente na lista. Com a lista
// vazia, a faixa de parceiros não aparece.

export type Parceiro = {
  nome: string;
  logo: string;
  site?: string;
  // Logo vertical: ocupa a altura toda do cartão (como no site)
  alto?: boolean;
};

export const PARCEIROS: Parceiro[] = [
  { nome: "GDG Salvador", logo: gdgSalvador, alto: true },
  { nome: "GDG Lauro de Freitas", logo: gdgLauroDeFreitas, alto: true },
  { nome: "NEXUPP", logo: nexupp },
  { nome: "SCUPP", logo: scupp },
  { nome: "Stem para as Minas", logo: stemParaAsMinas },
  { nome: "Isso Não É Um Rádio", logo: issoNaoEUmRadio },
  { nome: "Red Bull", logo: redBull },
  { nome: "Rocketseat", logo: rocketseat },
];

// "Quero ser parceiro": o mesmo formulário do site da LAMIT
export const FORMULARIO_PARCERIA = "https://forms.gle/VQshwDE4bDSfuNWX8";
