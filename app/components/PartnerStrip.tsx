import type { Parceiro } from "~/lib/parceiros";

import { Kicker } from "./Kicker";
import { Marquee } from "./Marquee";
import "./PartnerStrip.scss";

type PartnerStripProps = {
  parceiros: Parceiro[];
};

// Faixa de parceiros (logos no marquee). Sem parceiros confirmados, não aparece.
export function PartnerStrip({ parceiros }: PartnerStripProps) {
  if (parceiros.length === 0) return null;

  return (
    <section
      className="partner-strip page-container"
      aria-labelledby="titulo-parceiros"
    >
      <Kicker>Quem apoia.</Kicker>
      <h2 id="titulo-parceiros">Parceiros da LAMIT.</h2>
      <Marquee
        items={parceiros}
        getKey={(parceiro) => parceiro.nome}
        label="Parceiros da LAMIT"
        renderItem={(parceiro) =>
          parceiro.site ? (
            <a
              className="partner-strip__item"
              href={parceiro.site}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${parceiro.nome} (abre em nova aba)`}
            >
              <img src={parceiro.logo} alt="" loading="lazy" />
            </a>
          ) : (
            <span className="partner-strip__item">
              <img src={parceiro.logo} alt={parceiro.nome} loading="lazy" />
            </span>
          )
        }
      />
    </section>
  );
}
