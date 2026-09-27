import { supabase } from '@/lib/supabase'
import { ProductCard } from '@/components/ui/ProductCard'
import { Product, Category } from '@/types'
import Link from 'next/link'
import { StoreHeader } from '@/components/ui/StoreHeader'
import { StoreFooter } from '@/components/ui/StoreFooter'

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
      <main className="flex-1 bg-white pb-24 pt-8 px-5">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 text-center mt-6">
            <h1 className="text-4xl md:text-5xl font-light text-brand-900 mb-4 tracking-tight">
              Souza Encanto
            </h1>
            <p className="text-brand-600 font-light max-w-md mx-auto text-sm md:text-base">
              Moda íntima e pijamas escolhidos a dedo para o seu conforto.
            </p>
          </header>

          {/* Filtro de Categorias */}
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mb-10 pb-2 px-1">
              <Link
                href="/"
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-colors border ${!params.category || params.category === 'all' ? 'bg-brand-700 text-white border-brand-700 shadow-md' : 'bg-brand-50 text-brand-700 border-brand-200 hover:bg-brand-100'}`}
              >
                Todos
              </Link>
              {categories.map((cat: Category) => (
                <Link
                  key={cat.id}
                  href={`/?category=${cat.slug}`}
                  className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-colors border ${params.category === cat.slug ? 'bg-brand-700 text-white border-brand-700 shadow-md' : 'bg-brand-50 text-brand-700 border-brand-200 hover:bg-brand-100'}`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          {!products || products.length === 0 ? (
            <div className="text-center py-20 px-6 bg-brand-50 rounded-2xl border border-brand-100">
              <h2 className="text-xl text-brand-800 font-light mb-2">
                Vitrine em preparação
              </h2>
              <p className="text-brand-500">
                Nenhum produto disponível no momento. Volte em breve!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14">
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}
