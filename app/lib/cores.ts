// Cores para WebGL (Grainient, globo): os shaders recebem RGB de 0 a 1, e as
// cores vêm dos tokens CSS, para não repetir hex nos componentes.

export type Rgb = [number, number, number];

// Aceita #RRGGBB e #RGB: o build minifica os tokens (#ffffff vira #fff)
export function hexToRgb(hex: string): Rgb {
  let value = hex.trim().replace(/^#/, "");
  if (/^[a-f\d]{3}$/i.test(value)) {
    value = value.replace(/./g, (digit) => digit + digit);
  }
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value);
  if (!result) return [1, 1, 1];
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
}

// Lê um token de cor (ex.: "--color-cobalt") já como RGB de 0 a 1.
// Só no cliente; sem o token, devolve null.
export function corDoToken(nome: string): Rgb | null {
  const valor = getComputedStyle(document.documentElement)
    .getPropertyValue(nome)
    .trim();
  return valor ? hexToRgb(valor) : null;
}
