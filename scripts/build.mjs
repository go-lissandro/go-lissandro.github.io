// Build do site estático. A saída é gravada na raiz do repositório, que o GitHub Pages publica.
// - pré-renderiza no index.html os projetos em destaque e as tecnologias (texto visível sem JavaScript)
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

preRenderizarHome();
