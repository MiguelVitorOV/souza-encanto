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

---

## Sprint 9: Suporte a Vídeos de Demonstração e Ordenação Manual de Mídias (Urgente)

### Problemas Encontrados

1. **Autoplay Bloqueado em Dispositivos Móveis (iOS/Android):**
   - **Descrição:** Vídeos renderizados em navegadores mobile sofrem restrições de autoplay caso possuam áudio ativo ou não incluam a diretiva de reprodução inline.
   - **Causa:** Políticas de economia de dados e prevenção de poluição sonora nos navegadores móveis (WebKit e Blink).
   - **Solução:** Configurar a tag com `autoPlay`, `loop`, `muted`, `playsInline` e listener defensivo `onLoadedData={(e) => e.currentTarget.play().catch(() => {})}`, garantindo início imediato sem bloqueios.
2. **Poluição Visual com Badges sobre Fotos de Capa:**
   - **Descrição:** A adição de selos textuais (`▶️ Vídeo`) nos cards da vitrine desarmonizava a estética afetiva e limpa da loja.
   - **Solução:** Remoção do badge do `ProductCard`, mantendo a capa 100% limpa com foto estática e reservando a indicação de vídeo com ícone de play apenas para as miniaturas da página de detalhes.

### Restrições Descobertas

- **Cota de Armazenamento do Supabase (Tier Gratuito):** O limite de 50MB por arquivo do Supabase Storage exige controle rígido client-side. A trava de 40MB aplicada no formulário do admin previne rejeições de upload HTTP 413 e protege o lojista de esgotar o storage com arquivos não comprimidos.

### Lições Aprendidas

- **Ordenação Numérica vs Drag-and-Drop em Mobile:** Utilizar campos de entrada numérica direta (`Ordem: [ N ]`) elimina a necessidade de bibliotecas pesadas de arrastar/soltar, remove conflitos com o gesto de scroll nativo em smartphones e fornece uma experiência previsível e direta para o lojista.

---

## Sprint 10: Banco de Dados e Migração Segura de Tamanhos e Categorias

### Estruturas Criadas

1. **Grades de Tamanhos (`size_categories`):**
   - Tabela com colunas `id`, `name`, `sizes text[]`, `measurement_table text`, `measurement_description text` e RLS público para leitura e restrito para escrita.
2. **Multi-Categorias N:N (`product_categories`):**
   - Tabela de junção `product_id` e `category_id` com chaves estrangeiras em cascata, índices de busca para vitrine e RLS integrado.
3. **Novas Colunas em Produtos (`products`):**
   - `promotional_price DECIMAL(10,2)` e `size_category_id UUID REFERENCES size_categories(id) ON DELETE SET NULL`.
4. **Migração Segura de Dados e Idempotência:**
   - Criação da categoria transitória "A mudar" (`slug: 'a-mudar'`).
   - Associação retrocompatível de todos os produtos existentes à categoria "A mudar" e às suas respectivas categorias originais.
   - Script futuro preparado para descarte seguro da coluna legada `category_id` assim que o lojista concluir a recategorização.

- **Camada de Retrocompatibilidade (Dual-Write):** Ao introduzir uma estrutura mais rica em JSONB (`media`), manter a sincronização com a coluna antiga (`images`) garante que nenhum componente legado quebre e dispensa migrações destrutivas.

### Débitos Técnicos

- **Execução da Migration SQL em Produção:** Executar `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS media JSONB DEFAULT '[]'::jsonb;` diretamente no SQL Editor do Supabase (o código já possui fallback resiliente ativo).
