// Build do site estático. A saída é gravada na raiz do repositório, que o GitHub Pages publica.
// - pré-renderiza no index.html os projetos em destaque e as tecnologias (texto visível sem JavaScript)
// - gera sitemap.xml com todas as páginas públicas
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const ler = (p) => readFileSync(join(RAIZ, p), "utf8");

// Carrega data.js e script.js num contexto isolado para reaproveitar as mesmas funções do navegador
function contextoDoSite() {
  const ctx = vm.createContext({ window: {}, document: { addEventListener() {} }, console });
  vm.runInContext(ler("data.js"), ctx, { filename: "data.js" });
  vm.runInContext(ler("script.js"), ctx, { filename: "script.js" });
  return ctx;
}

// Substitui o conteúdo entre <!-- build:nome --> e <!-- /build:nome -->
function injetar(html, nome, conteudo) {
  const re = new RegExp(`(<!-- build:${nome} -->)[\\s\\S]*?(<!-- /build:${nome} -->)`);
  if (!re.test(html)) throw new Error(`marcador build:${nome} não encontrado`);
  return html.replace(re, (_, a, b) => `${a}${conteudo}${b}`);
}

export function preRenderizarHome() {
  const ctx = contextoDoSite();
  let html = ler("index.html");
  html = injetar(html, "featured", vm.runInContext("htmlDestaques()", ctx));
  html = injetar(html, "skills", vm.runInContext("htmlSkills()", ctx));
  writeFileSync(join(RAIZ, "index.html"), html);
  console.log("index.html: destaques e tecnologias pré-renderizados");
}

export const SITE = "https://go-lissandro.github.io";
const hoje = () => new Date().toISOString().slice(0, 10);
const escXml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]));

// paginas: [{ caminho: "/", lastmod: "AAAA-MM-DD" }]
export function gerarSitemap(paginas) {
  const urls = paginas.map((p) => `  <url>\n    <loc>${escXml(SITE + p.caminho)}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n  </url>`);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
  writeFileSync(join(RAIZ, "sitemap.xml"), xml);
  console.log(`sitemap.xml: ${paginas.length} página(s)`);
}

preRenderizarHome();
gerarSitemap([{ caminho: "/", lastmod: hoje() }]);
