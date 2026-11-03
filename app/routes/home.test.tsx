import {
  fireEvent,
  render as renderBase,
  screen,
} from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import Home from "./home";

// O card de evento usa o Link do React Router
function render(ui: ReactElement) {
  return renderBase(<MemoryRouter>{ui}</MemoryRouter>);
}

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

  it("mostra os cards de exemplo e os filtra pela categoria", () => {
    render(<Home />);

    expect(screen.getAllByRole("article")).toHaveLength(3);

    fireEvent.click(screen.getByRole("button", { name: "Ideathon" }));
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(1);
    expect(cards[0]).toHaveTextContent("Ideathon de exemplo");

    fireEvent.click(screen.getByRole("button", { name: "Maratona" }));
    expect(screen.queryByRole("article")).toBeNull();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Nenhum evento de Maratona por enquanto.",
    );
  });

  it("destaca os últimos eventos no carrossel", () => {
    render(<Home />);

    const carrossel = screen.getByRole("region", { name: "Últimos eventos" });
    expect(carrossel).toHaveAttribute("aria-roledescription", "carrossel");
    expect(screen.getByRole("button", { name: "Pausar" })).toBeInTheDocument();
  });

  it("fecha com a faixa Grainient", () => {
    const { container } = render(<Home />);

    const faixa = container.querySelector(".broadcast-band");
    expect(faixa).not.toBeNull();
    expect(faixa).toHaveTextContent("A agenda da inovação, num só lugar.");
  });
});
