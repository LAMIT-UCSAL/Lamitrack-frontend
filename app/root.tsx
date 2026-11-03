import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
// Estilos globais primeiro: o CSS dos componentes vem depois e prevalece
import "./styles/app.scss";

import favicon from "./assets/brand/favicon.png";
import { Button } from "./components/Button";
import { Kicker } from "./components/Kicker";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/png", href: favicon },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

// Página de erro (404 e falhas inesperadas), na identidade LAMIT e com
// caminho de volta. O <title> o React leva para o <head>.
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let kicker = "Erro.";
  let titulo = "Algo deu errado.";
  let detalhes = "Aconteceu um erro inesperado. Tente de novo em instantes.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error) && error.status === 404) {
    kicker = "Erro 404.";
    titulo = "Página não encontrada.";
    detalhes = "O endereço pode ter mudado, ou o evento saiu da agenda.";
  } else if (isRouteErrorResponse(error)) {
    kicker = `Erro ${error.status}.`;
    detalhes = error.statusText || detalhes;
  } else if (import.meta.env.DEV && error instanceof Error) {
    detalhes = error.message;
    stack = error.stack;
  }

  return (
    <main id="conteudo" className="erro page-container">
      <title>{`${titulo.replace(/\.$/, "")} · LamiTrack`}</title>
      <Kicker>{kicker}</Kicker>
      <h1>{titulo}</h1>
      <p className="erro__texto">{detalhes}</p>
      <div className="erro__acoes">
        <Button href="/eventos">Ver eventos</Button>
        <Button variant="secondary" href="/">
          Ir para o início
        </Button>
      </div>
      {stack && (
        <pre className="erro__stack">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
