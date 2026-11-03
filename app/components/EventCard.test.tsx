import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import type { Evento } from "~/lib/evento";

import { EventCard } from "./EventCard";

const EVENTO: Evento = {
  id: 42,
  title: "Hackathon Mineração 2026",
  description: null,
  startsAt: "2026-11-14T19:00:00",
  venue: "Minex Hub",
  city: "Salvador",
  uf: "BA",
  latitude: null,
  longitude: null,
  registrationUrl: "https://exemplo.com/inscricao",
  source: "sympla",
  bannerUrl: null,
  tags: ["tecnologia", "Hackathon"],
};

function renderCard(evento: Partial<Evento> = {}) {
  return render(
    <MemoryRouter>
      <EventCard evento={{ ...EVENTO, ...evento }} />
    </MemoryRouter>,
  );
}

describe("EventCard", () => {
  it("o título leva ao detalhe do evento", () => {
    renderCard();

    expect(
      screen.getByRole("link", { name: "Hackathon Mineração 2026" }),
    ).toHaveAttribute("href", "/eventos/42");
  });

  it("mostra a categoria (vinda das tags) e a data na meta", () => {
    renderCard();

    const meta = screen.getByRole("article").querySelector(".event-card__meta");
    expect(meta).toHaveTextContent("Hackathon · 14 nov");
    expect(screen.getByText("14 nov")).toHaveAttribute(
      "datetime",
      "2026-11-14T19:00:00",
    );
  });

  it("sem tag de categoria, a meta mostra só a data", () => {
    renderCard({ tags: ["gastronomia"] });

    const meta = screen.getByRole("article").querySelector(".event-card__meta");
    expect(meta).toHaveTextContent(/^14 nov$/);
  });

  it("mostra o local e a cidade/UF uma vez só, em destaque no rodapé", () => {
    renderCard();

    expect(screen.getByText("Minex Hub")).toHaveClass("event-card__location");
    expect(screen.getAllByText(/Salvador/)).toHaveLength(1);
    expect(screen.getByText("Salvador/BA")).toHaveClass("event-card__city");
  });

  it("sem local, some a linha de local e a cidade do rodapé", () => {
    const { container } = renderCard({ venue: null, city: null, uf: null });

    expect(container.querySelector(".event-card__location")).toBeNull();
    expect(container.querySelector(".event-card__city")).toBeNull();
  });

  it("não mostra preço (a API não tem esse dado)", () => {
    renderCard();

    expect(screen.queryByText("Gratuito")).toBeNull();
  });

  it("sem banner, usa o espaço reservado decorativo", () => {
    const { container } = renderCard();

    expect(screen.queryByRole("img")).toBeNull();
    expect(container.querySelector(".event-card__placeholder")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("com banner, a imagem é decorativa (o título já descreve)", () => {
    const { container } = renderCard({ bannerUrl: "/banner.webp" });

    const imagem = container.querySelector("img.event-card__image");
    expect(imagem).toHaveAttribute("src", "/banner.webp");
    expect(imagem).toHaveAttribute("alt", "");
  });
});
