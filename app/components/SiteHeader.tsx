import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router";

import "./SiteHeader.scss";

// Abaixo desta largura a nav vira menu em overlay (mesmo corte da loja)
const DESKTOP = "(min-width: 821px)";

// Header no padrão .site-header da Lamit Store: sólido em papel, sem borda,
// blur nem sombra; escudo + "LAMIT Track"; nav com sublinhado laranja.
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // Com o menu aberto: trava a rolagem, tira o resto da página do foco
  // (inert), leva o foco ao primeiro link e fecha com Esc.
  useEffect(() => {
    if (!open) return;

    const background = document.querySelectorAll<HTMLElement>(
      "#conteudo, .site-footer, .site-header__brand",
    );
    document.body.style.overflow = "hidden";
    background.forEach((element) => (element.inert = true));
    navRef.current?.querySelector("a")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    // Se a janela crescer até o desktop com o menu aberto, ele fecha
    const desktop =
      typeof window.matchMedia === "function"
        ? window.matchMedia(DESKTOP)
        : null;
    const onDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    desktop?.addEventListener("change", onDesktop);

    return () => {
      document.body.style.overflow = "";
      background.forEach((element) => (element.inert = false));
      document.removeEventListener("keydown", onKeyDown);
      desktop?.removeEventListener("change", onDesktop);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link
          to="/"
          className="site-header__brand"
          aria-label="LamiTrack, início"
        >
          <img
            src="/brand/escudo.webp"
            alt=""
            className="site-header__logo"
            width="158"
            height="192"
          />
          <span className="site-header__wordmark">
            <strong>LAMIT</strong> Track
          </span>
        </Link>
        <button
          ref={toggleRef}
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav
          ref={navRef}
          id="site-nav"
          className={open ? "site-nav is-open" : "site-nav"}
          aria-label="Principal"
        >
          <NavLink to="/" end onClick={close}>
            Eventos
          </NavLink>
          <a
            href="https://ligalamit.com.br"
            className="site-nav__external"
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
          >
            LAMIT <span aria-hidden="true">↗</span>
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
