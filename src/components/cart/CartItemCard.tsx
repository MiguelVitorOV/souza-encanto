'use client'

import { CartItem, useCartStore } from '@/store/useCartStore'
import { formatCurrency } from '@/utils/formatters'
import { Minus, Plus, Trash2 } from 'lucide-react'

interface CartItemCardProps {
  item: CartItem
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeItem } = useCartStore()

  // Imagem real ou logo como fallback
  const imageUrl =
    item.product.images && item.product.images.length > 0
      ? item.product.images[0]
      : '/images/logo-sem-bg.png'

  return (
    <div className="flex gap-4 py-4 border-b border-brand-100">
      <div className="w-20 h-24 bg-brand-50 rounded-md overflow-hidden relative flex-shrink-0 flex items-center justify-center">
        {/* Usando tag img nativa momentaneamente até configurar o remotePatterns do Supabase no Next config */}
        <img
          src={imageUrl}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col flex-grow justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-medium text-brand-900 line-clamp-2">
              {item.product.name}
            </h4>
            <button
              onClick={() => removeItem(item.product.id, item.size)}
              className="text-brand-400 hover:text-brand-700 transition-colors ml-2"
              aria-label="Remover item"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <p className="text-xs text-brand-600 mt-1">Tam: {item.size}</p>
        </div>

        <div className="flex justify-between items-end mt-2">
          <div className="flex items-center border border-brand-200 rounded-md">
            <button
              onClick={() =>
                updateQuantity(item.product.id, item.size, item.quantity - 1)
              }
              className="p-1 text-brand-700 hover:bg-brand-50 transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="text-xs font-medium w-6 text-center text-brand-900">
              {item.quantity}
            </span>
            <button
              onClick={() =>
                updateQuantity(item.product.id, item.size, item.quantity + 1)
              }
              className="p-1 text-brand-700 hover:bg-brand-50 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          <span className="text-sm font-semibold text-brand-900">
            {formatCurrency(item.product.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  )
}
