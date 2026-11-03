// Auditoria de acessibilidade e responsivo (issue #6).
// Uso: com o app rodando (npm run build && npm start), rode
//   npm run test:a11y            (usa http://localhost:3000)
//   BASE_URL=http://localhost:5173 npm run test:a11y
// Falha (código 1) se o axe achar problema sério ou crítico, se alguma tela
// rolar para o lado ou se algum alvo de toque ficar abaixo de 44px.

import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

const TELAS = [
  ["home", "/"],
  ["lista", "/eventos"],
  ["lista filtrada vazia", "/eventos?cidade=Ilh%C3%A9us"],
  ["detalhe", "/eventos/1"],
  ["detalhe de edital", "/eventos/3"],
  ["404", "/pagina-que-nao-existe"],
];

const LARGURAS = [320, 375, 768, 1440];

// WCAG 2.2 A e AA, mais boas práticas
const REGRAS = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
  "best-practice",
];

// Alvos de toque: o projeto usa 44px (DESIGN.md). Ignora links dentro de
// texto corrido, que o WCAG 2.5.8 dispensa.
function alvosPequenos() {
  const pequenos = [];
  for (const el of document.querySelectorAll(
    "a[href], button, input, select, textarea, [role=button]",
  )) {
    const r = el.getBoundingClientRect();
    const estilo = getComputedStyle(el);
    if (r.width === 0 || estilo.visibility === "hidden") continue;
    if (el.closest("[inert], [aria-hidden=true]")) continue;
    if (el.closest("p") && estilo.display === "inline") continue;
    if (el.classList.contains("skip-link")) continue;
    // Link esticado do card: a área real é o card inteiro
    if (el.matches(".event-card__link, .event-carousel__link")) continue;
    if (r.height < 44 || r.width < 24) {
      pequenos.push(
        `${el.tagName.toLowerCase()}.${el.className || "-"} "${(el.textContent ?? "").trim().slice(0, 30)}" ${Math.round(r.width)}×${Math.round(r.height)}`,
      );
    }
  }
  return pequenos;
}

const navegador = await chromium.launch();
let problemas = 0;

for (const largura of LARGURAS) {
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: 900 },
  });
  const pagina = await contexto.newPage();

  for (const [nome, caminho] of TELAS) {
    await pagina.goto(BASE_URL + caminho, { waitUntil: "load" });
    await pagina.waitForTimeout(400);

    const resultado = await new AxeBuilder({ page: pagina })
      .withTags(REGRAS)
      .analyze();
    const graves = resultado.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact ?? ""),
    );
    const leves = resultado.violations.filter((v) => !graves.includes(v));
    const rolaParaOLado = await pagina.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    const pequenos = await pagina.evaluate(alvosPequenos);

    const ok = !graves.length && !rolaParaOLado && !pequenos.length;
    console.log(`${ok ? "✓" : "✗"} ${largura}px · ${nome} (${caminho})`);
    for (const v of graves) {
      console.log(`    [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length})`);
      for (const n of v.nodes.slice(0, 3)) {
        console.log(`        ${n.target.join(" ")}`);
      }
    }
    for (const v of leves) {
      console.log(`    (aviso, ${v.impact}) ${v.id}: ${v.help}`);
    }
    if (rolaParaOLado) console.log("    rolagem horizontal na página");
    for (const p of pequenos) console.log(`    alvo pequeno: ${p}`);
    if (!ok) problemas += 1;
  }
  await contexto.close();
}

await navegador.close();
console.log(
  problemas
    ? `\n${problemas} combinação(ões) tela × largura com problema.`
    : "\nNenhum problema encontrado.",
);
process.exit(problemas ? 1 : 0);
