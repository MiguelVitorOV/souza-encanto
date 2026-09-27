'use client'
import { useEffect, useState, use } from 'react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'
import { ProductForm } from '@/components/admin/ProductForm'
import { ProductInterestsManager } from '@/components/admin/ProductInterestsManager'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditProduct({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', resolvedParams.id)
        .single()
      if (data) setProduct(data)
      setLoading(false)
    }
    fetchProduct()
  }, [resolvedParams.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-50">
        <div className="w-10 h-10 border-4 border-brand-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="p-8 text-center text-red-500 bg-brand-50 min-h-screen">
        Produto não encontrado.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/admin"
            className="p-3 text-brand-600 hover:bg-brand-100 bg-white rounded-full transition-colors shadow-sm border border-brand-100"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-light text-brand-900">
              Editar Produto
            </h1>
            <p className="text-brand-600 mt-1">
              Atualize as informações de {product.name}
            </p>
          </div>
        </div>
        <ProductForm initialData={product} />
        <ProductInterestsManager product={product} />
      </div>
    </div>
  )
}
