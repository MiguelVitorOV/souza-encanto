'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Category } from '@/types'
import { CategoryForm } from '@/components/admin/CategoryForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useParams } from 'next/navigation'

export default function EditCategory() {
  const params = useParams()
  const [category, setCategory] = useState<Category | null>(null)

  useEffect(() => {
    async function fetchCat() {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .eq('id', params.id as string)
        .single()
      if (data) setCategory(data)
    }
    fetchCat()
  }, [params.id])

  return (
    <div className="min-h-screen bg-brand-50">
      <header className="bg-white border-b border-brand-100 px-6 py-4 shadow-sm">
        <Link
          href="/admin/categories"
          className="flex items-center gap-2 text-brand-600 hover:text-brand-900 w-max"
        >
          <ArrowLeft size={18} /> Voltar para Categorias
        </Link>
      </header>
      <main className="max-w-4xl mx-auto p-6 pt-12">
        <h2 className="text-3xl font-light text-brand-800 mb-8 text-center">
          Editar Categoria
        </h2>
        {category ? (
          <CategoryForm initialData={category} />
        ) : (
          <div className="text-center mt-10">Carregando...</div>
        )}
      </main>
    </div>
  )
}
