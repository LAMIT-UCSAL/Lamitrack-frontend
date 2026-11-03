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

  it("leva ao site da LAMIT e à loja, em nova aba e com segurança", () => {
    renderHeader();

    const site = screen.getByRole("link", { name: /site da LAMIT/ });
    expect(site).toHaveAttribute("href", "https://lamitsite.com.br");
    const loja = screen.getByRole("link", { name: /Shop.*Lamit Store/ });
    expect(loja).toHaveAttribute("href", "https://lamitstore.netlify.app/");
    for (const link of [site, loja]) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("a nav segue a ordem do site: Eventos, Shop, LAMIT", () => {
    renderHeader();

    const nav = screen.getByRole("navigation", { name: "Principal" });
    expect(
      Array.from(nav.querySelectorAll("a")).map((a) =>
        a.textContent?.replace(/\s*↗.*$/, ""),
      ),
    ).toEqual(["Eventos", "Shop", "LAMIT"]);
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
