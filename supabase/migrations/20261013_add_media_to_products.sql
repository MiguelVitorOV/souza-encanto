-- Migration: Adicionar coluna media na tabela products para suporte a fotos e vídeos ordenados
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS media JSONB DEFAULT '[]'::jsonb;

-- Comentário explicativo
COMMENT ON COLUMN public.products.media IS 'Array de objetos ProductMedia: [{ url: string, type: "image" | "video", order: number }]';
