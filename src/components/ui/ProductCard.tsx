import Link from 'next/link'
import { Product } from '@/types'
import { formatCurrency } from '@/utils/formatters'

export function ProductCard({ product }: { product: Product }) {
  const isCompletelyOutOfStock =
    product.is_out_of_stock ||
    (product.sizes &&
      product.sizes.length > 0 &&
      product.sizes.every((s) => !s.inStock))

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] bg-brand-50 rounded-2xl overflow-hidden mb-4 border border-brand-100 shadow-sm">
        {product.images && product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-300">
            Sem Imagem
          </div>
        )}

        {isCompletelyOutOfStock && (
          <div className="absolute top-3 left-3 bg-stone-900/85 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full shadow-lg">
            Esgotado
          </div>
        )}
      </div>

      <div className="px-1">
        <h3 className="text-brand-900 font-medium text-sm md:text-base leading-snug mb-1 line-clamp-2 group-hover:text-brand-700 transition-colors">
          {product.name}
        </h3>
        <p className="text-brand-700 font-semibold">
          {formatCurrency(product.price)}
        </p>
      </div>
    </Link>
  )
}
