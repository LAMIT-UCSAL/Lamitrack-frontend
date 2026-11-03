import { useState } from "react";

import { Button } from "~/components/Button";
import { CategoryTabs } from "~/components/CategoryTabs";
import { Kicker } from "~/components/Kicker";
import { CATEGORIAS } from "~/lib/categorias";

import type { Route } from "./+types/home";

export const meta: Route.MetaFunction = () => [
  { title: "LamiTrack" },
  {
    name: "description",
    content: "Vitrine de eventos de tecnologia e inovação da LAMIT.",
  },
];

const FILTROS = ["Todos", ...CATEGORIAS];

// Página provisória que mostra os estilos base da LAMIT.
// Será substituída pela tela Home (#20).
export default function Home() {
  const [filtro, setFiltro] = useState<string>("Todos");

  return (
    <main id="conteudo" className="container py-5">
      <Kicker>Vitrine de eventos.</Kicker>
      <h1 className="mt-3">LamiTrack</h1>
      <p className="mb-4">
        Vitrine de eventos de tecnologia e inovação da LAMIT. Esta é uma página
        provisória com a prévia dos estilos base.
      </p>

      <section aria-labelledby="titulo-categorias">
        <h2 id="titulo-categorias" className="h5">
          Categorias de evento
        </h2>
        <CategoryTabs
          options={FILTROS}
          active={filtro}
          onChange={setFiltro}
          label="Filtrar por categoria"
        />
        <div className="d-flex flex-wrap gap-2 mt-4">
          <Button>Botão primário</Button>
          <Button variant="secondary">Botão secundário</Button>
        </div>
      </section>
    </main>
  );
}
