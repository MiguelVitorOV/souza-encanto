import { Product } from '@/types'

export interface ProductDiscountInfo {
  hasDiscount: boolean
  percent: number
  originalPrice: number
  effectivePrice: number
  savings: number
}

/**
 * Retorna o preço efetivo a ser cobrado pelo produto (promocional caso ativo, ou normal)
 */
export function getProductEffectivePrice(product: Product): number {
  const originalPrice = Number(product.price) || 0
  const promoPrice =
    product.promotional_price !== null &&
    product.promotional_price !== undefined
      ? Number(product.promotional_price)
      : null

  if (
    promoPrice !== null &&
    !isNaN(promoPrice) &&
    promoPrice > 0 &&
    promoPrice < originalPrice
  ) {
    return promoPrice
  }
  return originalPrice
}

/**
 * Retorna detalhes completos do desconto do produto para exibição na vitrine, detalhes e carrinho
 */
export function getProductDiscount(product: Product): ProductDiscountInfo {
  const originalPrice = Number(product.price) || 0
  const promoPrice =
    product.promotional_price !== null &&
    product.promotional_price !== undefined
      ? Number(product.promotional_price)
      : null

  const hasDiscount =
    promoPrice !== null &&
    !isNaN(promoPrice) &&
    promoPrice > 0 &&
    promoPrice < originalPrice

  if (!hasDiscount) {
    return {
      hasDiscount: false,
      percent: 0,
      originalPrice,
      effectivePrice: originalPrice,
      savings: 0
    }
  }

  const effectivePrice = promoPrice!
  const savings = originalPrice - effectivePrice
  const percent = Math.round((savings / originalPrice) * 100)

  return {
    hasDiscount: true,
    percent,
    originalPrice,
    effectivePrice,
    savings
  }
}
