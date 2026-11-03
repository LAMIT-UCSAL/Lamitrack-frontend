import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./home";

describe("Home", () => {
  it("abre com o kicker e o título do LamiTrack", () => {
    render(<Home />);

    expect(screen.getByText("Vitrine de eventos.")).toHaveClass("kicker");
    expect(
      screen.getByRole("heading", { level: 1, name: "LamiTrack" }),
    ).toBeInTheDocument();
  });

  it("tem um único CTA primário e um secundário", () => {
    const { container } = render(<Home />);

    expect(container.querySelectorAll(".button--primary")).toHaveLength(1);
    expect(screen.getByRole("link", { name: /Ver eventos/ })).toHaveAttribute(
      "href",
      "#eventos",
    );
    expect(screen.getByRole("link", { name: /Conhecer a LAMIT/ })).toHaveClass(
      "button--secondary",
    );
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

  it("mostra o card de exemplo e o filtra pela categoria", () => {
    render(<Home />);

    expect(screen.getByRole("article")).toHaveTextContent(
      "Hackathon de exemplo",
    );

    fireEvent.click(screen.getByRole("button", { name: "Edital" }));
    expect(screen.queryByRole("article")).toBeNull();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Nenhum evento de Edital por enquanto.",
    );

    fireEvent.click(screen.getByRole("button", { name: "Hackathon" }));
    expect(screen.getByRole("article")).toBeInTheDocument();
  });

  it("fecha com a faixa Grainient", () => {
    const { container } = render(<Home />);

    const faixa = container.querySelector(".broadcast-band");
    expect(faixa).not.toBeNull();
    expect(faixa).toHaveTextContent("A agenda da inovação, num só lugar.");
  });
});
