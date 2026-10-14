-- ==============================================================================
-- SCRIPT FUTURO: Remover coluna legada category_id e categoria "A mudar"
-- Execute este script SOMENTE APÓS revisar e recategorizar todos os produtos!
-- ==============================================================================

-- 1. Remove com segurança a coluna legada da tabela products
ALTER TABLE public.products
  DROP COLUMN IF EXISTS category_id;

-- 2. Remove os vínculos da categoria temporária "A mudar"
DELETE FROM public.product_categories
WHERE category_id IN (
  SELECT id FROM public.categories WHERE slug = 'a-mudar'
);

-- 3. Remove a categoria "A mudar"
DELETE FROM public.categories
WHERE slug = 'a-mudar';
