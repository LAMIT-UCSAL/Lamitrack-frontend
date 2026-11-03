import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FORMULARIO_PARCERIA, PARCEIROS } from "~/lib/parceiros";

import { PartnerStrip } from "./PartnerStrip";

const PARCEIROS_DE_TESTE = [
  { nome: "Comunidade A", logo: "/a.svg", site: "https://a.example.com" },
  { nome: "Comunidade B", logo: "/b.svg", alto: true },
];

describe("PartnerStrip", () => {
  it("sem parceiros, não aparece", () => {
    const { container } = render(<PartnerStrip parceiros={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("a lista do projeto é a mesma do site da LAMIT", () => {
    expect(PARCEIROS.map((p) => p.nome)).toEqual([
      "GDG Salvador",
      "GDG Lauro de Freitas",
      "NEXUPP",
      "SCUPP",
      "Stem para as Minas",
      "Isso Não É Um Rádio",
      "Red Bull",
      "Rocketseat",
    ]);
    expect(FORMULARIO_PARCERIA).toBe("https://forms.gle/VQshwDE4bDSfuNWX8");
  });

  it("mostra cada parceiro, com link quando há site", () => {
    render(<PartnerStrip parceiros={PARCEIROS_DE_TESTE} />);

    expect(
      screen.getByRole("heading", { name: "Quem constrói com a gente." }),
    ).toBeInTheDocument();
    const link = screen.getByRole("link", {
      name: "Comunidade A (abre em nova aba)",
    });
    expect(link).toHaveAttribute("href", "https://a.example.com");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    const logo = screen.getByRole("img", { name: "Comunidade B" });
    expect(logo.parentElement).toHaveClass("partner-strip__item--alto");
  });

  it("com formulário, oferece 'Quero ser parceiro' como CTA secundário", () => {
    render(
      <PartnerStrip
        parceiros={PARCEIROS_DE_TESTE}
        formulario="https://forms.example.com"
      />,
    );

    const cta = screen.getByRole("link", { name: /Quero ser parceiro/ });
    expect(cta).toHaveAttribute("href", "https://forms.example.com");
    expect(cta).toHaveClass("button--secondary");
    expect(cta).toHaveAttribute("target", "_blank");
  });
});
