import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./Button";

describe("Button", () => {
  it("sem href, é um <button type=button> primário com seta", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Ver eventos</Button>);

    const botao = screen.getByRole("button", { name: /Ver eventos/ });
    expect(botao).toHaveAttribute("type", "button");
    expect(botao).toHaveClass("button", "button--primary");
    expect(botao.querySelector(".button__arrow")).toHaveAttribute(
      "aria-hidden",
      "true",
    );

    fireEvent.click(botao);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("com href, é um link", () => {
    render(<Button href="/eventos">Agenda</Button>);

    expect(screen.getByRole("link", { name: /Agenda/ })).toHaveAttribute(
      "href",
      "/eventos",
    );
  });

  it("o secundário não tem seta por padrão", () => {
    render(<Button variant="secondary">Saiba mais</Button>);

    const botao = screen.getByRole("button", { name: "Saiba mais" });
    expect(botao).toHaveClass("button--secondary");
    expect(botao.querySelector(".button__arrow")).toBeNull();
  });

  it("a seta pode ser ligada ou desligada", () => {
    render(
      <>
        <Button arrow={false}>Sem seta</Button>
        <Button variant="secondary" arrow>
          Com seta
        </Button>
      </>,
    );

    expect(
      screen
        .getByRole("button", { name: "Sem seta" })
        .querySelector(".button__arrow"),
    ).toBeNull();
    expect(
      screen
        .getByRole("button", { name: /Com seta/ })
        .querySelector(".button__arrow"),
    ).not.toBeNull();
  });
});
