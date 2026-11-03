import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Evento } from "~/lib/evento";

import { EventCarousel, INTERVALO_MS } from "./EventCarousel";

function evento(id: number, tags: string[] = ["Hackathon"]): Evento {
  return {
    id,
    title: `Evento ${id}`,
    description: null,
    startsAt: `2026-11-1${id}T19:00:00`,
    venue: null,
    city: "Salvador",
    uf: "BA",
    latitude: null,
    longitude: null,
    registrationUrl: null,
    source: "teste",
    bannerUrl: null,
    tags,
  };
}

const TRES = [evento(1), evento(2, ["Ideathon"]), evento(3, [])];

function renderCarousel(eventos: Evento[] = TRES) {
  return render(
    <MemoryRouter>
      <EventCarousel eventos={eventos} label="Últimos eventos" />
    </MemoryRouter>,
  );
}

// O slide visível é o único sem inert
function slideAtual() {
  return screen
    .getAllByRole("group", { hidden: true })
    .find((slide) => !slide.hasAttribute("inert"));
}

function avancar(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("EventCarousel", () => {
  it("é uma região rotulada com um grupo por slide", () => {
    renderCarousel();

    const regiao = screen.getByRole("region", { name: "Últimos eventos" });
    expect(regiao).toHaveAttribute("aria-roledescription", "carrossel");
    const slides = screen.getAllByRole("group", { hidden: true });
    expect(slides).toHaveLength(3);
    expect(slides[0]).toHaveAttribute("aria-roledescription", "slide");
    expect(slides[0]).toHaveAccessibleName("1 de 3");
  });

  it("começa no primeiro slide, e só ele recebe foco", () => {
    renderCarousel();

    expect(slideAtual()).toHaveAccessibleName("1 de 3");
    // O jsdom não aplica o inert; no navegador ele tira os outros slides do Tab
    const slides = screen.getAllByRole("group", { hidden: true });
    expect(slides.filter((slide) => slide.hasAttribute("inert"))).toHaveLength(
      2,
    );
    expect(screen.getByRole("link", { name: "Evento 1" })).toHaveAttribute(
      "href",
      "/eventos/1",
    );
  });

  it("mostra categoria e data na meta; sem categoria, só a data", () => {
    renderCarousel();

    const metas = document.querySelectorAll(".event-carousel__meta");
    expect(metas[0]).toHaveTextContent("Hackathon · 11 nov");
    expect(metas[2]).toHaveTextContent(/^13 nov$/);
  });

  it("avança a cada 4 s e volta ao primeiro depois do último", () => {
    renderCarousel();

    avancar(INTERVALO_MS);
    expect(slideAtual()).toHaveAccessibleName("2 de 3");
    avancar(INTERVALO_MS);
    expect(slideAtual()).toHaveAccessibleName("3 de 3");
    avancar(INTERVALO_MS);
    expect(slideAtual()).toHaveAccessibleName("1 de 3");
  });

  it("setas e dots navegam, e o dot atual fica marcado", () => {
    renderCarousel();

    fireEvent.click(screen.getByRole("button", { name: "Evento anterior" }));
    expect(slideAtual()).toHaveAccessibleName("3 de 3");
    fireEvent.click(screen.getByRole("button", { name: "Próximo evento" }));
    expect(slideAtual()).toHaveAccessibleName("1 de 3");

    const dot = screen.getByRole("button", {
      name: "Ir para o evento 2: Evento 2",
    });
    fireEvent.click(dot);
    expect(slideAtual()).toHaveAccessibleName("2 de 3");
    expect(dot).toHaveAttribute("aria-current", "true");
    expect(
      screen.getByRole("button", { name: "Ir para o evento 1: Evento 1" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("o botão de pausa para e retoma o avanço", () => {
    renderCarousel();

    fireEvent.click(screen.getByRole("button", { name: "Pausar" }));
    avancar(INTERVALO_MS * 3);
    expect(slideAtual()).toHaveAccessibleName("1 de 3");

    fireEvent.click(screen.getByRole("button", { name: "Retomar" }));
    avancar(INTERVALO_MS);
    expect(slideAtual()).toHaveAccessibleName("2 de 3");
  });

  it("pausa com o mouse em cima e retoma ao sair", () => {
    renderCarousel();
    const regiao = screen.getByRole("region");

    fireEvent.mouseEnter(regiao);
    avancar(INTERVALO_MS * 2);
    expect(slideAtual()).toHaveAccessibleName("1 de 3");

    fireEvent.mouseLeave(regiao);
    avancar(INTERVALO_MS);
    expect(slideAtual()).toHaveAccessibleName("2 de 3");
  });

  it("pausa com o foco dentro e anuncia a troca de slide só parado", () => {
    renderCarousel();
    const trilho = document.querySelector(".event-carousel__track");
    expect(trilho).toHaveAttribute("aria-live", "off");

    const proximo = screen.getByRole("button", { name: "Próximo evento" });
    fireEvent.focus(proximo);
    expect(trilho).toHaveAttribute("aria-live", "polite");
    avancar(INTERVALO_MS * 2);
    expect(slideAtual()).toHaveAccessibleName("1 de 3");

    // Foco indo de um controle para outro não retoma
    const anterior = screen.getByRole("button", { name: "Evento anterior" });
    fireEvent.blur(proximo, { relatedTarget: anterior });
    avancar(INTERVALO_MS);
    expect(slideAtual()).toHaveAccessibleName("1 de 3");

    fireEvent.blur(anterior, { relatedTarget: document.body });
    avancar(INTERVALO_MS);
    expect(slideAtual()).toHaveAccessibleName("2 de 3");
  });

  it("com reduced-motion, não avança sozinho nem mostra a pausa", () => {
    vi.stubGlobal(
      "matchMedia",
      (query: string) =>
        ({
          matches: query.includes("reduce"),
          addEventListener: () => {},
          removeEventListener: () => {},
        }) as unknown as MediaQueryList,
    );
    renderCarousel();

    expect(screen.queryByRole("button", { name: "Pausar" })).toBeNull();
    avancar(INTERVALO_MS * 2);
    expect(slideAtual()).toHaveAccessibleName("1 de 3");
    fireEvent.click(screen.getByRole("button", { name: "Próximo evento" }));
    expect(slideAtual()).toHaveAccessibleName("2 de 3");
  });

  it("com um evento só, não tem controles nem avanço", () => {
    renderCarousel([evento(1)]);

    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.getByRole("group")).toHaveAccessibleName("1 de 1");
  });

  it("sem eventos, não renderiza nada", () => {
    const { container } = renderCarousel([]);

    expect(container).toBeEmptyDOMElement();
  });
});
