import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CategoryTabs } from "./CategoryTabs";

const OPCOES = ["Todos", "Hackathon", "Ideathon"];

describe("CategoryTabs", () => {
  it("agrupa os botões com o rótulo dado", () => {
    render(
      <CategoryTabs
        options={OPCOES}
        active="Todos"
        onChange={() => {}}
        label="Filtrar por categoria"
      />,
    );

    const grupo = screen.getByRole("group", { name: "Filtrar por categoria" });
    expect(grupo).toHaveClass("category-tabs");
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("marca só o item ativo com aria-pressed e is-active", () => {
    render(
      <CategoryTabs
        options={OPCOES}
        active="Hackathon"
        onChange={() => {}}
        label="Filtro"
      />,
    );

    const ativo = screen.getByRole("button", { name: "Hackathon" });
    expect(ativo).toHaveAttribute("aria-pressed", "true");
    expect(ativo).toHaveClass("is-active");
    expect(screen.getByRole("button", { name: "Todos" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("avisa a opção clicada", () => {
    const onChange = vi.fn();
    render(
      <CategoryTabs
        options={OPCOES}
        active="Todos"
        onChange={onChange}
        label="Filtro"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Ideathon" }));
    expect(onChange).toHaveBeenCalledWith("Ideathon");
  });
});
