// Build do site estático. A saída é gravada na raiz do repositório, que o GitHub Pages publica.
// - pré-renderiza no index.html os projetos em destaque e as tecnologias (texto visível sem JavaScript)
// - gera /artigos/ e /artigos/<slug>/ a partir de content/artigos/*.md
// - gera sitemap.xml com todas as páginas públicas
// Os rascunhos em content/rascunhos/ NÃO são lidos por este script.
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { marked } from "marked";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://go-lissandro.github.io";
const AUTOR = "Lissandro Rocha";
const PASTA_ARTIGOS = join(RAIZ, "content", "artigos");
const SAIDA_ARTIGOS = join(RAIZ, "artigos"); // pasta 100% gerada: é apagada e recriada a cada build

const ler = (p) => readFileSync(join(RAIZ, p), "utf8");
const hoje = () => new Date().toISOString().slice(0, 10);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const dataBR = (iso) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });

// ---------- Home ----------

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

function preRenderizarHome() {
  const ctx = contextoDoSite();
  let html = ler("index.html");
  html = injetar(html, "featured", vm.runInContext("htmlDestaques()", ctx));
  html = injetar(html, "skills", vm.runInContext("htmlSkills()", ctx));
  writeFileSync(join(RAIZ, "index.html"), html);
  console.log("index.html: destaques e tecnologias pré-renderizados");
}

// ---------- Artigos ----------

