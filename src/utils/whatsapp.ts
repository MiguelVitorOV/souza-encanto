import { CartItem } from '@/store/useCartStore'
import { formatCurrency } from './formatters'
import { STORE_CONFIG } from '@/config/constants'

export const generateWhatsAppLink = (
  items: CartItem[],
  phone: string = STORE_CONFIG.WHATSAPP_NUMBER
): string => {
  let message = 'Olá, Souza Encanto! Gostaria de fechar o seguinte pedido:\n\n'

  let total = 0
  items.forEach((item) => {
    const itemTotal = item.product.price * item.quantity
    total += itemTotal
    message += `🛍️ ${item.quantity}x ${item.product.name} (Tamanho: ${item.size})\n`
    message += `   Valor un.: ${formatCurrency(item.product.price)}\n\n`
  })

  message += `*Total estimado: ${formatCurrency(total)}*\n\n`
  message += `Como podemos prosseguir com o pagamento e entrega?`

  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${phone}?text=${encodedMessage}`
}
