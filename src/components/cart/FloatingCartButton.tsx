'use client'

import { useCartStore } from '@/store/useCartStore'
import { ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function FloatingCartButton() {
  const { items, toggleCart, isCartOpen } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || items.length === 0 || isCartOpen) return null

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const isProductPage = pathname?.startsWith('/product/')

  return (
    <button
      onClick={toggleCart}
      className={`fixed right-5 md:right-8 z-30 bg-brand-700 text-white p-4 rounded-full shadow-xl hover:bg-brand-800 hover:scale-105 transition-all flex items-center justify-center ${isProductPage ? 'bottom-28 md:bottom-6' : 'bottom-6'}`}
      aria-label="Abrir carrinho"
    >
      <div className="relative">
        <ShoppingBag size={24} />
        <span className="absolute -top-2 -right-2 bg-brand-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-brand-800">
          {itemCount}
        </span>
      </div>
    </button>
  )
}
