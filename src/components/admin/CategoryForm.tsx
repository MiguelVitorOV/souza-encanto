'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Category } from '@/types'

export function CategoryForm({ initialData }: { initialData?: Category }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(initialData?.name || '')

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const slug = generateSlug(name)

    if (initialData) {
      const { error } = await supabase
        .from('categories')
        .update({ name, slug })
        .eq('id', initialData.id)
      if (error) alert(error.message)
      else router.push('/admin/categories')
    } else {
      const { error } = await supabase
        .from('categories')
        .insert([{ name, slug }])
      if (error) alert(error.message)
      else router.push('/admin/categories')
    }
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-brand-100 max-w-xl mx-auto"
    >
      <div>
        <label className="block text-sm font-medium text-brand-800 mb-2">
          Nome da Categoria
        </label>
        <input
          required
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-brand-200 rounded-lg focus:ring-2 focus:ring-brand-400 focus:outline-none bg-brand-50/50"
        />
      </div>
      <div className="pt-6 border-t border-brand-100 flex justify-end gap-4 mt-8">
        <button
          type="button"
          onClick={() => router.push('/admin/categories')}
          className="px-6 py-3 text-brand-700 font-medium hover:bg-brand-50 rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-brand-700 text-white font-medium rounded-lg hover:bg-brand-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  )
}
