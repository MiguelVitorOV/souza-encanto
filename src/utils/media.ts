import { ProductMedia, Product } from '@/types'

/**
 * Retorna a lista completa de mídias de um produto ordenada pelo campo order.
 * Mantém retrocompatibilidade total com produtos legados que possuem apenas o array `images`.
 */
export function getProductMedia(
  product?: Partial<Product> | { media?: any; images?: string[] } | null
): ProductMedia[] {
  if (!product) return []

  // Se já possui o campo media em formato de array válido
  if (Array.isArray(product.media) && product.media.length > 0) {
    const list = product.media.map((item: any, idx: number) => ({
      url: typeof item?.url === 'string' ? item.url : '',
      type: (item?.type === 'video' ? 'video' : 'image') as 'video' | 'image',
      order: typeof item?.order === 'number' ? item.order : idx + 1
    }))
    return list.sort((a, b) => a.order - b.order)
  }

  // Fallback retrocompatível: lê o array `images`
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images.map((url, idx) => ({
      url,
      type: 'image' as const,
      order: idx + 1
    }))
  }

  return []
}

/**
 * Retorna sempre a primeira FOTO válida para ser utilizada como capa estática
 * na Vitrine (Home), cards de produto e miniatura do carrinho de compras.
 * Mesmo que um vídeo esteja na ordem 1 da galeria de detalhes, a vitrine é inteligente
 * e extrai a foto com menor número de ordem.
 */
export function getProductCoverImage(
  product?: Partial<Product> | { media?: any; images?: string[] } | null
): string | null {
  if (!product) return null

  const mediaList = getProductMedia(product)
  const firstPhoto = mediaList.find((m) => m.type === 'image')

  if (firstPhoto && firstPhoto.url) {
    return firstPhoto.url
  }

  if (Array.isArray(product.images) && product.images[0]) {
    return product.images[0]
  }

  return null
}

/**
 * Verifica se o produto possui pelo menos um vídeo cadastrado.
 */
export function productHasVideo(
  product?: Partial<Product> | { media?: any } | null
): boolean {
  if (!product) return false
  const mediaList = getProductMedia(product)
  return mediaList.some((m) => m.type === 'video')
}