// Front matter simples: linhas "chave: valor" entre dois "---"
function lerFrontMatter(texto, arquivo) {
  const m = texto.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error(`${arquivo}: front matter ausente`);
  const dados = {};
  for (const linha of m[1].split(/\r?\n/)) {
    const kv = linha.match(/^([\w-]+):\s*(.*)$/);
    if (kv) dados[kv[1]] = kv[2].trim().replace(/^(["'])(.*)\1$/, "$2");
  }
  return { dados, corpo: m[2] };
}

function lerArtigos() {
  if (!existsSync(PASTA_ARTIGOS)) return [];
  return readdirSync(PASTA_ARTIGOS)
    .filter((f) => f.endsWith(".md"))
    .map((arquivo) => {
      const { dados, corpo } = lerFrontMatter(readFileSync(join(PASTA_ARTIGOS, arquivo), "utf8"), arquivo);
      for (const campo of ["titulo", "descricao", "data"]) {
        if (!dados[campo]) throw new Error(`${arquivo}: campo "${campo}" obrigatório no front matter`);
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dados.data)) throw new Error(`${arquivo}: "data" deve estar no formato AAAA-MM-DD`);
      const slug = arquivo.replace(/\.md$/, "");
      return {
        slug,
        titulo: dados.titulo,
        descricao: dados.descricao,
        data: dados.data,
        atualizado: dados.atualizado || dados.data,
        caminho: `/artigos/${slug}/`,
        html: marked.parse(corpo),
      };
    })
    .sort((a, b) => b.data.localeCompare(a.data));
}

// Layout comum às páginas de artigos (mesmo cabeçalho, rodapé e estilos da home)
function layout({ titulo, descricao, caminho, tipo = "website", extrasHead = "", conteudo }) {
  const url = SITE + caminho;
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(titulo)}</title>
  <meta name="description" content="${esc(descricao)}">
  <link rel="canonical" href="${esc(url)}">
  <meta name="author" content="${AUTOR}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <meta name="theme-color" content="#0b0d14">
  <meta property="og:type" content="${tipo}">
  <meta property="og:site_name" content="${AUTOR}">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:url" content="${esc(url)}">
  <meta property="og:title" content="${esc(titulo)}">
  <meta property="og:description" content="${esc(descricao)}">
  <meta property="og:image" content="${SITE}/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(titulo)}">
  <meta name="twitter:description" content="${esc(descricao)}">
  <meta name="twitter:image" content="${SITE}/og-image.png">
${extrasHead}  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <div class="bg-glow" aria-hidden="true"></div>

  <header class="nav">
    <a href="/" class="brand"><span class="brand-mark">&lt;/&gt;</span> lissandro<span class="accent">.dev</span></a>
    <button class="menu-btn" aria-label="Abrir menu" aria-expanded="false">☰</button>
    <nav class="nav-links">
      <a href="/#inicio">Início</a>
      <a href="/#sobre">Sobre</a>
      <a href="/#projetos">Projetos</a>
      <a href="/artigos/" class="active">Artigos</a>
      <a href="/#contato">Contato</a>
    </nav>
  </header>

  <main>
${conteudo}
  </main>

  <footer class="footer">
    <p>© ${new Date().getFullYear()} Lissandro Miranda Rocha · <a href="https://github.com/go-lissandro" rel="me noopener">GitHub</a> · <a href="https://www.linkedin.com/in/lissandro-miranda-rocha" rel="me noopener">LinkedIn</a></p>
  </footer>

  <script>
    document.querySelector(".menu-btn").addEventListener("click", () => {
      const aberto = document.querySelector(".nav-links").classList.toggle("open");
      document.querySelector(".menu-btn").setAttribute("aria-expanded", String(aberto));
    });
  </script>
</body>
</html>
`;
}

const jsonLd = (obj) => `  <script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n  </script>\n`;
const pessoa = { "@type": "Person", name: AUTOR, alternateName: "Lissandro Miranda Rocha", url: `${SITE}/` };

function paginaLista(artigos) {
  const itens = artigos.length
    ? `<ul class="post-list">
${artigos.map((a) => `        <li class="card post-item">
          <time class="mono small muted" datetime="${a.data}">${dataBR(a.data)}</time>
          <h2><a href="${a.caminho}">${esc(a.titulo)}</a></h2>
          <p class="muted">${esc(a.descricao)}</p>
        </li>`).join("\n")}
      </ul>`
    : `<p class="card post-empty muted">Nenhum artigo publicado ainda. Em breve, textos sobre Node.js, NestJS, Next.js, Java e infraestrutura.</p>`;
  return layout({
    titulo: `Artigos — ${AUTOR}`,
    descricao: "Artigos técnicos de Lissandro Rocha, desenvolvedor full stack: Node.js, NestJS, Next.js, Java, IA local e infraestrutura.",
    caminho: "/artigos/",
    conteudo: `    <section class="page">
      <div class="page-title">
        <p class="eyebrow mono">// artigos</p>
        <h1>Artigos <span class="grad">técnicos</span></h1>
        <p class="muted">O que estou construindo e aprendendo no desenvolvimento full stack.</p>
      </div>
      ${itens}
    </section>`,
  });
}

function paginaArtigo(a) {
  const ld = jsonLd({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.titulo,
    description: a.descricao,
    datePublished: a.data,
    dateModified: a.atualizado,
    inLanguage: "pt-BR",
    mainEntityOfPage: SITE + a.caminho,
    image: `${SITE}/og-image.png`,
    author: pessoa,
  });
  const extras = `  <meta property="article:published_time" content="${a.data}">
  <meta property="article:modified_time" content="${a.atualizado}">
  <meta property="article:author" content="${SITE}/">
${ld}`;
  return layout({
    titulo: `${a.titulo} — ${AUTOR}`,
    descricao: a.descricao,
    caminho: a.caminho,
    tipo: "article",
    extrasHead: extras,
    conteudo: `    <article class="page post">
      <p class="eyebrow mono"><a href="/artigos/">← artigos</a></p>
      <h1>${esc(a.titulo)}</h1>
      <p class="muted post-meta">Por <a href="/" rel="author">${AUTOR}</a> · <time datetime="${a.data}">${dataBR(a.data)}</time></p>
      <div class="prose">
${a.html}
      </div>
    </article>`,
  });
}

function gerarArtigos() {
  const artigos = lerArtigos();
  rmSync(SAIDA_ARTIGOS, { recursive: true, force: true });
  mkdirSync(SAIDA_ARTIGOS, { recursive: true });
  writeFileSync(join(SAIDA_ARTIGOS, "index.html"), paginaLista(artigos));
  for (const a of artigos) {
    mkdirSync(join(SAIDA_ARTIGOS, a.slug), { recursive: true });
    writeFileSync(join(SAIDA_ARTIGOS, a.slug, "index.html"), paginaArtigo(a));
  }
  console.log(`artigos/: ${artigos.length} artigo(s) publicado(s)`);
  return artigos;
}

// ---------- Sitemap ----------

function gerarSitemap(paginas) {
  const urls = paginas.map((p) => `  <url>\n    <loc>${esc(SITE + p.caminho)}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n  </url>`);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
  writeFileSync(join(RAIZ, "sitemap.xml"), xml);
  console.log(`sitemap.xml: ${paginas.length} página(s)`);
}

preRenderizarHome();
const artigos = gerarArtigos();
gerarSitemap([
  { caminho: "/", lastmod: hoje() },
  { caminho: "/artigos/", lastmod: artigos[0]?.atualizado || hoje() },
  ...artigos.map((a) => ({ caminho: a.caminho, lastmod: a.atualizado })),
]);
