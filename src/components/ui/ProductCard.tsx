import Link from 'next/link'
import { Product } from '@/types'
import { formatCurrency } from '@/utils/formatters'
import { getProductAccentColor } from '@/utils/colors'
import { getProductCoverImage } from '@/utils/media'

export function ProductCard({ product }: { product: Product }) {
  const isCompletelyOutOfStock =
    product.is_out_of_stock ||
    (product.sizes &&
      product.sizes.length > 0 &&
      product.sizes.every((s) => !s.inStock))

  const accent = getProductAccentColor(product.id)
  const coverImage = getProductCoverImage(product)

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block bg-white/95 rounded-3xl p-3 border-2 border-brand-200/80 hover:border-brand-500 shadow-xs hover:shadow-md transition-all duration-300"
    >
      <div className="relative aspect-[3/4] bg-brand-50 rounded-2xl overflow-hidden mb-3 border border-brand-100">
        {coverImage ? (
          <img
            src={coverImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-300 text-sm">
            Sem Imagem
          </div>
        )}

        {isCompletelyOutOfStock && (
          <div className="absolute top-2.5 left-2.5 bg-stone-900/85 backdrop-blur-xs text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full shadow-md">
            Esgotado
          </div>
        )}
      </div>

      <div className="px-1 pb-1">
        <h3 className="font-fredoka text-brand-900 text-base leading-snug mb-1.5 line-clamp-2 group-hover:text-brand-700 transition-colors">
          {product.name}
        </h3>
        <p className={`font-bold text-base md:text-lg ${accent.priceClass}`}>
          {formatCurrency(product.price)}
        </p>
      </div>
    </Link>
  )
}
