---
titulo: "LLM local numa RTX 3060 de 12 GB: o que funciona"
descricao: Anotações práticas sobre rodar modelos de linguagem localmente numa GPU de 12 GB, quais tamanhos de modelo cabem e quais ferramentas usar.
data: AAAA-MM-DD
---

> **Rascunho.** Esqueleto para revisar e completar. Não publicar sem revisão.
> Só registre números (tokens/s, uso de VRAM) que você mesmo mediu, com a configuração usada.

## Meu ambiente

- [GPU, CPU, RAM, sistema operacional, versões de driver]

## Ferramentas testadas

- [Ex.: Ollama, llama.cpp, LM Studio: como instalar e por que escolheu cada uma]

## Quanto cabe em 12 GB

- [Explicação de quantização (Q4, Q5, Q8) e impacto em VRAM]
- [Tabela a preencher com suas medições]

| Modelo | Quantização | VRAM usada | Tokens/s | Observações |
| --- | --- | --- | --- | --- |
| [a medir] | | | | |

## Casos de uso que funcionaram

- [Ex.: classificação de texto, resumo, apoio a código]

## Casos que não funcionaram bem

- [Limites encontrados: contexto longo, raciocínio, velocidade]

## Integrando numa aplicação

- [Chamando a API local a partir de Node.js: exemplo genérico]

## Conclusão

- [Quando vale rodar local e quando não vale]
