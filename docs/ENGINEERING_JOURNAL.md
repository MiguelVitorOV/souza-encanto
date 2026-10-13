# ENGINEERING JOURNAL - Mundo de Criança

## Sprint 1 a 7: Fundação, Estoque e CRM

### Problemas Encontrados

- Nomenclatura das chaves de ambiente do Supabase (`NEXT_PUBLIC_SUPABASE_ANON_KEY` vs `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).

### Lições Aprendidas

- **Compatibilidade de Credenciais Supabase:** O cliente Supabase deve aceitar tanto a chave anon tradicional quanto a publishable key mais recente da UI.

---

## Sprint 8: Identidade Visual e Rebranding "Mundo de Criança"

### Problemas Encontrados

1. **Colisão Circular de Variáveis no Tailwind CSS v4:**
   - **Descrição:** Definir `@theme { --font-fredoka: var(--font-fredoka); }` com o mesmo identificador no Next.js `next/font/google` gera referência circular em CSS puro, invalidando a família tipográfica no navegador.
   - **Causa:** No Tailwind v4, `@theme` substitui as variáveis nativas ao invés de estendê-las se usarem exatamente o mesmo nome.
   - **Solução:** Declarar a variável no Next.js como `--font-fredoka-family` e apontar `--font-fredoka: var(--font-fredoka-family)` em `@theme`.
2. **Posicionamento e UX do Botão Mobile na Página do Produto:**
   - **Descrição:** Em telas pequenas, um botão 100% fixo no rodapé pode cobrir o footer ou a área inferior, enquanto um botão estático exige rolagem excessiva.
   - **Solução:** Implementação de botão com docking dinâmico: flutua na parte inferior sem fundo opaco enquanto o usuário navega pelos detalhes iniciais, e ancora suavemente em fluxo normal (`static`) assim que a rolagem alcança a grade de tamanhos, não invadindo o rodapé.

### Restrições Descobertas

- **Equilíbrio Cromático da Marca:** A identidade visual infantil da "Mundo de Criança" requer um balanceamento intencional entre o bege quente do fundo (`#FAF2E8`), rosa chiclete (`#D82B66`), azul céu (`#0284C7`) e amarelo sol (`#D97706`). A saturação de apenas uma cor (especialmente o rosa) descaracteriza a diversidade da paleta infantil e afeta a clareza visual.

### Lições Aprendidas

- **Contraste de Texto em Fundos Quentes:** Para manter excelente legibilidade em fundos bege/creme, títulos e descrições devem usar tons de marrom chocolate escuro (`#4A2E18` / `text-brand-900`) em vez de tons de rosa ou cinza neutro.
- **Micro-interações sem Peso de Bundle:** Elementos lúdicos como nuvens fofas, estrelinhas cintilantes e badges arredondados podem ser desenhados puramente com SVG vetorial e CSS Tailwind, sem depender de bibliotecas externas pesadas.

### Débitos Técnicos

- **Nenhum.** Build 100% verde com TypeScript rigoroso e Turbopack compilando sem advertências.
