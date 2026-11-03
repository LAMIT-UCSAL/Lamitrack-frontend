import type { Parceiro } from "~/lib/parceiros";

import { Button } from "./Button";

import { Kicker } from "./Kicker";
import { Marquee } from "./Marquee";
import "./PartnerStrip.scss";

type PartnerStripProps = {
  parceiros: Parceiro[];
  // Link "Quero ser parceiro" (formulário da LAMIT)
  formulario?: string;
};

// Faixa de parceiros (logos no marquee). Sem parceiros confirmados, não aparece.
// Logos sem lazy: no marquee eles entram na tela andando e não podem surgir do nada.
export function PartnerStrip({ parceiros, formulario }: PartnerStripProps) {
  if (parceiros.length === 0) return null;

  return (
    <section
      className="partner-strip page-container"
      aria-labelledby="titulo-parceiros"
    >
      <Kicker>Parceiros.</Kicker>
      <h2 id="titulo-parceiros">Quem constrói com a gente.</h2>
      <p className="partner-strip__texto">
        Comunidades e empresas que apoiam os eventos, maratonas e projetos da
        LAMIT.
      </p>
      <Marquee
        items={parceiros}
        getKey={(parceiro) => parceiro.nome}
        label="Parceiros da LAMIT"
        renderItem={(parceiro) =>
          parceiro.site ? (
            <a
              className={classeDoItem(parceiro)}
              href={parceiro.site}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${parceiro.nome} (abre em nova aba)`}
            >
              <img src={parceiro.logo} alt="" />
            </a>
          ) : (
            <span className={classeDoItem(parceiro)}>
              <img src={parceiro.logo} alt={parceiro.nome} />
            </span>
          )
        }
      />
      {formulario && (
        <Button
          className="partner-strip__cta"
          variant="secondary"
          href={formulario}
          target="_blank"
          rel="noopener noreferrer"
          arrow={false}
        >
          Quero ser parceiro <span aria-hidden="true">↗</span>
          <span className="sr-only"> (formulário, abre em nova aba)</span>
        </Button>
      )}
    </section>
  );
}

function classeDoItem(parceiro: Parceiro): string {
  return parceiro.alto
    ? "partner-strip__item partner-strip__item--alto"
    : "partner-strip__item";
}
