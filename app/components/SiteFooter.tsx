import { Link } from "react-router";

import { BroadcastBand } from "./BroadcastBand";
import "./SiteFooter.scss";

const REDES = [
  {
    nome: "Linktree",
    href: "https://linktr.ee/lamit.ucsal",
    icone: "link.png",
  },
  {
    nome: "Instagram",
    href: "https://www.instagram.com/lamit.ucsal",
    icone: "instagram.png",
  },
  {
    nome: "TikTok",
    href: "https://www.tiktok.com/@lamit.ucsal",
    icone: "tiktokicon.png",
  },
  {
    nome: "LinkedIn",
    href: "https://www.linkedin.com/company/lamit-ucsal/",
    icone: "linkedin.png",
  },
];

// Rodapé de ecossistema (padrão partials/footer.html + .site-footer da loja):
// faixa Grainient fina no topo, logo branca, redes e o caminho de volta à LAMIT.
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <BroadcastBand variant="thin" />
      <div className="site-footer__inner page-container">
        <div>
          <img
            src="/brand/logo-horizontal-white.svg"
            alt="LAMIT"
            className="site-footer__logo"
            width="135"
            height="64"
            loading="lazy"
          />
          <p className="site-footer__tagline">
            Inovação, tecnologia e comunidade.
          </p>
          <nav
            className="site-footer__social"
            aria-label="Redes sociais da LAMIT"
          >
            {REDES.map((rede) => (
              <a
                key={rede.nome}
                href={rede.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${rede.nome} (abre em nova aba)`}
              >
                <img
                  src={`/icons/${rede.icone}`}
                  alt=""
                  width="20"
                  height="20"
                  loading="lazy"
                />
              </a>
            ))}
          </nav>
        </div>
        <div>
          <p className="site-footer__heading">LamiTrack</p>
          <ul className="site-footer__links">
            <li>
              <Link to="/">Eventos</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="site-footer__heading">Contato</p>
          <ul className="site-footer__links">
            <li>
              <a href="mailto:contato.lamit@gmail.com">
                contato.lamit@gmail.com
              </a>
            </li>
            <li>
              <a
                href="https://ligalamit.com.br"
                target="_blank"
                rel="noopener noreferrer"
              >
                ligalamit.com.br <span aria-hidden="true">↗</span>
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="page-container site-footer__legal">
        <span className="site-footer__year">© 2026 LAMIT</span>
        <span className="site-footer__credits">Não espere, construa.</span>
      </div>
    </footer>
  );
}
