import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { ErrorBoundary } from "./root";

function renderErro(error: unknown) {
  return render(
    <MemoryRouter>
      <ErrorBoundary {...({ error } as never)} />
    </MemoryRouter>,
  );
}

// Formato de um erro de rota (o que isRouteErrorResponse reconhece)
const erroDeRota = (status: number, statusText = "") => ({
  status,
  statusText,
  internal: false,
  data: "",
});

describe("ErrorBoundary", () => {
  it("404: título da aba, mensagem e caminhos de volta", async () => {
    renderErro(erroDeRota(404, "Not Found"));

    expect(
      screen.getByRole("heading", { level: 1, name: "Página não encontrada." }),
    ).toBeInTheDocument();
    expect(screen.getByText("Erro 404.")).toHaveClass("kicker");
    expect(screen.getByRole("link", { name: /Ver eventos/ })).toHaveAttribute(
      "href",
      "/eventos",
    );
    expect(
      screen.getByRole("link", { name: "Ir para o início" }),
    ).toHaveAttribute("href", "/");
    await waitFor(() =>
      expect(document.title).toBe("Página não encontrada · LamiTrack"),
    );
  });

  it("outros erros de rota mostram o status", () => {
    renderErro(erroDeRota(503, "Serviço indisponível"));

    expect(screen.getByText("Erro 503.")).toBeInTheDocument();
    expect(screen.getByText("Serviço indisponível")).toBeInTheDocument();
  });

  it("erro inesperado tem mensagem genérica e um único CTA primário", () => {
    const { container } = renderErro(new Error("falhou"));

    expect(
      screen.getByRole("heading", { level: 1, name: "Algo deu errado." }),
    ).toBeInTheDocument();
    expect(container.querySelectorAll(".button--primary")).toHaveLength(1);
  });
});
