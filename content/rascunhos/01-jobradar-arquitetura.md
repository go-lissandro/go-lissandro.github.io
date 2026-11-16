---
titulo: "Construindo o JobRadar: agregador de vagas com IA local (parte 1: arquitetura)"
descricao: Como estou desenhando o JobRadar, um agregador de vagas que usa um modelo de linguagem rodando localmente para filtrar e classificar oportunidades.
data: AAAA-MM-DD
---

> **Rascunho.** Esqueleto para revisar e completar. Não publicar sem revisão.
> Trechos entre `[colchetes]` são lembretes do que escrever.

## O problema

- [Por que agregar vagas: fontes espalhadas, filtros ruins, vagas repetidas]
- [O que o JobRadar precisa resolver para você, em uma frase]

## Por que IA local

- [Motivos para rodar o modelo na própria máquina: privacidade, custo, aprendizado]
- [Limitações que você aceitou com essa escolha]

## Visão geral da arquitetura

- [Diagrama simples: coleta → normalização → deduplicação → classificação com LLM → interface]
- [Stack escolhida para cada parte e o porquê]

### Coleta

- [Como as vagas entram no sistema: fontes públicas, APIs, frequência]
- [Cuidados: respeitar termos de uso e robots.txt das fontes]

### Normalização e deduplicação

- [Formato interno de uma vaga]
- [Como identificar a mesma vaga publicada em lugares diferentes]

### Classificação com o modelo local

- [Qual modelo e como ele é servido]
- [O que o modelo recebe e o que devolve: exemplo genérico de prompt e de saída]

### Armazenamento e interface

- [Banco de dados e como a interface consulta as vagas]

## Decisões que ainda estão em aberto

- [Liste o que ainda não está definido]

## Próximas partes da série

- [Parte 2: ...]
- [Parte 3: ...]
