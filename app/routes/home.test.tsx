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

  it("oferece as 5 categorias válidas no filtro, mais Todos", () => {
    render(<Home />);

    const filtro = screen.getByRole("group", { name: "Filtrar por categoria" });
    const nomes = Array.from(filtro.querySelectorAll("button")).map(
      (botao) => botao.textContent,
    );
    expect(nomes).toEqual([
      "Todos",
      "Hackathon",
      "Ideathon",
      "Maratona",
      "Edital",
      "Eventos de Inovação",
    ]);
  });

  it("tem um único botão primário (Signal Blue) na tela", () => {
    const { container } = render(<Home />);

    expect(container.querySelectorAll(".button--primary")).toHaveLength(1);
  });
});
