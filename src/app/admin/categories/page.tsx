'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Category } from '@/types'
import { Plus, Edit2, LogOut, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { AdminHeader } from '@/components/admin/AdminHeader'

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      if (data) setCategories(data)
      setLoading(false)
    }
    fetchCategories()
  }, [])

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
                    <td className="p-4 text-center">
                      <Link
                        href={`/admin/categories/${cat.id}`}
                        className="text-brand-600 hover:text-brand-900 p-2 inline-block bg-brand-50 rounded-lg hover:bg-brand-100"
                      >
                        <Edit2 size={16} />
                      </Link>
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
