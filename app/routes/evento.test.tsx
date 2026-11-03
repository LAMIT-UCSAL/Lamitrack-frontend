import { render, screen, within } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Evento } from "~/lib/evento";
import { EVENTOS_SIMULADOS } from "~/lib/eventos-simulados";

import EventoDetalhe, { loader, meta, resumoDoEvento } from "./evento";

// Tela com o loader de verdade, sobre os dados simulados (sem LAMITRACK_API_URL)
async function renderEvento(id: number) {
  const Stub = createRoutesStub([
    {
      path: "/eventos/:id",
      Component: EventoDetalhe as never,
      loader: loader as never,
    },
  ]);
  const resultado = render(<Stub initialEntries={[`/eventos/${id}`]} />);
  await screen.findByRole("heading", { level: 1 });
  return resultado;
}

const evento = (id: number) =>
  EVENTOS_SIMULADOS.find((e) => e.id === id) as Evento;

beforeEach(() => {
  vi.stubEnv("LAMITRACK_API_URL", "");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("/eventos/:id", () => {
  it("mostra título, categoria, data por extenso, local e fonte", async () => {
    await renderEvento(1);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Hackathon de Mobilidade Urbana",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Hackathon.")).toHaveClass("kicker");
    const ficha = screen.getByRole("complementary", {
      name: "Informações e inscrição",
    });
    expect(within(ficha).getByText("Data")).toBeInTheDocument();
    expect(
      within(ficha).getByText("sábado, 14 de novembro de 2026 · 8h"),
    ).toHaveAttribute("datetime", "2026-11-14T08:00:00");
    expect(within(ficha).getByText("Hub de inovação")).toBeInTheDocument();
    expect(within(ficha).getByText("Salvador/BA")).toBeInTheDocument();
    expect(within(ficha).getByText("Dados de exemplo")).toBeInTheDocument();
  });

  it("leva à inscrição original numa nova aba, com segurança", async () => {
    const { container } = await renderEvento(1);

    const cta = screen.getByRole("link", { name: /Fazer inscrição/ });
    expect(cta).toHaveAttribute("href", "https://example.com/inscricao/1");
    expect(cta).toHaveAttribute("target", "_blank");
    expect(cta).toHaveAttribute("rel", "noopener noreferrer");
    expect(container.querySelectorAll(".button--primary")).toHaveLength(1);
  });

  it("com coordenadas, oferece o mapa", async () => {
    await renderEvento(1);

    expect(screen.getByRole("link", { name: /Ver no mapa/ })).toHaveAttribute(
      "href",
      expect.stringContaining("openstreetmap.org/?mlat=-12.9777"),
    );
  });

  it("mostra a descrição em parágrafos e os demais temas", async () => {
    await renderEvento(1);

    const sobre = screen.getByRole("region", { name: "Sobre o evento." });
    expect(within(sobre).getAllByText(/./, { selector: "p" })).toHaveLength(2);
    const temas = screen.getByRole("region", { name: "Temas." });
    expect(within(temas).getByText("mobilidade")).toBeInTheDocument();
    expect(within(temas).queryByText("Hackathon")).toBeNull();
  });

  it("em editais, mostra o prazo e fala do edital", async () => {
    await renderEvento(3);

    expect(screen.getByText("Inscrições até")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Ver o edital/ }),
    ).toBeInTheDocument();
  });

  it("sem link de inscrição, avisa em vez de mostrar o botão", async () => {
    await renderEvento(9);

    expect(screen.queryByRole("link", { name: /Fazer inscrição/ })).toBeNull();
    expect(
      screen.getByText("O link de inscrição ainda não está disponível."),
    ).toBeInTheDocument();
  });

  it("tem o caminho de volta para a lista e o aviso de exemplo", async () => {
    await renderEvento(2);

    expect(
      screen.getByRole("link", { name: /Voltar aos eventos/ }),
    ).toHaveAttribute("href", "/eventos");
    expect(
      screen
        .getAllByRole("note")
        .some((n) => /Dados de exemplo/.test(n.textContent ?? "")),
    ).toBe(true);
  });
});

describe("loader", () => {
  it("responde 404 para evento inexistente ou id inválido", async () => {
    for (const id of ["999", "abc", "0", "-1", "1.5"]) {
      await expect(loader({ params: { id } } as never)).rejects.toMatchObject({
        init: { status: 404 },
      });
    }
  });
});

describe("meta (prévia do link)", () => {
  it("tem título, descrição e Open Graph do evento", () => {
    const tags = meta({
      loaderData: { evento: evento(1), simulada: true },
    } as never);

    expect(tags).toContainEqual({
      title: "Hackathon de Mobilidade Urbana · LamiTrack",
    });
    expect(tags).toContainEqual({
      property: "og:title",
      content: "Hackathon de Mobilidade Urbana",
    });
    const descricao = tags.find(
      (t) => "name" in t && t.name === "description",
    ) as { content: string };
    expect(descricao.content).toMatch(
      /^Hackathon · 14 nov · Salvador\/BA\. Hackathon de Mobilidade Urbana é/,
    );
    expect(descricao.content.length).toBeLessThanOrEqual(160);
  });

  it("inclui og:image quando o evento tem banner", () => {
    const comBanner = { ...evento(1), bannerUrl: "https://example.com/b.jpg" };
    const tags = meta({
      loaderData: { evento: comBanner, simulada: false },
    } as never);

    expect(tags).toContainEqual({
      property: "og:image",
      content: "https://example.com/b.jpg",
    });
  });

  it("sem evento, só o título de não encontrado", () => {
    expect(meta({ loaderData: undefined } as never)).toEqual([
      { title: "Evento não encontrado · LamiTrack" },
    ]);
  });
});

describe("resumoDoEvento", () => {
  it("sem descrição, fica só a linha de categoria, data e local", () => {
    expect(resumoDoEvento({ ...evento(2), description: null })).toBe(
      "Ideathon · 21 nov · Online.",
    );
  });
});
