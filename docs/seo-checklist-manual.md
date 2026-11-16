# Checklist manual de SEO

Passos que dependem de contas e acessos fora do repositório. Marque conforme for fazendo.

## Pendências deixadas pela implementação

- [ ] **Criar o README de perfil do GitHub**: criar o repositório público `go-lissandro/go-lissandro` e colar o conteúdo de [`readme-perfil-github.md`](readme-perfil-github.md) como `README.md`. (A sessão do Claude Code não tinha permissão para criar repositórios.)
- [ ] **Conferir o site publicado** depois do merge: abrir https://go-lissandro.github.io/, testar a prévia do link no [Rich Results Test](https://search.google.com/test/rich-results) (JSON-LD `Person`) e num compartilhamento do LinkedIn/WhatsApp (imagem `og-image.png`). O ambiente da implementação não alcançava o site publicado, então essa conferência foi feita só localmente.

## Checklist da spec

- [ ] Cadastrar o site no Google Search Console (verificação por meta tag ou arquivo HTML), enviar o sitemap (`https://go-lissandro.github.io/sitemap.xml`) e pedir indexação da home
- [ ] LinkedIn: perfil público visível para buscadores; headline igual ao cargo do site ("Desenvolvedor Full Stack"); "Sobre" com o nome completo; seção Destaques com portfólio e JobRadar; link do portfólio no perfil
- [ ] Publicar o 1º artigo no site e repostar no LinkedIn (artigo) e no dev.to com `canonical` apontando para o site
- [ ] Criar perfis com o mesmo nome, foto e link do portfólio: dev.to, Gravatar; opcional: Stack Overflow, X ou Bluesky, Docker Hub
- [ ] Contas antigas do GitHub (`lissandrojs`, `lissandro7`): apontar a bio para `go-lissandro` ou arquivar, para não dividir resultados
- [ ] Adicionar cada perfil novo no `sameAs` do JSON-LD (no `<head>` do `index.html`)
- [ ] Opcional: domínio próprio (ex.: `lissandrorocha.dev`) apontando para o GitHub Pages
- [ ] Uma vez por mês, em aba anônima: buscar "Lissandro Rocha" e "Lissandro Miranda Rocha" e anotar o que aparece na 1ª página

## Dicas

- Para a verificação do Search Console por meta tag, adicione a tag no `<head>` do `index.html` e faça commit na `main`.
- Se você trocar o domínio, atualize `SITE` em `scripts/build.mjs`, o `canonical`, o `og:url`, o JSON-LD e o `robots.txt`, e rode `npm run build`.
