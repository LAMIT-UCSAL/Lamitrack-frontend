import type { Route } from "./+types/home";

export const meta: Route.MetaFunction = () => [
  { title: "LamiTrack" },
  {
    name: "description",
    content: "Vitrine de eventos de tecnologia e inovação da LAMIT.",
  },
];

// As 5 categorias válidas de evento e a classe de badge de cada uma.
// Provisório: a função utilitária categoria → badge é a issue #18.
const CATEGORIAS = [
  { nome: "Hackathon", classe: "badge-cat-hackathon" },
  { nome: "Ideathon", classe: "badge-cat-ideathon" },
  { nome: "Maratona", classe: "badge-cat-maratona" },
  { nome: "Edital", classe: "badge-cat-edital" },
  { nome: "Eventos de Inovação", classe: "badge-cat-eventos-de-inovacao" },
];

// Página provisória que mostra os estilos base portados do EVE.
// Será substituída pela tela Home (#20).
export default function Home() {
  return (
    <main className="container py-5">
      <h1 className="fw-bold text-eve-navy">LamiTrack</h1>
      <p className="text-eve-secondary mb-4">
        Vitrine de eventos de tecnologia e inovação da LAMIT. Esta é uma página
        provisória com a prévia dos estilos base.
      </p>

      <section
        className="eve-card eve-card-hover p-4"
        aria-labelledby="titulo-categorias"
      >
        <h2 id="titulo-categorias" className="h5 fw-semibold">
          Categorias de evento
        </h2>
        <ul className="list-unstyled d-flex flex-wrap gap-2 my-3">
          {CATEGORIAS.map((categoria) => (
            <li key={categoria.nome}>
              <span className={`badge-cat ${categoria.classe}`}>
                {categoria.nome}
              </span>
            </li>
          ))}
          <li>
            <span className="badge-free">Gratuito</span>
          </li>
        </ul>
        <div className="d-flex flex-wrap gap-2">
          <button type="button" className="btn btn-eve-primary">
            Botão primário
          </button>
          <button type="button" className="btn btn-eve-outline">
            Botão secundário
          </button>
        </div>
      </section>
    </main>
  );
}
