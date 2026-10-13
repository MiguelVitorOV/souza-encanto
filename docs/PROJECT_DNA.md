# PROJECT DNA - Mundo de Criança

## 1. Visão do Projeto

Desenvolver um catálogo digital acolhedor, lúdico e de alta qualidade visual para a loja **"Mundo de Criança"**, focado em moda infantil e bebê (desde recém-nascidos até a infância). O sistema atua como uma vitrine interativa onde a conversão e o fechamento de pedidos ocorrem exclusivamente via WhatsApp, preservando o atendimento humano, carinhoso e consultivo.

## 2. Objetivos Principais

- Apresentar o catálogo de roupas infantis com apelo visual afetivo, cores acolhedoras e navegação fluida.
- Permitir categorização flexível (N:N), possibilitando que uma peça pertença simultaneamente a múltiplas categorias (ex: "Feminino", "Até 4 anos", "Inverno", "Ofertas").
- Fornecer filtros combináveis por tags/chips na vitrine com desmarcação ágil e botão "Limpar filtros".
- Prover gestão de grades de tamanhos personalizáveis pelo administrador (ex: Bebê 1M-6M, Infantil 4-10), com tabela de medidas formatada e notas de orientação com modal explicativo para o cliente.
- Permitir exibição de vídeos de demonstração das peças infantis (tecidos, detalhes e movimento) com ordenação manual numérica de fotos e vídeos.
- Permitir precificação promocional com desconto visível (tag de oferta, porcentagem calculada e preço original riscado).
- Manter o fluxo de carrinho interativo com envio da lista detalhada diretamente para o WhatsApp da loja.
- Manter o CRM simples de "Lista de Interessados" para peças fora de estoque.

## 3. Drivers Arquiteturais

1. **Afetividade e Identidade Visual (Mundo de Criança):** Design lúdico, alegre e confiável para mães, pais e presenteadores, utilizando tons pastéis acolhedores, nuvens, estrelas e a identidade oficial do ursinho com arco-íris.
2. **Custo Operacional Zero:** Operar integralmente em tiers gratuitos (Next.js na Vercel e Supabase BaaS).
3. **Simplicidade e Autonomia Administrativa:** O administrador gerencia livremente categorias, grades de tamanhos, tabelas de medidas, ordenação de mídias (fotos/vídeos) e promoções sem depender de desenvolvedores.
4. **Mobile-First Real:** Mais de 90% do público acessa via Instagram e WhatsApp por smartphones; botões de toque generosos, vídeos leves embutidos sem autoplay invasivo e modais acessíveis.
5. **Preservação de Dados Existentes:** Manutenção do histórico e fotos de produtos já cadastrados, isolando categorias legadas na categoria transitória "A mudar" e retrocompatibilidade com o array `images`.

## 4. Restrições Invioláveis

- **Sem Gateway de Pagamento:** Fechamento e cálculo de frete sempre via WhatsApp (wa.me).
- **Sem Autenticação Pública:** Clientes compram sem cadastro. Apenas o painel administrativo exige login seguro via Supabase Auth.
- **Estoque Booleano por Tamanho:** Cada tamanho de um produto é marcado individualmente como "Em estoque" ou "Fora de estoque".
- **Integridade de Produtos na Exclusão de Grades:** Se uma Categoria de Tamanho for excluída, os produtos vinculados não podem ser deletados (`ON DELETE SET NULL`).
- **Vitrine Inteligente com Capa Estática:** A vitrine (Home) e miniaturas do carrinho utilizam sempre a primeira foto como capa estática, mesmo se um vídeo estiver definido na posição 1 da galeria.
- **Limite de Tamanho de Vídeo:** Vídeos enviados pelo lojista devem ter no máximo 40MB para preservar cota de armazenamento gratuito no Supabase e otimizar consumo de dados 4G.

## 5. Decisões por Dimensão

