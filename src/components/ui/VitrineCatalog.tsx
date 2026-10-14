'use client'

import { useState, useMemo } from 'react'
import { Product, Category } from '@/types'
import { ProductCard } from '@/components/ui/ProductCard'
import { X, Filter } from 'lucide-react'

interface VitrineProduct extends Product {
  product_categories?: { category_id: string }[]
}

interface VitrineCatalogProps {
  products: VitrineProduct[]
  categories: Category[]
}

export function VitrineCatalog({ products, categories }: VitrineCatalogProps) {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])

  const toggleCategory = (categoryId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const clearFilters = () => {
    setSelectedCategoryIds([])
  }

  const filteredProducts = useMemo(() => {
    if (selectedCategoryIds.length === 0) {
      return products
    }

    return products.filter((prod) => {
      const prodCategoryIds = (prod.product_categories || []).map(
        (pc) => pc.category_id
      )
      // O produto aparece se pertencer a pelo menos uma das categorias selecionadas
      return selectedCategoryIds.some((selectedId) =>
        prodCategoryIds.includes(selectedId)
      )
    })
  }, [products, selectedCategoryIds])

  return (
    <div id="produtos" className="scroll-mt-24">
      {/* Barra de Filtros por Categoria com suporte a Multi-Seleção */}
      {categories && categories.length > 0 && (
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 pb-2 px-1">
            {/* Botão Todos */}
            <button
              type="button"
              onClick={clearFilters}
              className={`cursor-pointer whitespace-nowrap px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all border-2 shadow-xs active:scale-95 ${
                selectedCategoryIds.length === 0
                  ? 'bg-brand-700 text-white border-brand-700 shadow-md scale-105'
                  : 'bg-white text-brand-900 border-brand-200 hover:border-brand-500 hover:bg-brand-50'
              }`}
            >
              🌟 Todos os Produtos
            </button>

            {/* Chips de Categorias Individuais */}
            {categories.map((cat) => {
              const isSelected = selectedCategoryIds.includes(cat.id)
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`cursor-pointer whitespace-nowrap px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all border-2 shadow-xs active:scale-95 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-brand-700 text-white border-brand-700 shadow-md scale-105'
                      : 'bg-white text-brand-900 border-brand-200 hover:border-brand-500 hover:bg-brand-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </button>
              )
            })}

            {/* Botão Limpar Filtros quando houver seleção */}
            {selectedCategoryIds.length > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="cursor-pointer whitespace-nowrap px-3.5 py-2 rounded-full text-xs font-bold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 transition-all flex items-center gap-1 active:scale-95"
                title="Limpar todos os filtros"
              >
                <X size={14} />
                <span>Limpar filtros ({selectedCategoryIds.length})</span>
              </button>
            )}
          </div>

          {/* Contador de peças exibidas */}
          <div className="text-center mt-3 text-xs sm:text-sm font-medium text-brand-900/60">
            {selectedCategoryIds.length > 0 ? (
              <span className="inline-flex items-center gap-1.5 bg-brand-50 border border-brand-200/60 px-3 py-1 rounded-full">
                <Filter size={13} className="text-brand-700" />
                <span>
                  {filteredProducts.length}{' '}
                  {filteredProducts.length === 1
                    ? 'peça encontrada'
                    : 'peças encontradas'}{' '}
                  nos filtros selecionados
                </span>
              </span>
            ) : (
              <span>Exibindo todas as {products.length} peças</span>
            )}
          </div>
        </div>
      )}

      {/* Grid de Produtos ou Estado Vazio */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 sm:py-20 px-6 bg-white/90 backdrop-blur-xs rounded-3xl border-2 border-brand-200 shadow-sm max-w-lg mx-auto">
          <span className="text-5xl mb-4 block animate-bounce">🔍</span>
          <h2 className="font-fredoka text-xl sm:text-2xl text-brand-900 font-bold mb-2">
            Nenhuma peça encontrada
          </h2>
          <p className="text-brand-900/70 text-sm font-medium mb-5">
            Não encontramos peças com a combinação de categorias selecionadas.
            Tente remover alguns filtros!
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="cursor-pointer inline-flex items-center gap-2 bg-brand-700 text-white font-fredoka px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:bg-brand-800 transition-all active:scale-95"
          >
            Ver Todas as Peças
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3.5 gap-y-8 sm:gap-x-6 sm:gap-y-12">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
