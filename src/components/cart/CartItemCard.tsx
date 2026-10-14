'use client'

import { CartItem, useCartStore } from '@/store/useCartStore'
import { formatCurrency } from '@/utils/formatters'
import { getProductCoverImage } from '@/utils/media'
import { getProductDiscount } from '@/utils/pricing'
import { Minus, Plus, Trash2, Sparkles } from 'lucide-react'

interface CartItemCardProps {
  item: CartItem
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeItem } = useCartStore()
  const discount = getProductDiscount(item.product)

  // Capa estática real da peça ou logo como fallback
  const imageUrl =
    getProductCoverImage(item.product) || '/images/logo-sem-bg.png'

  return (
    <div className="flex gap-4 py-4 border-b border-brand-100">
      <div className="w-20 h-24 bg-brand-50 rounded-xl overflow-hidden relative flex-shrink-0 flex items-center justify-center border border-brand-200">
        <img
          src={imageUrl}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
        {discount.hasDiscount && (
          <div
            className="absolute top-1 left-1 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-xs"
            style={{ backgroundColor: '#e11d48', color: '#ffffff' }}
          >
            -{discount.percent}%
          </div>
        )}
      </div>

      <div className="flex flex-col flex-grow justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-bold text-brand-900 line-clamp-2">
              {item.product.name}
            </h4>
            <button
              onClick={() => removeItem(item.product.id, item.size)}
              className="text-stone-400 hover:text-red-500 transition-colors ml-2 cursor-pointer"
              aria-label="Remover item"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <p className="text-xs text-brand-700 font-medium mt-0.5">
            Tam: {item.size}
          </p>
        </div>

        <div className="flex justify-between items-end mt-2">
          <div className="flex items-center border border-brand-200 rounded-lg bg-white shadow-2xs">
            <button
              onClick={() =>
                updateQuantity(item.product.id, item.size, item.quantity - 1)
              }
              className="p-1 text-brand-700 hover:bg-brand-50 transition-colors cursor-pointer"
            >
              <Minus size={14} />
            </button>
            <span className="text-xs font-bold w-6 text-center text-brand-900">
              {item.quantity}
            </span>
            <button
              onClick={() =>
                updateQuantity(item.product.id, item.size, item.quantity + 1)
              }
              className="p-1 text-brand-700 hover:bg-brand-50 transition-colors cursor-pointer"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="text-right">
            {discount.hasDiscount && (
              <span className="block text-[11px] text-stone-400 line-through font-normal">
                {formatCurrency(discount.originalPrice * item.quantity)}
              </span>
            )}
            <span className="text-sm font-bold text-brand-900">
              {formatCurrency(discount.effectivePrice * item.quantity)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
