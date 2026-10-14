# IMPLEMENTATION PLAN - Mundo de Criança

Este plano de implementação organiza as novas entregas em fases atômicas, minimizando riscos de quebra e garantindo entrega incremental e testável.

---

## FASES ANTERIORES (CONCLUÍDAS)

- [x] **Fase 1 a 4:** Fundação, Carrinho Local, Painel Administrativo Base e Vitrine Inicial.
- [x] **Fase 5:** Controle granular de estoque booleano por tamanho.
- [x] **Fase 6:** Páginas institucionais e correções de galeria mobile.
- [x] **Fase 7:** CRM Básico de Lista de Interessados (`clients` e `client_interests`).

---

## FASE 8: Identidade Visual e Rebranding "Mundo de Criança" (CONCLUÍDA)

**Foco:** Transformar a estética e branding completo do app antes da reestruturação de catálogo.

- [x] **8.1 Tokens de Cores e Estilo:** Atualizar `globals.css` com a nova paleta alegre e carinhosa (Creme bebê suave, Rosa algodão-doce, Azul céu, Amarelo sol, Lilás lúdico e Marrom chocolate para contrastes e textos legíveis).
- [x] **8.2 Assets de Marca:** Preparar e integrar os assets de `identidade-visual/` (`1.png` e `2.png`) em `public/images/` para logo oficial, favicon e referências visuais.
- [x] **8.3 Header, Footer e Hero:** Reformular o cabeçalho, rodapé e criar o novo Hero acolhedor na Home da loja com a logo "Mundo de Criança" e mensagens afetivas da marca.
- [x] **8.4 Metadados e Textos:** Atualizar título da aplicação (`layout.tsx`), descrições de SEO e links institucionais de "Souza Encanto" para "Mundo de Criança".

---

## FASE 9: Suporte a Vídeos de Demonstração e Ordenação Manual de Mídias (Sprint 9 - Urgente) (CONCLUÍDA)

**Foco:** Permitir upload de vídeos curtos demonstrativos e ordenação manual de mídias por número, garantindo capa estática rápida na vitrine.

- [x] **9.1 Schema de Dados & Tipagem:**
  - Adicionar suporte à estrutura de mídia no banco (campo `media jsonb DEFAULT '[]'::jsonb` na tabela `products`).
  - Atualizar tipos TypeScript (`ProductMedia { url: string; type: 'image' | 'video'; order: number }`) com retrocompatibilidade automática com `images text[]`.
- [x] **9.2 Upload de Vídeo e Trava de Segurança:**
  - Atualizar `src/utils/storage.ts` para upload de vídeos para o bucket Supabase.
  - Implementar validação client-side com alerta amigável caso o vídeo ultrapasse 40 MB.
- [x] **9.3 Painel Admin - Gestão de Mídias e Ordenação (`ProductForm`):**
  - Permitir adicionar fotos e vídeos na galeria do produto.
  - Adicionar campo numérico simples ("Ordem: N") em cada item da galeria para definir a sequência sem necessidade de arrastar.
  - Ao salvar o produto, ordenar as mídias pelo número definido e manter sincronismo retrocompatível com o array `images`.
- [x] **9.4 Vitrine Inteligente e Miniaturas (`ProductCard` e Carrinho):**
  - No card da vitrine e no carrinho, selecionar automaticamente a primeira foto da galeria como capa estática de carregamento rápido, mantendo a visualização clean sem tags poluídas.
- [x] **9.5 Player de Vídeo e Galeria nos Detalhes (`ClientProductDetails`):**
  - Renderizar player de vídeo responsivo com autoplay imediato em loop, áudio mutado e controles para pausar/desmutar.
  - Miniaturas na barra inferior exibindo ícone discreto para vídeos e prévias para fotos.

---

## FASE 10: Banco de Dados e Migração Segura de Tamanhos e Categorias (Sprint 10)

**Foco:** Criar as novas estruturas no Supabase preservando 100% dos produtos já cadastrados.

