---
titulo: Migrando um helpdesk para Zammad self-hosted com SSO via Nginx
descricao: Passo a passo genérico para subir o Zammad em Docker, publicá-lo atrás do Nginx e configurar login único (SSO).
data: AAAA-MM-DD
---

> **Rascunho.** Esqueleto para revisar e completar. Não publicar sem revisão.
> **Nenhum dado interno**: sem nome de empresa, domínios reais, nomes de sistemas, clientes ou volumes. Use `helpdesk.exemplo.com` e afins.

## Contexto (genérico)

- [Por que alguém migraria de um helpdesk SaaS ou legado para um self-hosted]
- [Critérios de escolha do Zammad]

## Subindo o Zammad com Docker

- [docker compose oficial, serviços envolvidos]
- [Volumes, backup e atualização]

## Nginx como proxy reverso

- [Bloco `server` de exemplo para `helpdesk.exemplo.com`]
- [HTTPS, cabeçalhos `X-Forwarded-*`, WebSocket]

```nginx
# [configuração genérica a completar]
```

## SSO

- [Opções: SAML, OpenID Connect ou autenticação via cabeçalho no Nginx]
- [Fluxo do login, em passos]
- [Cuidados de segurança: não confiar em cabeçalhos vindos de fora do proxy]

## Migração dos dados

- [Importadores disponíveis e o que conferir depois de importar]

## O que eu faria diferente

- [Aprendizados, sem citar dados internos]
