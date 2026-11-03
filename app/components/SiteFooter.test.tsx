import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { SiteFooter } from "./SiteFooter";

function renderFooter() {
  return render(
    <MemoryRouter>
      <SiteFooter />
    </MemoryRouter>,
  );
}

describe("SiteFooter", () => {
  it("abre com a faixa Grainient fina e a logo da LAMIT", () => {
    const { container } = renderFooter();

    expect(container.querySelector(".broadcast-band--thin")).not.toBeNull();
    expect(screen.getByRole("img", { name: "LAMIT" })).toHaveAttribute(
      "src",
      expect.stringContaining("logo-horizontal-white"),
    );
    expect(
      screen.getByText("Inovação, tecnologia e comunidade."),
    ).toBeInTheDocument();
  });

  it("lista as 4 redes da LAMIT, cada uma com nome acessível", () => {
    renderFooter();

    const redes = screen.getByRole("navigation", {
      name: "Redes sociais da LAMIT",
    });
    const links = within(redes).getAllByRole("link");
    expect(links.map((link) => link.getAttribute("aria-label"))).toEqual([
      "Linktree (abre em nova aba)",
      "Instagram (abre em nova aba)",
      "TikTok (abre em nova aba)",
      "LinkedIn (abre em nova aba)",
    ]);
    for (const link of links) {
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("tem o ecossistema LAMIT: volta ao site e vai à loja", () => {
    renderFooter();

    expect(screen.getByText("Ecossistema LAMIT")).toHaveClass(
      "site-footer__heading",
    );
    expect(screen.getByRole("link", { name: /Site da LAMIT/ })).toHaveAttribute(
      "href",
      "https://lamitsite.com.br",
    );
    expect(screen.getByRole("link", { name: /Lamit Store/ })).toHaveAttribute(
      "href",
      "https://lamitstore.netlify.app/",
    );
  });

  it("tem o link de Eventos, o contato e a assinatura", () => {
    renderFooter();

    expect(screen.getByRole("link", { name: "Eventos" })).toHaveAttribute(
      "href",
      "/eventos",
    );
    expect(
      screen.getByRole("link", { name: "contato.lamit@gmail.com" }),
    ).toHaveAttribute("href", "mailto:contato.lamit@gmail.com");
    expect(screen.getByText("© 2026 LAMIT")).toBeInTheDocument();
    expect(screen.getByText("Não espere, construa.")).toBeInTheDocument();
  });
});
