# Reconhecimento de SEO (T0)

## Stack

- Site **estático puro**: `index.html`, `style.css`, `script.js`, `data.js`. Sem framework, sem bundler, sem `package.json`.
- Uma única página com quatro "páginas" internas (`#inicio`, `#sobre`, `#projetos`, `#contato`) trocadas por hash em `script.js`. As seções inativas ficam com o atributo `hidden`.
- `data.js` guarda um retrato (snapshot) dos repositórios públicos. Ao abrir o site, `script.js` atualiza esses dados pela API do GitHub.

## Build e deploy

- Não existe build. O GitHub Pages publica a branch `main` direto da raiz (há um `.nojekyll`, então o Jekyll não roda e **todos os arquivos do repositório ficam acessíveis por URL**).
- Não há GitHub Actions.

## O que o HTML servido já contém sem JavaScript

Analisei o `index.html` do repositório (o site publicado não estava acessível do ambiente de execução; como não há build, o arquivo é exatamente o que o Pages serve).

Já aparece no HTML: `lang="pt-BR"`, título, descrição, favicon, `apple-touch-icon`, Open Graph básico, o nome completo, o texto da seção "Sobre" e os links de contato.

Só aparece depois do JavaScript: os cards de projetos (destaques e lista completa), as estatísticas, as tecnologias, a barra de linguagens e a linha do tempo.

## Problemas encontrados

1. **Título e descrição** posicionam o perfil como "Go, Python e TypeScript" e usam "Lissandro Miranda", sem "Lissandro Rocha", que é a busca principal.
2. **Quatro `<h1>`** (um por seção). O `h1` da home é "Lissandro Miranda Rocha", sem o cargo.
3. **Sem `canonical`**, sem JSON-LD `Person`, sem `og:locale` / `profile:*`; `twitter:card` é `summary` e `og:image` é o ícone 512×512.
4. **Projetos invisíveis sem JS**: o buscador recebe a home sem nenhum título de projeto.
5. **Sem `sitemap.xml`, `robots.txt` nem `404.html`.**
6. Links para GitHub e LinkedIn sem `rel="me"`; LinkedIn apontando para `br.linkedin.com` em vez da URL canônica.
7. As páginas internas por hash não mudam o `document.title`.

## Decisões para T1–T6

- **Manter o site estático e o deploy pela raiz da `main`.** Trocar para GitHub Actions exigiria mudar a origem do Pages nas configurações do repositório (não tenho esse acesso) e não traz ganho de SEO.
- **Adicionar um build mínimo em Node** (`package.json` + `scripts/build.mjs`), cuja saída é gravada na própria raiz e versionada, porque o Pages publica a raiz:
  - pré-renderiza no `index.html` (entre marcadores `<!-- build:... -->`) os cards de projetos em destaque e as tecnologias, usando as **mesmas funções** de `script.js`, para que o texto exista sem JS (T3). O JavaScript continua re-renderizando com dados ao vivo, então o visual não muda;
  - gera `/artigos/` e `/artigos/<slug>/` a partir de `content/artigos/*.md` (T6);
  - gera `sitemap.xml` com `lastmod` (T4).
- **Imagem de compartilhamento** gerada por `scripts/gerar-og.mjs` com `sharp` a partir de `assets/og-image.svg` (T5). Comando separado (`npm run og`), porque só precisa rodar quando o SVG muda.
- **Um único `h1`**: o da home vira "Lissandro Rocha — Desenvolvedor Full Stack"; os títulos das outras seções passam a `h2` com a mesma aparência (classe `.page-h`).
- **Páginas internas por hash** recebem título próprio via `document.title` (`Sobre — Lissandro Rocha` etc.). Para o Google, a única URL é a home; as páginas de artigos são URLs reais com título, descrição e `canonical` próprios.
- **Rascunhos e arquivos-fonte**: como o Pages serve tudo, `content/rascunhos/` fica acessível por URL direta, embora não seja linkado nem entre no sitemap. O `robots.txt` segue a spec e acrescenta `Disallow` para `/content/`, `/docs/` e `/scripts/`, para esses arquivos não serem indexados. Os rascunhos não contêm dados internos de empresa.
