---
titulo: Evitando IDOR no NestJS com middlewares de permissão
descricao: O que é IDOR, por que ele aparece em APIs REST e como centralizar a checagem de dono do recurso no NestJS com guards e middlewares.
data: AAAA-MM-DD
---

> **Rascunho.** Esqueleto para revisar e completar. Não publicar sem revisão.
> Use apenas exemplos genéricos (ex.: `pedidos`, `usuarios`), nada de sistemas, domínios ou código de empresas.

## O que é IDOR

- [Definição curta: acesso a um recurso de outro usuário só trocando o ID na URL]
- [Exemplo genérico: `GET /pedidos/123` devolvendo o pedido de outra pessoa]

## Por que acontece

- [Autenticação ≠ autorização]
- [Checagem espalhada pelos controllers e esquecida em uma rota]

## Onde colocar a checagem no NestJS

- [Middleware × guard × interceptor: o que cada um enxerga do request]
- [Por que um guard costuma ser o lugar certo para "esse usuário pode acessar esse recurso?"]

## Implementação de exemplo

- [Decorator para marcar o tipo de recurso da rota]
- [Guard que busca o recurso e compara o dono com o usuário autenticado]
- [Trecho de código genérico]

```ts
// [exemplo genérico de guard a completar]
```

## Testando

- [Teste e2e: usuário A tentando acessar recurso do usuário B deve receber 403/404]
- [403 ou 404? Prós e contras de não revelar que o recurso existe]

## Checklist

- [ ] Toda rota com ID de recurso passa pelo guard
- [ ] Listagens filtram pelo usuário no banco, não na memória
- [ ] Testes cobrem o acesso cruzado entre usuários
