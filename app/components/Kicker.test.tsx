import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Kicker } from "./Kicker";

describe("Kicker", () => {
  it("renderiza o texto com a classe kicker", () => {
    render(<Kicker>Lamit em competição.</Kicker>);

    expect(screen.getByText("Lamit em competição.")).toHaveClass("kicker");
  });

  it("aceita uma classe extra", () => {
    render(<Kicker className="mb-3">Agenda.</Kicker>);

    expect(screen.getByText("Agenda.")).toHaveClass("kicker", "mb-3");
  });
});
