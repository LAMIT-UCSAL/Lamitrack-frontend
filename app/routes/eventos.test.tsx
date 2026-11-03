import { fireEvent, render, screen, within } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Eventos, { loader } from "./eventos";

// Tela com o loader de verdade, sobre os dados simulados (sem LAMITRACK_API_URL)
function renderEventos(url = "/eventos") {
  const Stub = createRoutesStub([
    {
      path: "/eventos",
      Component: Eventos as never,
      loader: loader as never,
    },
  ]);
  return render(<Stub initialEntries={[url]} />);
}

beforeEach(() => {
  vi.stubEnv("LAMITRACK_API_URL", "");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("/eventos", () => {
  it("lista os eventos em ordem de data, com o total e o aviso de exemplo", async () => {
    renderEventos();

    expect(
      await screen.findByRole("heading", { level: 1, name: "Eventos." }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "14 eventos",
    );
    expect(screen.getByRole("note")).toHaveTextContent("Dados de exemplo.");
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(12);
    expect(cards[0]).toHaveTextContent("Hackathon de Mobilidade Urbana");
  });

  it("pagina de 12 em 12, com links que mantêm os filtros", async () => {
    renderEventos("/eventos?pagina=2");

    expect(await screen.findAllByRole("article")).toHaveLength(2);
    const paginacao = screen.getByRole("navigation", { name: "Paginação" });
    expect(within(paginacao).getByText("Página 2 de 2")).toBeInTheDocument();
    expect(
      within(paginacao).getByRole("link", { name: /Anterior/ }),
    ).toHaveAttribute("href", "/eventos");
    expect(
      within(paginacao).queryByRole("link", { name: /Próxima/ }),
    ).toBeNull();
  });

  it("filtra pela categoria da URL e marca a aba", async () => {
    renderEventos("/eventos?categoria=Edital");

    const cards = await screen.findAllByRole("article");
    expect(cards).toHaveLength(3);
    for (const card of cards) {
      expect(card).toHaveTextContent(/Inscrições até/);
    }
    expect(screen.getByRole("button", { name: "Edital" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("trocar a aba de categoria filtra sem recarregar a página", async () => {
    renderEventos();
    await screen.findAllByRole("article");

    fireEvent.click(screen.getByRole("button", { name: "Maratona" }));

    expect(await screen.findByText("2 eventos")).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(2);
  });

  it("aceita a cidade em minúsculas", async () => {
    renderEventos("/eventos?cidade=feira%20de%20santana");

    const cards = await screen.findAllByRole("article");
    expect(cards).toHaveLength(1);
    expect(screen.getByLabelText("Cidade")).toHaveValue("Feira de Santana");
  });

  it("sem resultado, mostra a nota e o caminho para limpar", async () => {
    renderEventos("/eventos?cidade=Ilh%C3%A9us");

    const nota = await screen.findByRole("status");
    expect(nota).toHaveTextContent(
      "Nenhum evento encontrado com esses filtros.",
    );
    expect(
      within(nota).getByRole("link", { name: "Limpar filtros e ver todos" }),
    ).toHaveAttribute("href", "/eventos");
    expect(screen.queryByRole("article")).toBeNull();
  });

  it("limpar os filtros esvazia os campos", async () => {
    renderEventos("/eventos?cidade=Salvador");
    expect(await screen.findByLabelText("Cidade")).toHaveValue("Salvador");

    fireEvent.click(screen.getByRole("link", { name: "Limpar filtros" }));

    expect(await screen.findByText("14 eventos")).toBeInTheDocument();
    expect(screen.getByLabelText("Cidade")).toHaveValue("");
  });

  it("o loader passa os filtros para a API", async () => {
    const resposta = await loader({
      request: new Request(
        "http://localhost/eventos?categoria=Hackathon&cidade=salvador",
      ),
    } as never);

    expect(resposta.filtros).toMatchObject({
      categoria: "Hackathon",
      cidade: "Salvador",
    });
    expect(resposta.eventos.content.map((e) => e.title)).toEqual([
      "Hackathon de Mobilidade Urbana",
    ]);
    expect(resposta.simulada).toBe(true);
  });
});
