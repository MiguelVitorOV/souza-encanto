-- ==============================================================================
-- SPRINT 10: Banco de Dados e Migração Segura de Tamanhos e Categorias
-- Projeto: Mundo de Criança
-- ==============================================================================

-- 1. TABELA DE CATEGORIAS DE TAMANHO (Grades de Medidas)
CREATE TABLE IF NOT EXISTS public.size_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sizes TEXT[] NOT NULL DEFAULT '{}',
  measurement_table TEXT,
  measurement_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Ativar RLS em size_categories
ALTER TABLE public.size_categories ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para size_categories
DROP POLICY IF EXISTS "Public read size_categories" ON public.size_categories;
CREATE POLICY "Public read size_categories"
  ON public.size_categories
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Admins can insert size_categories" ON public.size_categories;
CREATE POLICY "Admins can insert size_categories"
  ON public.size_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update size_categories" ON public.size_categories;
CREATE POLICY "Admins can update size_categories"
  ON public.size_categories
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can delete size_categories" ON public.size_categories;
CREATE POLICY "Admins can delete size_categories"
  ON public.size_categories
  FOR DELETE
  TO authenticated
  USING (true);

-- 2. TABELA DE JUNÇÃO MULTI-CATEGORIAS (N:N)
CREATE TABLE IF NOT EXISTS public.product_categories (
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

-- Índices de performance para filtros na vitrine
CREATE INDEX IF NOT EXISTS idx_product_categories_product ON public.product_categories(product_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_category ON public.product_categories(category_id);

-- Ativar RLS em product_categories
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para product_categories
DROP POLICY IF EXISTS "Public read product_categories" ON public.product_categories;
CREATE POLICY "Public read product_categories"
  ON public.product_categories
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Admins can insert product_categories" ON public.product_categories;
CREATE POLICY "Admins can insert product_categories"
  ON public.product_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update product_categories" ON public.product_categories;
CREATE POLICY "Admins can update product_categories"
  ON public.product_categories
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can delete product_categories" ON public.product_categories;
CREATE POLICY "Admins can delete product_categories"
  ON public.product_categories
  FOR DELETE
  TO authenticated
  USING (true);

-- 3. ADICIONAR CAMPOS DE DESCONTO E GRADE NA TABELA PRODUCTS
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS promotional_price DECIMAL(10,2);

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS size_category_id UUID REFERENCES public.size_categories(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.products.promotional_price IS 'Preço com desconto. Opcional; se preenchido e menor que price, destaca a promoção.';
COMMENT ON COLUMN public.products.size_category_id IS 'Referência opcional à grade de tamanhos e tabela de medidas.';

-- 4. MIGRAÇÃO SEGURA DE DADOS

-- 4.1 Criar a categoria padrão "A mudar" caso não exista
INSERT INTO public.categories (name, slug)
SELECT 'A mudar', 'a-mudar'
WHERE NOT EXISTS (
  SELECT 1 FROM public.categories WHERE slug = 'a-mudar' OR name ILIKE 'A mudar'
);

-- 4.2 Migrar vínculos existentes de category_id para a tabela product_categories
INSERT INTO public.product_categories (product_id, category_id)
SELECT p.id, p.category_id
FROM public.products p
WHERE p.category_id IS NOT NULL
ON CONFLICT (product_id, category_id) DO NOTHING;

-- 4.3 Vincular todos os produtos existentes à categoria "A mudar"
-- (assim o lojista encontra e recategoriza facilmente cada peça sem perder nada)
INSERT INTO public.product_categories (product_id, category_id)
SELECT p.id, c.id
FROM public.products p
CROSS JOIN public.categories c
WHERE c.slug = 'a-mudar'
ON CONFLICT (product_id, category_id) DO NOTHING;

-- 4.4 Limpeza Segura: Remover apenas categorias antigas sem NENHUM produto ativo
-- (não exclui categorias que possuam produtos na coluna antiga ou na nova tabela)
DELETE FROM public.categories
WHERE id NOT IN (
  SELECT DISTINCT category_id FROM public.product_categories
)
AND id NOT IN (
  SELECT DISTINCT category_id FROM public.products WHERE category_id IS NOT NULL
)
AND slug != 'a-mudar';
