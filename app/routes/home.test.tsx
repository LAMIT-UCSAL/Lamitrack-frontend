import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./home";

describe("Home", () => {
  it("mostra o título do LamiTrack", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { level: 1, name: "LamiTrack" }),
    ).toBeInTheDocument();
  });
});
