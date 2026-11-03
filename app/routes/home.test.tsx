import { render, screen, within } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Home, { loader } from "./home";

// Home com o loader de verdade, sobre os dados simulados (sem LAMITRACK_API_URL)
async function renderHome() {
  const Stub = createRoutesStub([
    { path: "/", Component: Home as never, loader: loader as never },
  ]);
  const resultado = render(<Stub initialEntries={["/"]} />);
  await screen.findByRole("heading", { level: 1, name: "LamiTrack" });
  return resultado;
}

beforeEach(() => {
  vi.stubEnv("LAMITRACK_API_URL", "");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Home", () => {
  it("abre com o kicker e o título do LamiTrack", async () => {
    await renderHome();

    expect(screen.getByText("Vitrine de eventos.")).toHaveClass("kicker");
  });

  it("avisa que os dados são de exemplo enquanto a API não está no ar", async () => {
    await renderHome();

    expect(screen.getByRole("note")).toHaveTextContent("Dados de exemplo.");
  });

  it("tem um único CTA primário, que leva à lista de eventos", async () => {
    const { container } = await renderHome();

    expect(container.querySelectorAll(".button--primary")).toHaveLength(1);
    expect(screen.getByRole("link", { name: /Ver eventos/ })).toHaveAttribute(
      "href",
      "/eventos",
    );
    expect(screen.getByRole("link", { name: /Conhecer a LAMIT/ })).toHaveClass(
      "button--secondary",
    );
  });

  it("mostra os 6 próximos eventos e o caminho para todos", async () => {
    await renderHome();

    const secao = screen.getByRole("region", { name: "Próximos eventos." });
    expect(within(secao).getAllByRole("article")).toHaveLength(6);
    expect(
      within(secao).getByRole("link", { name: /Ver todos os eventos/ }),
    ).toHaveAttribute("href", "/eventos");
  });

  it("destaca os 3 primeiros no carrossel", async () => {
    await renderHome();

    const carrossel = screen.getByRole("region", { name: "Últimos eventos" });
    expect(carrossel).toHaveAttribute("aria-roledescription", "carrossel");
    expect(
      within(carrossel).getAllByRole("group", { hidden: true }),
    ).toHaveLength(3);
  });

  it("a faixa de números conta os eventos de cada categoria", async () => {
    await renderHome();

    const faixa = screen.getByRole("region", { name: "Eventos por categoria" });
    expect(faixa).toHaveClass("marquee--compact", "marquee--baseline");
    const edital = within(faixa).getAllByRole("link", { name: /Edital/ })[0];
    expect(edital).toHaveTextContent("3Edital");
    expect(edital).toHaveAttribute("href", "/eventos?categoria=Edital");
  });

  it("tem o globo na abertura", async () => {
    await renderHome();

    expect(
      screen.getByRole("img", { name: "Globo terrestre com Salvador marcado" }),
    ).toBeInTheDocument();
  });

  it("fecha com a faixa Grainient", async () => {
    const { container } = await renderHome();

    const faixa = container.querySelector(".broadcast-band");
    expect(faixa).toHaveTextContent("A agenda da inovação, num só lugar.");
  });
});
