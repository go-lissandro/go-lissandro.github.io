// Repositório deste site (fica de fora da lista de projetos)
const SITE_REPO = "go-lissandro.github.io";

// Minhas contas pessoais no GitHub, em ordem cronológica (dados em data.js)
const ACCOUNTS = window.ACCOUNTS || [{ login: "lissandrojs", label: "Conta principal", period: "", about: "", main: true }];
const MAIN_ACCOUNT = (ACCOUNTS.find((a) => a.main) || ACCOUNTS[0]).login;
const ownerOf = (r) => r.owner?.login ?? r.owner ?? MAIN_ACCOUNT;

// Descrições para repositórios que estão sem descrição no GitHub
const DESCRICOES = {
  "impressora3d": "Análise de mercado, planilha de preços e anúncios para um negócio de impressão 3D.",
  "vitrini": "Página de vitrine em HTML.",
  "estudo-sheetcoin": "Estudo em Java.",
  "pratica-java-basico": "Exercícios de fundamentos da linguagem Java.",
  "monero-studing": "Estudos sobre a criptomoeda Monero com Python.",
  "util_ferramentas": "Coleção de ferramentas utilitárias em TypeScript.",
  "bank_fast_api": "API bancária construída com FastAPI.",
  "testTecnicoProjeto": "Projeto desenvolvido para teste técnico.",
  "cade-meu-pix-front": "Frontend do Cadê Meu Pix, aplicação de controle de cobrança.",
  "plataformEnglishFront": "Frontend de uma plataforma de ensino de inglês.",
  "plataformEnglish": "Plataforma de ensino de inglês.",
  "praticas_fast_api": "Práticas e exemplos com o framework FastAPI.",
};

// Destaques da página inicial: "conta/repositório"
const DESTAQUES = [
  "go-lissandro/cade-meu-pix", "go-lissandro/nexus_learn", "lissandrojs/baseApiNestJS",
  "go-lissandro/baseApi", "lissandrojs/api-rest-envio-wpp", "lissandrojs/teste-tecnico-Bloxs-gestao-de-investimentos",
];

// Projetos sem repositório público ainda, mostrados no início dos destaques
const EM_DESENVOLVIMENTO = [
  { nome: "JobRadar", descricao: "Agregador de vagas com IA local: reúne vagas de várias fontes e ajuda a filtrar as que combinam com o perfil.", tags: ["TypeScript", "IA local"] },
];

const CORES = {
  Go: "#00ADD8", Python: "#3572A5", TypeScript: "#3178c6", JavaScript: "#f1e05a",
  Java: "#b07219", HTML: "#e34c26", Shell: "#89e051", PHP: "#4F5D95", CSS: "#563d7c",
  "C++": "#f34b7d", Makefile: "#427819", Outros: "#6e7681",
};

const SKILLS = ["JavaScript", "TypeScript", "Node.js", "NestJS", "Next.js", "React", "Java", "Spring Boot",
  "Python", "FastAPI", "Go", "Fiber", "GORM", "Docker", "Nginx", "Git", "Linux", "IA / NotebookLM", "Segurança"];