- **Mídias e Demonstração (Fotos e Vídeos):** Cada produto suporta uma coleção ordenada de mídias (`media JSONB` com `url`, `type: 'image' | 'video'`, e `order: number`). O lojista define a ordem através de inputs numéricos diretos. O array legador `images TEXT[]` é mantido sincronizado com as URLs das fotos para garantir retrocompatibilidade.
- **Negócio & Atendimento:** O carrinho calcula o preço promocional (se ativo) e formata a mensagem do WhatsApp especificando produtos, tamanhos escolhidos, preços promocionais e valor total estimado.
- **Categorização:** Migração para modelo relacional Many-to-Many (`products` <-> `categories` via `product_categories`). Na vitrine, o cliente pode combinar tags para refinar o catálogo.
- **Grades de Tamanhos & Medidas:** Entidade independente `size_categories`. Guarda o nome da grade, lista de tamanhos, texto formatado da tabela de medidas e texto de observações/descrição. Cada produto referencia opcionalmente uma grade.
- **Descontos:** Coluna opcional `promotional_price`. O formulário do produto sincroniza em tempo real o valor promocional e a porcentagem de desconto. O desconto só é ativo se `promotional_price > 0` e `promotional_price < price`.
- **Branding & Assets:** Imagens oficiais da pasta `identidade-visual/` (`1.png` como referência de hero e `2.png` como tag/logo) são integradas aos assets públicos (`/public/images/`).

## 6. Arquitetura Lógica

- **Frontend:** Next.js (App Router) com Server Components para SSR/SEO e Client Components para interações de carrinho, modais, players de vídeo e filtros.
- **Estado Global:** Zustand para persistência local do carrinho (`localStorage`).
- **Backend / BaaS:** Supabase (PostgreSQL relacional, Auth para admin e Storage público para fotos e vídeos de produtos).

## 7. Arquitetura Física & Dados

- **Hospedagem:** Vercel (Edge Runtime).
- **Banco de Dados (Supabase PostgreSQL):**
  - `categories` (id, name, slug, created_at)
  - `size_categories` (id, name, sizes text[], measurement_table text, measurement_description text, created_at)
  - `products` (id, name, description, price, promotional_price, size_category_id, sizes jsonb, images text[], media jsonb, is_active, is_out_of_stock, created_at)
  - `product_categories` (product_id uuid, category_id uuid, primary key (product_id, category_id))
  - `clients` (id, name, nickname, phone_suffix, created_at)
  - `client_interests` (id, client_id, product_id, size, status, created_at)
  - `storage.buckets`: `product-images` (fotos e vídeos curtos)

## 8. Stack Tecnológica

- **Framework:** Next.js 15+ (App Router, React 19).
- **Estilização:** Tailwind CSS v4 (Design Tokens customizados para paleta infantil).
- **Ícones:** Lucide React.
- **BaaS & DB:** Supabase Client (`@supabase/supabase-js`, `@supabase/ssr`).
- **Estado do Carrinho:** Zustand com persistência local.

## 9. Estratégia de Segurança (RLS)

- `categories`, `size_categories`, `products`, `product_categories`: `SELECT` público; `INSERT/UPDATE/DELETE` restrito a `authenticated` (Admin).
- `clients`, `client_interests`: Leitura e escrita restritas a `authenticated` (Admin).
- Storage `product-images`: `SELECT` público; mutações restritas a `authenticated`.

## 10. Riscos e Trade-offs

- **Risco:** Upload de vídeos não otimizados excedendo o plano gratuito do Supabase. _Mitigação:_ Trava no client-side barrando uploads > 40MB com instrução para envio de vídeos curtos gravados/editados para web.
- **Trade-off:** Ordenação manual por campo numérico ao invés de drag-and-drop. _Benefício:_ Menor peso de bibliotecas, ausência de bugs de toque em mobile e simplicidade máxima de uso para o lojista.
- **Trade-off:** Tabela de medidas salva como texto formatado ao invés de colunas relacionais rígidas. _Benefício:_ Máxima flexibilidade para peças variadas (ex: conjunto blusa+short vs macacão vs vestido) sem rigidez de schema.
- **Risco:** Inconsistência de filtros com categorias antigas. _Mitigação:_ Script de migração que direciona produtos legados para "A mudar" e remove categorias de lingerie sem excluir nenhum produto.
