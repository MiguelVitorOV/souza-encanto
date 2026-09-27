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
      <main className="flex-1 bg-white">
        <div className="max-w-6xl mx-auto md:py-8 md:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-brand-600 p-5 md:p-0 md:mb-8 hover:text-brand-900 transition-colors font-medium text-sm"
          >
            <ArrowLeft size={18} /> Voltar para vitrine
          </Link>
          <ClientProductDetails product={product} />
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}
