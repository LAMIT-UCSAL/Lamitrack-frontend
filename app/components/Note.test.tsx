import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Note } from "./Note";

describe("Note", () => {
  it("é uma nota por padrão", () => {
    render(<Note>Dados de exemplo.</Note>);

    expect(screen.getByRole("note")).toHaveClass("note");
  });

  it("pode anunciar como status", () => {
    render(<Note role="status">Nenhum evento.</Note>);

    expect(screen.getByRole("status")).toHaveTextContent("Nenhum evento.");
  });
});
