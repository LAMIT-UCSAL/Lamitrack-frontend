import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { SiteHeader } from "./SiteHeader";

function renderHeader(caminho = "/") {
  return render(
    <MemoryRouter initialEntries={[caminho]}>
      <SiteHeader />
      <main id="conteudo">Conteúdo</main>
    </MemoryRouter>,
  );
}

describe("SiteHeader", () => {
  it("mostra a marca LAMIT Track com link para o início", () => {
    renderHeader();

    const marca = screen.getByRole("link", { name: "LAMIT Track, início" });
    expect(marca).toHaveAttribute("href", "/");
    expect(marca).toHaveTextContent("LAMIT Track");
  });

  it("Eventos leva à lista e fica marcado como página atual nela", () => {
    renderHeader("/eventos");

    const eventos = screen.getByRole("link", { name: "Eventos" });
    expect(eventos).toHaveAttribute("href", "/eventos");
    expect(eventos).toHaveAttribute("aria-current", "page");
  });

  it("na home, Eventos não fica marcado", () => {
    renderHeader("/");

    expect(screen.getByRole("link", { name: "Eventos" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("o link da LAMIT abre em nova aba com segurança", () => {
    renderHeader();

    const lamit = screen.getByRole("link", { name: /LAMIT.*nova aba/ });
    expect(lamit).toHaveAttribute("href", "https://lamitsite.com.br");
    expect(lamit).toHaveAttribute("target", "_blank");
    expect(lamit).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("abre e fecha o menu, travando a página por trás", () => {
    renderHeader();

    const botao = screen.getByRole("button", { name: "Abrir menu" });
    expect(botao).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(botao);
    expect(botao).toHaveAttribute("aria-expanded", "true");
    expect(botao).toHaveAccessibleName("Fechar menu");
    expect(screen.getByRole("navigation", { name: "Principal" })).toHaveClass(
      "is-open",
    );
    expect(screen.getByRole("link", { name: "Eventos" })).toHaveFocus();
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.getElementById("conteudo")?.inert).toBe(true);

    fireEvent.click(botao);
    expect(botao).toHaveAttribute("aria-expanded", "false");
    expect(document.body.style.overflow).toBe("");
    expect(document.getElementById("conteudo")?.inert).toBe(false);
  });

  it("Esc fecha o menu e devolve o foco ao botão", () => {
    renderHeader();

    const botao = screen.getByRole("button", { name: "Abrir menu" });
    fireEvent.click(botao);
    fireEvent.keyDown(document, { key: "Escape" });

    expect(botao).toHaveAttribute("aria-expanded", "false");
    expect(botao).toHaveFocus();
  });

  it("clicar num link fecha o menu", () => {
    renderHeader();

    const botao = screen.getByRole("button", { name: "Abrir menu" });
    fireEvent.click(botao);
    fireEvent.click(screen.getByRole("link", { name: "Eventos" }));

    expect(botao).toHaveAttribute("aria-expanded", "false");
  });
});
