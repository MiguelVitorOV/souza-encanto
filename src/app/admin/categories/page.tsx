'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Category } from '@/types'
import { Plus, Edit2, LogOut, ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { AdminHeader } from '@/components/admin/AdminHeader'

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  const fetchCategories = async () => {
    setLoading(true)
    const { data } = await supabase.from('categories').select('*').order('name')
    if (data) setCategories(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (
      window.confirm(
        `Tem certeza que deseja DELETAR a categoria "${name}"?\nIsso não apagará os produtos, mas eles perderão essa categorização.`
      )
    ) {
      if (
        window.confirm(
          `DUPLA CONFIRMAÇÃO:\nExcluir definitivamente a categoria "${name}"?`
        )
      ) {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', id)
        if (!error) {
          fetchCategories()
        } else {
          alert('Erro ao excluir categoria. Tente novamente.')
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-brand-50">
      <AdminHeader />

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-light text-brand-800">Categorias</h2>
          </div>
          <Link
            href="/admin/categories/new"
            className="flex items-center gap-2 bg-brand-700 text-white px-5 py-3 rounded-lg hover:bg-brand-800 transition-colors font-medium"
          >
            <Plus size={18} /> Nova Categoria
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-brand-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-brand-500">
              Carregando categorias...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-50 border-b border-brand-100">
                  <th className="p-4 text-sm font-medium text-brand-800">
                    Nome
                  </th>
                  <th className="p-4 text-sm font-medium text-brand-800">
                    Slug
                  </th>
                  <th className="p-4 text-sm font-medium text-brand-800 text-center w-24">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="border-b border-brand-50 hover:bg-brand-50/50"
                  >
                    <td className="p-4 font-medium text-brand-900">
                      {cat.name}
                    </td>
                    <td className="p-4 text-brand-500">{cat.slug}</td>
                    <td className="p-4 flex items-center justify-center gap-2">
                      <Link
                        href={`/admin/categories/${cat.id}`}
                        className="text-brand-600 hover:text-brand-900 p-2 inline-block bg-brand-50 rounded-lg hover:bg-brand-100"
                        title="Editar categoria"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="text-red-500 hover:text-red-700 p-2 inline-block bg-red-50 rounded-lg hover:bg-red-100"
                        title="Deletar categoria"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
