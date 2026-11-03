import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PARCEIROS } from "~/lib/parceiros";

import { PartnerStrip } from "./PartnerStrip";

const PARCEIROS_DE_TESTE = [
  { nome: "Comunidade A", logo: "/a.svg", site: "https://a.example.com" },
  { nome: "Comunidade B", logo: "/b.svg" },
];

describe("PartnerStrip", () => {
  it("sem parceiros, não aparece", () => {
    const { container } = render(<PartnerStrip parceiros={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("a lista do projeto só tem parceiros confirmados (hoje, nenhum)", () => {
    expect(PARCEIROS).toEqual([]);
  });

  it("mostra cada parceiro, com link quando há site", () => {
    render(<PartnerStrip parceiros={PARCEIROS_DE_TESTE} />);

    expect(
      screen.getByRole("heading", { name: "Parceiros da LAMIT." }),
    ).toBeInTheDocument();
    const link = screen.getByRole("link", {
      name: "Comunidade A (abre em nova aba)",
    });
    expect(link).toHaveAttribute("href", "https://a.example.com");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getAllByRole("img", { name: "Comunidade B" })).toHaveLength(
      1,
    );
  });
});
