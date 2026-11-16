// Gera og-image.png (1200×630) a partir de assets/og-image.svg. Uso: npm run og
// O texto usa as fontes instaladas no sistema (Inter e DejaVu Sans Mono); sem elas, o sharp usa uma fonte substituta.
import { statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const origem = join(RAIZ, "assets", "og-image.svg");
const destino = join(RAIZ, "og-image.png");

const info = await sharp(origem, { density: 72 })
  .resize(1200, 630)
  .png({ compressionLevel: 9 })
  .toFile(destino);

const kb = Math.round(statSync(destino).size / 1024);
console.log(`og-image.png: ${info.width}×${info.height}, ${kb} KB`);
if (info.width !== 1200 || info.height !== 630) throw new Error("dimensões inesperadas");
if (kb >= 300) throw new Error("og-image.png passou de 300 KB");
