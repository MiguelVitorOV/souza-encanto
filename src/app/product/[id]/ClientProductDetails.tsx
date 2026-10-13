'use client'

import { useState, useEffect, useRef } from 'react'
import { Product } from '@/types'
import { formatCurrency } from '@/utils/formatters'
import { useCartStore } from '@/store/useCartStore'
import { STORE_CONFIG } from '@/config/constants'
import {
  getProductAccentColor,
  getSizeColorPalette,
  getRandomColorPalette,
  ColorScheme
} from '@/utils/colors'

interface ClientProductDetailsProps {
  product: Product
}

const SIZE_ORDER: Record<string, number> = {
  RN: 1,
  '1M': 2,
  '2M': 3,
  '3M': 4,
  '6M': 5,
  '9M': 6,
  '12M': 7,
  '1': 8,
  '2': 9,
  '3': 10,
  '4': 11,
  '6': 12,
  '8': 13,
  '10': 14,
  '12': 15,
  '14': 16,
  '16': 17,
  P: 18,
  M: 19,
  G: 20,
  GG: 21,
  U: 99
}

export function ClientProductDetails({ product }: ClientProductDetailsProps) {
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [activeImage, setActiveImage] = useState<string>(
    product.images?.[0] || ''
  )
  const [accent, setAccent] = useState<ColorScheme>(() =>
    getProductAccentColor(product.id)
  )
  const buttonSlotRef = useRef<HTMLDivElement>(null)
  const [isDocked, setIsDocked] = useState<boolean>(true)
  const { addItem, setCartOpen } = useCartStore()

  // Sorteia aleatoriamente entre Rosa, Azul e Amarelo a cada acesso/visita à página
  useEffect(() => {
    setAccent(getRandomColorPalette())
  }, [])

  // Comportamento do botão: flutuante no mobile até alcançar o local do botão no card
  useEffect(() => {
    const checkPosition = () => {
      if (!buttonSlotRef.current) return
      // No desktop (>= 768px), o botão sempre fica no fluxo normal
      if (window.innerWidth >= 768) {
        setIsDocked(true)
        return
      }

      const rect = buttonSlotRef.current.getBoundingClientRect()
      // Quando o slot entra na área visível da tela (atinge ou passa a posição da barra flutuante),
      // ele deixa de flutuar e ancora (fica fixo) no seu lugar original no card.
      const isPastSlot = rect.top <= window.innerHeight - 80
      setIsDocked(isPastSlot)
    }

    checkPosition()
    window.addEventListener('scroll', checkPosition, { passive: true })
    window.addEventListener('resize', checkPosition, { passive: true })

    return () => {
      window.removeEventListener('scroll', checkPosition)
      window.removeEventListener('resize', checkPosition)
    }
  }, [])

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      return alert('Por favor, selecione um tamanho antes de prosseguir.')
    }
    addItem(product, selectedSize || 'U')
    setCartOpen(true)
  }

  const handleInterested = (sizeName?: string) => {
    const sizeText = sizeName ? ` no tamanho *${sizeName}*` : ''
    const text = `Olá, Mundo de Criança! Tenho interesse na peça *${product.name}*${sizeText}, mas vi no site que está esgotada no momento. Poderia me avisar caso chegue reposição?`
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
    <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16">
      {/* Galeria de Fotos */}
      <div className="w-full md:w-1/2 flex flex-col gap-4">
        <div className="aspect-[4/5] bg-brand-50 w-full overflow-hidden rounded-2xl border-2 border-brand-200/80 shadow-2xs">
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
          <div className="flex gap-3 px-1 md:px-0 overflow-x-auto pb-2 no-scrollbar">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`w-20 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                  activeImage === img
                    ? 'border-brand-700 shadow-md scale-105'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
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

      {/* Informações da Peça */}
      <div className="w-full md:w-1/2 flex flex-col">
        {isCompletelyOutOfStock && (
          <span className="inline-block bg-stone-900 text-white text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full w-max mb-3">
            Esgotado
          </span>
        )}

        <h1 className="font-fredoka text-3xl sm:text-4xl text-brand-900 mb-2 leading-tight">
          {product.name}
        </h1>

        {/* Preço com cor aleatória entre Rosa (#D82B66), Azul (#0284C7) e Amarelo (#D97706) */}
        <p
          className={`font-bold text-2xl sm:text-3xl ${accent.priceClass} mb-6 transition-colors duration-300`}
        >
          {formatCurrency(product.price)}
        </p>

        {/* Descrição em cor de máxima legibilidade (Marrom Chocolate Nítido) */}
        {product.description && (
          <div className="mb-8 p-4 bg-brand-50/70 rounded-2xl border border-brand-200/60">
            <h3 className="font-fredoka text-xs text-brand-900/70 mb-2 uppercase tracking-wider font-bold">
              Detalhes da Peça
            </h3>
            <p className="text-brand-900/90 leading-relaxed font-medium text-sm sm:text-base whitespace-pre-wrap">
              {product.description}
            </p>
          </div>
        )}

        {/* Seleção de Tamanhos com cores intercaladas (Rosa, Azul, Amarelo) */}
        {sortedSizes.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-fredoka text-xs text-brand-900/70 uppercase tracking-wider font-bold">
                Escolha o Tamanho
              </h3>
            </div>
            <div className="flex gap-3 flex-wrap">
              {sortedSizes.map((s, idx) => {
                const palette = getSizeColorPalette(idx)
                const isSelected = selectedSize === s.size

                return (
                  <button
                    key={s.size}
                    type="button"
                    onClick={() =>
                      s.inStock
                        ? setSelectedSize(s.size)
                        : handleInterested(s.size)
                    }
                    className={`w-14 h-14 rounded-2xl font-bold transition-all text-sm relative overflow-hidden flex items-center justify-center cursor-pointer ${
                      !s.inStock
                        ? 'bg-brand-50 text-stone-400 border-2 border-stone-200 opacity-60'
                        : isSelected
                          ? `${palette.bgActiveClass} shadow-md scale-110 ring-2 ring-offset-2 ring-brand-200`
                          : `${palette.bgLightClass} border-2 hover:scale-105`
                    }`}
                  >
                    {s.size}
                    {!s.inStock && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-full h-[1.5px] bg-stone-400 -rotate-45" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
            {sortedSizes.some((s) => !s.inStock) && (
              <p className="text-xs text-brand-900/60 mt-3 font-medium">
                *Tamanhos com risco estão esgotados. Clique neles para pedir
                aviso de reposição.
              </p>
            )}
          </div>
        )}

        {/* Slot do Botão de Adicionar ao Carrinho */}
        <div
          ref={buttonSlotRef}
          className="mt-auto pt-6 border-t-2 border-brand-100 min-h-[88px]"
        >
          <div
            className={
              isDocked
                ? 'w-full transition-all duration-300'
                : 'fixed md:static bottom-0 left-0 w-full md:w-auto p-4 md:p-0 z-30 pointer-events-none transition-all duration-300'
            }
          >
            <div className="max-w-md mx-auto md:max-w-none pointer-events-auto">
              {isCompletelyOutOfStock ? (
                <button
                  onClick={() => handleInterested()}
                  className="w-full bg-stone-900 text-white font-fredoka text-base sm:text-lg py-4 rounded-2xl hover:bg-stone-800 transition-all shadow-xl active:scale-[0.98] cursor-pointer"
                >
                  Avisar Quando Chegar (WhatsApp)
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-brand-700 text-white font-fredoka text-base sm:text-lg py-4 rounded-2xl hover:bg-brand-800 transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] cursor-pointer"
                >
                  Adicionar ao Carrinho 🛍️
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
