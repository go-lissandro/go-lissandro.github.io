# go-lissandro.github.io

Portfólio pessoal de Lissandro Miranda Rocha, publicado em **https://go-lissandro.github.io**.

Site estático (HTML, CSS e JavaScript). Mostra os repositórios públicos das minhas contas pessoais no GitHub (`lissandro7`, `lissandrojs` e `go-lissandro`, a principal), buscando os dados direto da API do GitHub.

## Como atualizar

O GitHub Pages publica a raiz da branch `main`. Os arquivos gerados (`artigos/`, `sitemap.xml`, trechos do `index.html` e `og-image.png`) ficam versionados.

```bash
npm install
npm run build   # pré-renderiza destaques no index.html, gera /artigos/ e sitemap.xml
npm run og      # regenera og-image.png a partir de assets/og-image.svg
npm run serve   # serve o site em http://localhost:8080
```

- Artigos publicados: `content/artigos/*.md` (formato em `content/README.md`).
- Rascunhos (fora do build): `content/rascunhos/`.
- SEO: `docs/seo-reconhecimento.md` e `docs/seo-checklist-manual.md`.
