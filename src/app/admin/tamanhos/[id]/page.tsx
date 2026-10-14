'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { SizeCategory } from '@/types'
import { SizeCategoryForm } from '@/components/admin/SizeCategoryForm'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditSizeCategoryPage() {
  const params = useParams()
  const [sizeCategory, setSizeCategory] = useState<SizeCategory | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSizeCategory() {
      if (!params?.id) return
      setLoading(true)
      const { data } = await supabase
        .from('size_categories')
        .select('*')
        .eq('id', params.id as string)
        .single()

      if (data) setSizeCategory(data)
      setLoading(false)
    }

    fetchSizeCategory()
  }, [params?.id])

  return (
    <div className="min-h-screen bg-brand-50">
      <AdminHeader />

      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <Link
            href="/admin/tamanhos"
            className="inline-flex items-center gap-2 text-brand-700 hover:text-brand-900 transition-colors font-medium text-sm mb-3"
          >
            <ArrowLeft size={16} /> Voltar para Grades de Tamanho
          </Link>
          <h2 className="text-3xl font-fredoka text-brand-900 font-bold">
            Editar Grade de Tamanho
          </h2>
          <p className="text-sm text-brand-900/60 mt-1">
            Atualize os tamanhos ou a tabela de medidas associada a esta grade.
          </p>
        </div>

        {loading ? (
          <div className="bg-white p-12 rounded-2xl border border-brand-100 text-center text-brand-900/50">
            Carregando dados da grade...
          </div>
        ) : sizeCategory ? (
          <SizeCategoryForm initialData={sizeCategory} />
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-brand-100 text-center text-brand-900/60">
            Grade de tamanho não encontrada.
          </div>
        )}
      </main>
    </div>
  )
}
