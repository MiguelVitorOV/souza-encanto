'use client'

import { useCartStore } from '@/store/useCartStore'
import { X, ShoppingBag } from 'lucide-react'
import { CartItemCard } from './CartItemCard'
import { formatCurrency } from '@/utils/formatters'
import { generateWhatsAppLink } from '@/utils/whatsapp'
import { useEffect, useState } from 'react'

export function CartSidebar() {
  const { isCartOpen, setCartOpen, items } = useCartStore()
  const [mounted, setMounted] = useState(false)

  // Hydration fix for Zustand + Next.js SSR
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const total = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  )

  const handleCheckout = () => {
    const link = generateWhatsAppLink(items)
    window.open(link, '_blank')
  }

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity backdrop-blur-sm"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-brand-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-brand-800" size={20} />
            <h2 className="text-lg font-medium text-brand-800">Seu Carrinho</h2>
            <span className="bg-brand-100 text-brand-800 text-xs px-2 py-1 rounded-full font-medium">
              {items.length}
            </span>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 text-brand-400 hover:text-brand-800 hover:bg-brand-50 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-brand-500 space-y-4">
              <ShoppingBag size={48} className="text-brand-200 opacity-50" />
              <p>Seu carrinho está vazio.</p>
              <button
                onClick={() => setCartOpen(false)}
                className="text-sm font-medium text-brand-800 hover:underline"
              >
                Continuar explorando
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {items.map((item, idx) => (
                <CartItemCard
                  key={`${item.product.id}-${item.size}-${idx}`}
                  item={item}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-brand-100 bg-brand-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-brand-700">Total estimado</span>
              <span className="text-lg font-bold text-brand-900">
                {formatCurrency(total)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-brand-700 text-white font-medium py-3 rounded-md hover:bg-brand-800 transition-colors shadow-sm flex items-center justify-center gap-2 mb-3"
            >
              Finalizar no WhatsApp
            </button>
            <button
              onClick={() => setCartOpen(false)}
              className="w-full bg-white border border-brand-200 text-brand-800 font-medium py-3 rounded-md hover:bg-brand-50 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              Continuar comprando
            </button>
            <p className="text-xs text-center text-brand-500 mt-4">
              O pagamento e entrega serão combinados diretamente com o
              atendimento.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
