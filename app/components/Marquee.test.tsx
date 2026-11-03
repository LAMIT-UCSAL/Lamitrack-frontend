import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Marquee, passoDoMarquee } from "./Marquee";

type Stat = { label: string; value: string };

const STATS: Stat[] = [
  { label: "eventos", value: "42" },
  { label: "cidades", value: "7" },
];

function renderMarquee(items: Stat[] = STATS) {
  return render(
    <Marquee
      items={items}
      getKey={(item) => item.label}
      label="Números do LamiTrack"
      renderItem={(item) => (
        <span>
          {item.value} {item.label}
        </span>
      )}
    />,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("passoDoMarquee", () => {
  it("anda para a esquerda na velocidade atual", () => {
    const estado = passoDoMarquee({ posicao: 0, velocidade: 40 }, 40, 0.05, 0);
    expect(estado.velocidade).toBe(40);
    expect(estado.posicao).toBeCloseTo(-2);
  });

  it("aproxima a velocidade do alvo aos poucos (desacelera sem parar)", () => {
    const estado = passoDoMarquee({ posicao: 0, velocidade: 40 }, 14, 0.05, 0);
    // 40 + (14 − 40) · 0,2 = 34,8
    expect(estado.velocidade).toBeCloseTo(34.8);
    expect(estado.velocidade).toBeGreaterThan(14);
  });

  it("limita o salto de tempo a 0,1 s (aba que volta do segundo plano)", () => {
    const estado = passoDoMarquee({ posicao: 0, velocidade: 40 }, 40, 5, 0);
    expect(estado.posicao).toBeCloseTo(-4);
  });

  it("volta um período inteiro ao passar dele (loop sem emenda)", () => {
    const estado = passoDoMarquee(
      { posicao: -299, velocidade: 40 },
      40,
      0.05,
      300,
    );
    expect(estado.posicao).toBeCloseTo(-1);
  });
});

describe("Marquee", () => {
  it("é uma região rotulada com cada item e uma cópia invisível", () => {
    const { container } = renderMarquee();

    expect(
      screen.getByRole("region", { name: "Números do LamiTrack" }),
    ).toBeInTheDocument();
    const itens = container.querySelectorAll(".marquee__item");
    expect(itens).toHaveLength(4);
    expect(itens[0]).not.toHaveAttribute("aria-hidden");
    expect(itens[2]).toHaveAttribute("aria-hidden", "true");
    expect(itens[2]).toHaveAttribute("inert");
    expect(screen.getAllByText("42 eventos")).toHaveLength(2);
  });

  it("não tem botão de pausa (decisão do time)", () => {
    renderMarquee();

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("tem filetes por padrão e aceita compact e baseline", () => {
    const { container, rerender } = renderMarquee();
    expect(container.firstChild).toHaveClass("marquee--dividers");

    rerender(
      <Marquee
        items={STATS}
        getKey={(item) => item.label}
        label="Números"
        renderItem={(item) => item.value}
        dividers={false}
        compact
        baseline
      />,
    );
    expect(container.firstChild).not.toHaveClass("marquee--dividers");
    expect(container.firstChild).toHaveClass(
      "marquee--compact",
      "marquee--baseline",
    );
  });

  it("com reduced-motion, continua igual: cópia do loop e blur (decisão do produto)", () => {
    vi.stubGlobal(
      "matchMedia",
      (query: string) =>
        ({
          matches: query.includes("reduce"),
          addEventListener: () => {},
          removeEventListener: () => {},
        }) as unknown as MediaQueryList,
    );
    const { container } = renderMarquee();

    expect(container.querySelectorAll(".marquee__item")).toHaveLength(4);
    expect(container.querySelectorAll(".marquee__blur")).toHaveLength(2);
  });

  it("sem itens, não renderiza nada", () => {
    const { container } = renderMarquee([]);

    expect(container).toBeEmptyDOMElement();
  });
});
