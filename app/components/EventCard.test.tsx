import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EventCard, type EventCardProps } from "./EventCard";

const EVENTO: EventCardProps = {
  title: "Hackathon Mineração 2026",
  category: "Hackathon",
  date: "14 nov",
  dateTime: "2026-11-14",
  location: "Minex Hub, Salvador",
  href: "/eventos/hackathon-mineracao-2026",
};

describe("EventCard", () => {
  it("o título é um link para o evento", () => {
    render(<EventCard {...EVENTO} />);

    expect(
      screen.getByRole("link", { name: "Hackathon Mineração 2026" }),
    ).toHaveAttribute("href", "/eventos/hackathon-mineracao-2026");
  });

  it("mostra categoria e data na linha de meta", () => {
    render(<EventCard {...EVENTO} />);

    const card = screen.getByRole("article");
    const meta = card.querySelector(".event-card__meta");
    expect(meta).toHaveTextContent("Hackathon · 14 nov");
    expect(within(card).getByText("14 nov")).toHaveAttribute(
      "datetime",
      "2026-11-14",
    );
  });

  it("sem preço, mostra Gratuito", () => {
    render(<EventCard {...EVENTO} />);

    expect(screen.getByText("Gratuito")).toHaveClass("event-card__free");
  });

  it("com preço, mostra o preço em destaque", () => {
    render(<EventCard {...EVENTO} price="R$ 40" />);

    expect(screen.getByText("R$ 40")).toHaveClass("event-card__price");
    expect(screen.queryByText("Gratuito")).toBeNull();
  });

  it("sem imagem, usa o espaço reservado decorativo", () => {
    const { container } = render(<EventCard {...EVENTO} />);

    expect(screen.queryByRole("img")).toBeNull();
    expect(container.querySelector(".event-card__placeholder")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("com imagem, usa o texto alternativo dado", () => {
    render(
      <EventCard
        {...EVENTO}
        imageSrc="/foto.webp"
        imageAlt="Equipes no Minex Hub"
      />,
    );

    expect(screen.getByRole("img")).toHaveAccessibleName(
      "Equipes no Minex Hub",
    );
  });
});
