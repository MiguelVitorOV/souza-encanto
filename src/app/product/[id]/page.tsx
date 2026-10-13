import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { ClientProductDetails } from './ClientProductDetails'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { StoreHeader } from '@/components/ui/StoreHeader'
import { StoreFooter } from '@/components/ui/StoreFooter'

export const revalidate = 60

export default async function ProductPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Busca o produto e assegura que ele esteja ativo
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (!product) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <StoreHeader />
      <main className="flex-1 pb-20 pt-4 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Botão de retorno estilizado */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-brand-900 font-bold text-xs sm:text-sm bg-white/90 border-2 border-brand-200 px-4 py-2 rounded-full mb-6 hover:bg-brand-100 hover:border-brand-300 transition-all shadow-2xs w-max active:scale-95"
          >
            <ArrowLeft size={16} /> Voltar para vitrine
          </Link>

          {/* Card Principal da Peça no Fundo Bege */}
          <div className="bg-white/95 rounded-3xl p-5 sm:p-8 md:p-10 border-2 border-brand-200/80 shadow-xs">
            <ClientProductDetails product={product} />
          </div>
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}