- [x] **10.1 Schema de Categorias de Tamanho:** Criar tabela `size_categories` (id, name, sizes text[], measurement_table text, measurement_description text, created_at) com RLS público para leitura e autenticado para escrita.
- [x] **10.2 Schema de Multi-Categorias:** Criar tabela de junção `product_categories` (product_id uuid, category_id uuid, primary key) com RLS apropriado.
- [x] **10.3 Campos de Desconto e Grade em Produtos:** Adicionar colunas `promotional_price DECIMAL(10,2)` e `size_category_id UUID REFERENCES size_categories(id) ON DELETE SET NULL` na tabela `products`.
- [x] **10.4 Script de Migração de Dados:**
  - Criar categoria padrão "A mudar" na tabela `categories`.
  - Migrar referências existentes de `products.category_id` para a tabela `product_categories` apontando para "A mudar".
  - Remover com segurança as categorias antigas de lingerie que não possuem mais produtos ativos.

---

## FASE 11: Painel Admin - Gestão de Tamanhos, Categorias e Promoções (Sprint 11)

**Foco:** Dar total autonomia ao lojista para gerenciar o novo catálogo.

- [ ] **11.1 Gestão de Categorias de Tamanho (`/admin/tamanhos`):**
  - Listagem, criação e edição de grades de tamanho.
  - Campos: Nome da grade, chips de tamanhos incluídos (ex: 04, 06, 08, 10).
  - Editor de texto formatado para Tabela de Medidas e Descrição/Orientações com painel de **pré-visualização ao vivo**.
- [ ] **11.2 Atualização do Formulário de Produtos (`ProductForm`):**
  - Seleção múltipla de categorias de produto (chips ou checkboxes).
  - Seletor de Categoria de Tamanho (grade), com carregamento dinâmico dos tamanhos para marcação de presença e estoque.
  - Campos de Preço e Desconto com sincronização bidirecional em tempo real (digitar preço promocional calcula % de desconto, e digitar % calcula preço promocional).
- [ ] **11.3 Navegação do Admin:** Atualizar `AdminHeader` incluindo a nova aba "Tamanhos / Medidas".

---

## FASE 12: Vitrine Pública, Filtros e Detalhes do Produto (Sprint 12)

**Foco:** Experiência do cliente na descoberta, seleção e visualização de detalhes.

- [ ] **12.1 Filtros Múltiplos na Vitrine:**
  - Reformulação visual dos filtros na Home: chips/tags de múltipla seleção com estado ativo/inativo elegante.
  - Suporte à combinação de filtros cumulativos (ex: "Feminino" + "Até 4 anos") e botão para "Limpar filtros".
- [ ] **12.2 Tags de Desconto e Preços Riscados:**
  - `ProductCard`: Tag chamativa "-X% OFF" nos produtos em oferta, preço original riscado e preço promocional em destaque.
  - `ClientProductDetails`: Destaque de preço promocional, economia e tag de oferta.
- [ ] **12.3 Modal de Tabela de Medidas:**
  - Na página do produto, exibir botão "📏 Tabela de Medidas" quando houver grade associada.
  - Modal responsivo e acolhedor renderizando a tabela e notas de instrução de forma clara para mães e pais.
- [ ] **12.4 Atualização de Carrinho e WhatsApp:**
  - Garantir que o valor unitário computado no carrinho seja o preço promocional.
  - Atualizar o gerador da mensagem do WhatsApp indicando a promoção e os valores exatos.

---

## FASE 13: Validação E2E, Lint e Deploy (Sprint 13)

**Foco:** Garantir estabilidade e publicação sem regressões.

- [ ] **13.1 Validação de Tipos e Build:** Rodar `npm run build` e validações de lint/prettier.
- [ ] **13.2 Teste Funcional Mobile:** Validar experiência de clique, vídeos, modais e filtros em resoluções mobile.
- [ ] **13.3 Commit e Deploy na Vercel:** Publicação das atualizações com verificação do build.
