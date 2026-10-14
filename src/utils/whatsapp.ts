import { CartItem } from '@/store/useCartStore'
import { formatCurrency } from './formatters'
import { STORE_CONFIG } from '@/config/constants'
import { getProductDiscount } from './pricing'

export const generateWhatsAppLink = (
  items: CartItem[],
  phone: string = STORE_CONFIG.WHATSAPP_NUMBER
): string => {
  let message =
    'Olá, Mundo de Criança! Gostaria de fechar o seguinte pedido:\n\n'

  let total = 0
  let totalSavings = 0
  items.forEach((item) => {
    const discountInfo = getProductDiscount(item.product)
    const effectivePrice = discountInfo.effectivePrice
    const itemTotal = effectivePrice * item.quantity
    total += itemTotal
    if (discountInfo.hasDiscount) {
      totalSavings += discountInfo.savings * item.quantity
    }

    message += `🛍️ ${item.quantity}x ${item.product.name} (Tamanho: ${item.size})\n`
    if (discountInfo.hasDiscount) {
      message += `   Valor un.: ${formatCurrency(effectivePrice)} 🔥 (-${discountInfo.percent}% OFF! De ${formatCurrency(discountInfo.originalPrice)})\n\n`
    } else {
      message += `   Valor un.: ${formatCurrency(effectivePrice)}\n\n`
    }
  })

  if (totalSavings > 0) {
    message += `🎉 *Economizando:* ${formatCurrency(totalSavings)}\n`
  }
  message += `*Total estimado:* ${formatCurrency(total)}\n\n`
  message += `Como podemos prosseguir com o pagamento e entrega?`

  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${phone}?text=${encodedMessage}`
}
