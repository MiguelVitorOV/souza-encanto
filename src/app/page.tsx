import { supabase } from '@/lib/supabase'
import { ProductCard } from '@/components/ui/ProductCard'
import { Product, Category } from '@/types'
import Link from 'next/link'
import { StoreHeader } from '@/components/ui/StoreHeader'
import { StoreFooter } from '@/components/ui/StoreFooter'
import { Cloud, Star } from '@/components/ui/CloudDecorations'

// Pede ao Next.js para atualizar o cache a cada 60 segundos
export const revalidate = 60

export default async function Home({
  searchParams
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  // Busca categorias
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  // Busca produtos marcados como ativos
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (params.category && params.category !== 'all') {
    const selectedCat = categories?.find((c) => c.slug === params.category)
    if (selectedCat) {
      query = query.eq('category_id', selectedCat.id)
    }
  }

  const { data: products } = await query

  return (
    <div className="flex flex-col min-h-screen">
      <StoreHeader />
      <main className="flex-1 pb-24 pt-4 sm:pt-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Banner Ilustrado Mundo de Criança */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#FFFDF8] via-[#FFF9EE] to-[#FAF2E8] border-2 border-brand-200/80 shadow-md mb-8 sm:mb-12 p-6 sm:p-12 md:p-14 text-center">
            {/* Elementos decorativos nos cantos do banner */}
            <div className="absolute -top-4 -left-6 w-28 sm:w-44 opacity-90 pointer-events-none">
              <Cloud color="pink" smiling />
            </div>
            <div className="absolute top-3 left-24 sm:left-40 w-5 sm:w-6 h-5 sm:h-6 pointer-events-none">
              <Star />
            </div>

            <div className="absolute -top-4 -right-6 w-28 sm:w-44 opacity-90 pointer-events-none">
              <Cloud color="blue" smiling />
            </div>
            <div className="absolute top-5 right-24 sm:right-40 w-4 sm:w-5 h-4 sm:h-5 pointer-events-none">
              <Star />
            </div>

            <div className="absolute -bottom-6 -left-6 w-32 sm:w-48 opacity-80 pointer-events-none">
              <Cloud color="yellow" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 sm:w-52 opacity-80 pointer-events-none">
              <Cloud color="pink" smiling />
            </div>

            {/* Conteúdo Central */}
            <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
              {/* Logo Ampliada */}
              <div className="relative mb-4 sm:mb-6 transform hover:scale-105 transition-transform duration-300">
                <img
                  src="/images/logo.png"
                  alt="Mundo de Criança"
                  className="h-36 sm:h-56 md:h-68 w-auto object-contain drop-shadow-md"
                />
              </div>

              {/* Título com a fonte arredondada Fredoka */}
              <h1 className="font-fredoka text-2xl sm:text-4xl md:text-5xl text-brand-900 tracking-normal mb-2.5 sm:mb-4 drop-shadow-2xs">
                Moda Infantil Feita com Amor
              </h1>
              <p className="text-brand-900/80 text-sm sm:text-base md:text-lg font-medium max-w-xl mb-5 sm:mb-6 leading-relaxed">
                Peças alegres, macias e confortáveis para vestir o seu pequeno
                com todo o carinho e qualidade que ele merece.
              </p>

              {/* Destaques em pílulas fofas e coloridas */}
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-[11px] sm:text-sm font-bold text-brand-900 mb-6">
                <span className="bg-white/95 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-2xs border-2 border-[#FFA5C8]/60 flex items-center gap-1.5 hover:scale-105 transition-transform">
                  <span>🧸</span> Qualidade e conforto
                </span>
                <span className="bg-white/95 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-2xs border-2 border-[#FBDD59]/70 flex items-center gap-1.5 hover:scale-105 transition-transform">
                  <span>💖</span> Produtos com amor
                </span>
                <span className="bg-white/95 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-2xs border-2 border-[#7CC2F5]/70 flex items-center gap-1.5 hover:scale-105 transition-transform">
                  <span>🌈</span> Para todas as fases
                </span>
              </div>

              {/* Botão de Ação Direta para descer aos produtos */}
              <a
                href="#produtos"
                className="inline-flex items-center gap-2 bg-brand-700 text-white font-fredoka px-6 py-2.5 sm:px-8 sm:py-3 rounded-full text-sm sm:text-base font-bold shadow-md hover:bg-brand-800 hover:scale-105 active:scale-95 transition-all"
              >
                🛍️ Conhecer Produtos ↓
              </a>
            </div>
          </div>

          {/* Âncora e Filtro de Categorias */}
          <div id="produtos" className="scroll-mt-24">
            {categories && categories.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 pb-2 px-1">
                <Link
                  href="/#produtos"
                  className={`whitespace-nowrap px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all border-2 shadow-xs ${
                    !params.category || params.category === 'all'
                      ? 'bg-brand-700 text-white border-brand-700 shadow-md scale-105'
                      : 'bg-white text-brand-900 border-brand-200 hover:border-brand-500 hover:bg-brand-50'
                  }`}
                >
                  🌟 Todos os Produtos
                </Link>
                {categories.map((cat: Category) => (
                  <Link
                    key={cat.id}
                    href={`/?category=${cat.slug}#produtos`}
                    className={`whitespace-nowrap px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all border-2 shadow-xs ${
                      params.category === cat.slug
                        ? 'bg-brand-700 text-white border-brand-700 shadow-md scale-105'
                        : 'bg-white text-brand-900 border-brand-200 hover:border-brand-500 hover:bg-brand-50'
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}

            {!products || products.length === 0 ? (
              <div className="text-center py-16 sm:py-20 px-6 bg-white/90 backdrop-blur-xs rounded-3xl border-2 border-brand-200 shadow-sm max-w-lg mx-auto">
                <span className="text-5xl mb-4 block animate-bounce">🧸</span>
                <h2 className="font-fredoka text-xl sm:text-2xl text-brand-900 font-bold mb-2">
                  Vitrine em preparação
                </h2>
                <p className="text-brand-900/70 text-sm font-medium">
                  Nenhum produto disponível no momento. Volte em breve para se
                  encantar com as novidades!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3.5 gap-y-8 sm:gap-x-6 sm:gap-y-12">
                {products.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  )
}
