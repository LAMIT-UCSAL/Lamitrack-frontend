import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./home";

describe("Home", () => {
  it("mostra o título do LamiTrack", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { level: 1, name: "LamiTrack" }),
    ).toBeInTheDocument();
  });

  it("mostra as 5 categorias válidas, cada uma com sua classe de badge", () => {
    render(<Home />);

    const esperadas = [
      ["Hackathon", "badge-cat-hackathon"],
      ["Ideathon", "badge-cat-ideathon"],
      ["Maratona", "badge-cat-maratona"],
      ["Edital", "badge-cat-edital"],
      ["Eventos de Inovação", "badge-cat-eventos-de-inovacao"],
    ];
    for (const [nome, classe] of esperadas) {
      expect(screen.getByText(nome)).toHaveClass("badge-cat", classe);
    }
  });

  it("tem um único botão primário (laranja) na tela", () => {
    const { container } = render(<Home />);

    expect(container.querySelectorAll(".btn-eve-primary")).toHaveLength(1);
  });
});
