import { fireEvent, render, screen, within } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Home, { loader } from "./home";

// Home com o loader de verdade, sobre os dados simulados (sem LAMITRACK_API_URL)
async function renderHome(url = "/") {
  const Stub = createRoutesStub([
    { path: "/", Component: Home as never, loader: loader as never },
  ]);
  const resultado = render(<Stub initialEntries={[url]} />);
  await screen.findByRole("heading", { level: 1 });
  return resultado;
}

const proximos = () =>
  screen.getByRole("region", { name: "Próximos eventos." });

beforeEach(() => {
  vi.stubEnv("LAMITRACK_API_URL", "");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Home", () => {
  it("abre com o hero definitivo, sem texto de página provisória", async () => {
    const { container } = await renderHome();

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "A agenda da inovação na Bahia.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("LamiTrack.")).toHaveClass("kicker");
    expect(container).not.toHaveTextContent(/provisória/i);
  });

  it("tem um único CTA primário, para a lista de eventos", async () => {
    const { container } = await renderHome();

    expect(container.querySelectorAll(".button--primary")).toHaveLength(1);
    expect(screen.getByRole("link", { name: /Ver eventos/ })).toHaveAttribute(
      "href",
      "/eventos",
    );
  });

  it("tem o globo no hero e o aviso de dados de exemplo", async () => {
    await renderHome();

    expect(
      screen.getByRole("img", { name: "Globo terrestre com Salvador marcado" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("note")).toHaveTextContent("Dados de exemplo.");
  });

  it("os números vêm da API: total e por categoria, com link para a lista", async () => {
    await renderHome();

    const faixa = screen.getByRole("region", { name: "A agenda em números" });
    const links = within(faixa).getAllByRole("link");
    expect(links[0]).toHaveTextContent("14eventos na agenda");
    expect(links[0]).toHaveAttribute("href", "/eventos");
    const edital = links.find((l) => /Edital/.test(l.textContent ?? ""));
    expect(edital).toHaveTextContent("3Edital");
    expect(edital).toHaveAttribute("href", "/eventos?categoria=Edital");
  });

  it("destaca os 3 próximos no carrossel", async () => {
    await renderHome();

    const carrossel = screen.getByRole("region", {
      name: "Próximos da agenda",
    });
    expect(
      within(carrossel).getAllByRole("group", { hidden: true }),
    ).toHaveLength(3);
  });

  it("mostra os 6 próximos e o caminho para todos", async () => {
    await renderHome();

    expect(within(proximos()).getAllByRole("article")).toHaveLength(6);
    expect(
      within(proximos()).getByRole("link", { name: /Ver todos os eventos/ }),
    ).toHaveAttribute("href", "/eventos");
  });

  it("filtra os próximos pela categoria da URL", async () => {
    await renderHome("/?categoria=Edital");

    const cards = within(proximos()).getAllByRole("article");
    expect(cards).toHaveLength(3);
    for (const card of cards) expect(card).toHaveTextContent(/Inscrições até/);
    expect(screen.getByRole("button", { name: "Edital" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      within(proximos()).getByRole("link", { name: /Ver todos de Edital/ }),
    ).toHaveAttribute("href", "/eventos?categoria=Edital");
  });

  it("trocar a aba filtra sem sair da Home", async () => {
    await renderHome();

    fireEvent.click(screen.getByRole("button", { name: "Maratona" }));

    expect(
      await within(proximos()).findByRole("link", {
        name: /Ver todos de Maratona/,
      }),
    ).toBeInTheDocument();
    expect(within(proximos()).getAllByRole("article")).toHaveLength(2);
  });

  it("sem parceiros confirmados, a faixa de parceiros não aparece", async () => {
    await renderHome();

    expect(
      screen.queryByRole("heading", { name: "Parceiros da LAMIT." }),
    ).toBeNull();
  });

  it("fecha com a faixa Grainient", async () => {
    const { container } = await renderHome();

    expect(container.querySelector(".broadcast-band")).toHaveTextContent(
      "Não espere, construa.",
    );
  });
});
