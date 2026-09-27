'use client'

import { useState } from 'react'
import { Product } from '@/types'
import { formatCurrency } from '@/utils/formatters'
import { useCartStore } from '@/store/useCartStore'
import { STORE_CONFIG } from '@/config/constants'

const SIZE_ORDER: Record<string, number> = {
  PP: 1,
  P: 2,
  M: 3,
  G: 4,
  GG: 5,
  XG: 6,
  U: 7
}

export function ClientProductDetails({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [activeImage, setActiveImage] = useState<string>(
    product.images?.[0] || ''
  )
  const { addItem, setCartOpen } = useCartStore()

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      return alert('Por favor, selecione um tamanho antes de prosseguir.')
    }
    addItem(product, selectedSize || 'U')
    setCartOpen(true)
  }

  const handleInterested = (sizeName?: string) => {
    const sizeText = sizeName ? ` no tamanho *${sizeName}*` : ''
    const text = `Olá, Souza Encanto! Tenho interesse na peça *${product.name}*${sizeText}, mas vi no site que está esgotada no momento. Poderia me avisar caso chegue reposição?`
    window.open(
      `https://wa.me/${STORE_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      '_blank'
    )
  }

  const sortedSizes = product.sizes
    ? [...product.sizes].sort(
        (a, b) =>
          (SIZE_ORDER[a.size.toUpperCase()] || 99) -
          (SIZE_ORDER[b.size.toUpperCase()] || 99)
      )
    : []

  const isCompletelyOutOfStock =
    product.is_out_of_stock ||
    (sortedSizes.length > 0 && sortedSizes.every((s) => !s.inStock))

  return (
    <div className="flex flex-col md:flex-row gap-0 md:gap-12 lg:gap-16">
      <div className="w-full md:w-1/2 flex flex-col gap-4">
        <div className="aspect-[4/5] bg-brand-50 w-full overflow-hidden md:rounded-2xl border-y md:border border-brand-100">
          {activeImage ? (
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-300">
              Sem imagem
            </div>
          )}
        </div>

        {product.images && product.images.length > 1 && (
          <div className="flex gap-3 px-5 md:px-0 overflow-x-auto pb-4 no-scrollbar">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`w-20 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-brand-700 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img
                  src={img}
                  alt="Miniatura"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-full md:w-1/2 px-6 md:px-0 flex flex-col pb-24 md:pb-8 pt-6 md:pt-0">
        {isCompletelyOutOfStock && (
          <span className="inline-block bg-stone-900 text-white text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full w-max mb-4">
            Esgotado
          </span>
        )}

        <h1 className="text-3xl font-light text-brand-900 mb-2 leading-tight">
          {product.name}
        </h1>
        <p className="text-2xl font-semibold text-brand-700 mb-8">
          {formatCurrency(product.price)}
        </p>

        {product.description && (
          <div className="mb-10">
            <h3 className="text-xs font-semibold text-brand-900 mb-3 uppercase tracking-widest">
              Detalhes da Peça
            </h3>
            <p className="text-brand-700 leading-relaxed font-light whitespace-pre-wrap">
              {product.description}
            </p>
          </div>
        )}

        {sortedSizes.length > 0 && (
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-semibold text-brand-900 uppercase tracking-widest">
                Tamanho
              </h3>
            </div>
            <div className="flex gap-3 flex-wrap">
              {sortedSizes.map((s) => (
                <button
                  key={s.size}
                  onClick={() =>
                    s.inStock
                      ? setSelectedSize(s.size)
                      : handleInterested(s.size)
                  }
                  className={`w-14 h-14 rounded-full font-medium transition-all text-sm relative overflow-hidden flex items-center justify-center ${
                    !s.inStock
                      ? 'bg-brand-50 text-brand-300 border border-brand-200 opacity-60' // Removemos line-through e usamos um risco diagonal css
                      : selectedSize === s.size
                        ? 'bg-brand-700 text-white shadow-md'
                        : 'bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200'
                  }`}
                >
                  {s.size}
                  {!s.inStock && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-full h-[1.5px] bg-brand-300 -rotate-45" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            {sortedSizes.some((s) => !s.inStock) && (
              <p className="text-xs text-brand-500 mt-3 font-light">
                *Tamanhos cortados estão esgotados. Clique neles para pedir
                aviso de reposição.
              </p>
            )}
          </div>
        )}

        <div className="fixed md:static bottom-0 left-0 w-full md:w-auto p-4 md:p-0 bg-white md:bg-transparent border-t md:border-none border-brand-100 z-10 mt-auto md:mt-8 pt-4 md:pt-8 md:border-t-2">
          {isCompletelyOutOfStock ? (
            <button
              onClick={() => handleInterested()}
              className="w-full bg-stone-900 text-white font-medium py-4 rounded-xl hover:bg-stone-800 transition-colors shadow-lg active:scale-[0.98]"
            >
              Avisar Quando Chegar (WhatsApp)
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full bg-brand-700 text-white font-medium py-4 rounded-xl hover:bg-brand-800 transition-colors shadow-lg active:scale-[0.98]"
            >
              Adicionar ao Carrinho
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