let repos = (window.REPOS_SNAPSHOT || []).slice();
let filtroLang = "Todos";
let filtroConta = "Todas";
let ordem = "recentes"; // recentes | cronologica

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const nomeBonito = (n) => n.replace(/[-_]/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2");
const dataBR = (iso) => new Date(iso).toLocaleDateString("pt-BR", { month: "short", year: "numeric" });

function cardProjeto(r) {
  const lang = r.language || "Outros";
  const desc = r.description || (ownerOf(r) === "go-lissandro" && DESCRICOES[r.name]) || "Projeto pessoal.";
  const demo = r.homepage ? `<a href="${esc(r.homepage)}" target="_blank" rel="noopener">Demo ↗</a>` : "";
  return `
    <article class="card project">
      <div class="project-top">
        <span class="folder">📁</span>
        <div class="project-links">${demo}<a href="${esc(r.html_url)}" target="_blank" rel="noopener">Código ↗</a></div>
      </div>
      <h3>${esc(nomeBonito(r.name))}</h3>
      <span class="account-tag mono${ownerOf(r) === MAIN_ACCOUNT ? " main" : ""}">@${esc(ownerOf(r))}</span>
      <p>${esc(desc)}</p>
      <div class="project-meta">
        <span class="tag"><span class="lang-dot" style="background:${CORES[lang] || CORES.Outros}"></span>${esc(lang)}</span>
        ${r.stargazers_count ? `<span>★ ${r.stargazers_count}</span>` : ""}
        ${r.forks_count ? `<span>⑂ ${r.forks_count}</span>` : ""}
        <span>Atualizado em ${dataBR(r.pushed_at)}</span>
      </div>
    </article>`;
}

function cardEmDesenvolvimento(p) {
  return `
    <article class="card project wip">
      <div class="project-top">
        <span class="folder">🚧</span>
        <span class="wip-tag mono">em desenvolvimento</span>
      </div>
      <h3>${esc(p.nome)}</h3>
      <p>${esc(p.descricao)}</p>
      <div class="project-meta">${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
    </article>`;
}

// HTML dos destaques e das tecnologias (também usado por scripts/build.mjs para pré-renderizar o index.html)
function htmlDestaques() {
  const dest = DESTAQUES.map((id) => repos.find((r) => `${ownerOf(r)}/${r.name}` === id)).filter(Boolean);
  return EM_DESENVOLVIMENTO.map(cardEmDesenvolvimento).join("") + dest.map(cardProjeto).join("");
}
const htmlSkills = () => SKILLS.map((s) => `<span class="skill">${esc(s)}</span>`).join("");

function contarLinguagens() {
  const c = {};
  repos.forEach((r) => { const l = r.language || "Outros"; c[l] = (c[l] || 0) + 1; });
  return Object.entries(c).sort((a, b) => b[1] - a[1]);
}

function renderTudo() {
  // Destaques
  $("#featured").innerHTML = htmlDestaques();

  // Estatísticas
  const langs = contarLinguagens().filter(([l]) => l !== "Outros");
  const desde = repos.reduce((m, r) => (r.created_at < m ? r.created_at : m), new Date().toISOString());
  $("#stats").innerHTML = `
    <li><strong>${repos.length}</strong><span>projetos em ${ACCOUNTS.length} contas</span></li>
    <li><strong>${langs.length}</strong><span>linguagens</span></li>
    <li><strong>${new Date(desde).getFullYear()}</strong><span>no GitHub desde</span></li>`;

  // Filtros
  const opcoes = ["Todos", ...contarLinguagens().map(([l]) => l)];
  $("#filters").innerHTML = opcoes.map((l) => `<button class="chip ${l === filtroLang ? "active" : ""}" data-lang="${esc(l)}">${esc(l)}</button>`).join("");
  const contas = ["Todas", ...ACCOUNTS.map((a) => a.login)];
  $("#account-filters").innerHTML = contas.map((c) => {
    const n = c === "Todas" ? repos.length : repos.filter((r) => ownerOf(r) === c).length;
    return `<button class="chip ${c === filtroConta ? "active" : ""}" data-conta="${esc(c)}">${c === "Todas" ? "Todas as contas" : "@" + esc(c)} <span class="muted">${n}</span></button>`;
  }).join("");
  renderProjetos();
  renderContas();

  // Barra de linguagens
  const total = repos.length || 1;
  const lc = contarLinguagens();
  $("#lang-bar").innerHTML = lc.map(([l, n]) => `<span title="${esc(l)}" style="flex:${n};background:${CORES[l] || CORES.Outros}"></span>`).join("");
  $("#lang-legend").innerHTML = lc.map(([l, n]) => `<li><span class="lang-dot" style="background:${CORES[l] || CORES.Outros}"></span>${esc(l)} <span class="muted">${Math.round((n / total) * 100)}%</span></li>`).join("");

  // Linha do tempo: projetos agrupados pelo ano em que foram criados
  const porData = repos.slice().sort((a, b) => a.created_at.localeCompare(b.created_at));
  const grupos = new Map();
  porData.forEach((r) => {
    const k = r.created_at.slice(0, 4);
    if (!grupos.has(k)) grupos.set(k, []);
    grupos.get(k).push(r);
  });
  $("#timeline").innerHTML = [...grupos].reverse().map(([mes, rs]) => `
    <li><time class="mono">${esc(mes)}</time>
      <h4>${rs.length} ${rs.length > 1 ? "projetos iniciados" : "projeto iniciado"}</h4>
      <p class="muted">${rs.map((r) => `<a href="${esc(r.html_url)}" target="_blank" rel="noopener">${esc(nomeBonito(r.name))}</a>`).join(" · ")}</p>
    </li>`).join("");
}

function renderProjetos() {
  const q = $("#search").value.trim().toLowerCase();
  const lista = repos.filter((r) => {
    const lang = r.language || "Outros";
    const texto = `${r.name} ${r.description || ""} ${DESCRICOES[r.name] || ""} ${lang}`.toLowerCase();
    return (filtroLang === "Todos" || lang === filtroLang) &&
      (filtroConta === "Todas" || ownerOf(r) === filtroConta) &&
      (!q || texto.includes(q));
  });
  if (ordem === "cronologica") lista.sort((a, b) => a.created_at.localeCompare(b.created_at));
  $("#all-projects").innerHTML = lista.map(cardProjeto).join("");
  $("#empty").hidden = lista.length > 0;
}

// Cards das contas (página Sobre e Contato)
function renderContas() {
  const html = ACCOUNTS.map((a) => {
    const n = repos.filter((r) => ownerOf(r) === a.login).length;
    return `
      <a class="card account-card${a.main ? " main" : ""}" href="https://github.com/${esc(a.login)}" target="_blank" rel="noopener">
        <img src="https://avatars.githubusercontent.com/${esc(a.login)}" alt="Avatar da conta @${esc(a.login)} no GitHub" width="56" height="56" loading="lazy">
        <div>
          <h3 class="mono">@${esc(a.login)}</h3>
          <p class="account-label">${esc(a.label)} · ${esc(a.period)}</p>
          <p class="small">${n} ${n === 1 ? "projeto" : "projetos"}</p>
          <p class="muted small">${esc(a.about)}</p>
        </div>
      </a>`;
  }).join("");
  document.querySelectorAll(".accounts-grid").forEach((el) => (el.innerHTML = html));
}

// Atualiza com dados ao vivo da API do GitHub: só repositórios do próprio usuário, sem forks
async function buscarConta(login) {
  const res = await fetch(`https://api.github.com/users/${login}/repos?type=owner&sort=pushed&per_page=100`);
  if (!res.ok) throw new Error(res.status);
  const dados = await res.json();
  return dados.filter((r) =>
    r.owner?.login === login && r.owner?.type === "User" && !r.fork && r.name !== SITE_REPO);
}

async function sincronizar() {
  const status = $("#sync-status");
  const resultados = await Promise.allSettled(ACCOUNTS.map((a) => buscarConta(a.login)));
  // conta que falhar (ex.: limite da API) mantém os dados do snapshot
  const novos = ACCOUNTS.flatMap((a, i) =>
    resultados[i].status === "fulfilled" ? resultados[i].value : repos.filter((r) => ownerOf(r) === a.login));
  const okTodas = resultados.every((r) => r.status === "fulfilled");
  if (resultados.some((r) => r.status === "fulfilled")) {
    repos = novos.sort((a, b) => b.pushed_at.localeCompare(a.pushed_at));
    renderTudo();
  }
  status.textContent = okTodas ? "· sincronizado com o GitHub" : "";
}

// Título da aba em cada página interna, no padrão "<Página> — Lissandro Rocha"
const TITULO_HOME = "Lissandro Rocha — Desenvolvedor Full Stack (Node.js, NestJS, Next.js)";
const TITULOS = { sobre: "Sobre", projetos: "Projetos", contato: "Contato" };

// Roteamento por hash
function rota() {
  const id = (location.hash || "#inicio").slice(1);
  const alvo = document.getElementById(id) && document.getElementById(id).classList.contains("page") ? id : "inicio";
  document.title = TITULOS[alvo] ? `${TITULOS[alvo]} — Lissandro Rocha` : TITULO_HOME;
  document.querySelectorAll(".page").forEach((p) => (p.hidden = p.id !== alvo));
  document.querySelectorAll(".nav-links a").forEach((a) => a.classList.toggle("active", a.dataset.route === alvo));
  $(".nav-links").classList.remove("open");
  $(".menu-btn").setAttribute("aria-expanded", "false");
  window.scrollTo({ top: 0 });
}

// Efeito de digitação
function digitar() {
  const frases = ["APIs com Node.js e NestJS", "Frontends com Next.js e React", "Backends em Go e Python", "Estudando Java e Spring Boot", "Estudante de segurança e blockchain"];
  let i = 0, j = 0, apagando = false;
  const el = $("#typed");
  (function tick() {
    const f = frases[i];
    el.textContent = f.slice(0, j);
    if (!apagando && j < f.length) j++;
    else if (apagando && j > 0) j--;
    else if (!apagando) { apagando = true; return setTimeout(tick, 1600); }
    else { apagando = false; i = (i + 1) % frases.length; }
    setTimeout(tick, apagando ? 35 : 70);
  })();
}

document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();
  $("#skills").innerHTML = htmlSkills();
  $("#search").addEventListener("input", renderProjetos);
  $("#sort").addEventListener("change", (e) => { ordem = e.target.value; renderProjetos(); });
  $("#filters").addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    filtroLang = b.dataset.lang;
    $("#filters").querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === b));
    renderProjetos();
  });
  $("#account-filters").addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    filtroConta = b.dataset.conta;
    $("#account-filters").querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === b));
    renderProjetos();
  });
  $(".menu-btn").addEventListener("click", () => {
    const aberto = $(".nav-links").classList.toggle("open");
    $(".menu-btn").setAttribute("aria-expanded", String(aberto));
  });
  window.addEventListener("hashchange", rota);
  renderTudo();
  rota();
  digitar();
  sincronizar();
});
