# Conteúdo do site

- `artigos/`: artigos **publicados**. Cada arquivo `.md` vira uma página em `/artigos/<nome-do-arquivo>/` e entra no `sitemap.xml` quando você roda `npm run build`.
- `rascunhos/`: esqueletos ainda **não publicados**. O build não lê esta pasta.

## Formato de um artigo

```markdown
---
titulo: Título do artigo
descricao: Uma ou duas frases que aparecem no Google e na prévia do link (até ~160 caracteres).
data: 2026-12-01
atualizado: 2026-12-10   # opcional
---

Texto em Markdown...
```

Para publicar um rascunho: revise, apague as notas de "a completar", mova o arquivo de `rascunhos/` para `artigos/`, ajuste a `data` e rode `npm run build`.
