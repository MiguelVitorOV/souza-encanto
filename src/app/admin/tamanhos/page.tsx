'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { SizeCategory } from '@/types'
import { Plus, Edit2, Trash2, Ruler, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { AdminHeader } from '@/components/admin/AdminHeader'

export default function AdminSizeCategoriesPage() {
  const [sizeCategories, setSizeCategories] = useState<SizeCategory[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSizeCategories = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('size_categories')
      .select('*')
      .order('name')
    if (data) setSizeCategories(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchSizeCategories()
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (
      window.confirm(
        `Tem certeza que deseja EXCLUIR a grade de tamanhos "${name}"?\n\nOs produtos associados a ela NÃO serão apagados (ficarão sem grade definida).`
      )
    ) {
      if (
        window.confirm(
          `CONFIRMAÇÃO FINAL: Deseja realmente excluir a grade "${name}"?`
        )
      ) {
        const { error } = await supabase
          .from('size_categories')
          .delete()
          .eq('id', id)
        if (!error) {
          fetchSizeCategories()
        } else {
          alert('Erro ao excluir grade: ' + error.message)
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-brand-50">
      <AdminHeader />

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-fredoka text-brand-900 font-bold">
              Grades de Tamanhos & Medidas
            </h2>
            <p className="text-sm text-brand-900/60 mt-1">
              Cadastre e gerencie as grades de roupinhas (ex: Bebê, Infantil 4 a
              10) e as tabelas de medidas acessíveis pelos pais.
            </p>
          </div>
          <Link
            href="/admin/tamanhos/new"
            className="flex items-center gap-2 bg-brand-700 text-white px-5 py-3 rounded-xl hover:bg-brand-800 transition-all font-bold shadow-sm active:scale-95"
          >
            <Plus size={18} /> Nova Grade de Tamanho
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xs border border-brand-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-brand-900/50">
              Carregando grades de tamanho...
            </div>
          ) : sizeCategories.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center mx-auto">
                <Ruler size={26} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-brand-900">
                  Nenhuma grade de tamanho cadastrada
                </h3>
                <p className="text-sm text-brand-900/60 max-w-md mx-auto mt-1">
                  Cadastre grades como "Bebê (RN ao GG)" ou "Infantil (4 ao 10)"
                  com tabelas de medidas para facilitar o cadastro dos produtos
                  e orientar os clientes.
                </p>
              </div>
              <Link
                href="/admin/tamanhos/new"
                className="inline-flex items-center gap-2 bg-brand-700 text-white px-5 py-2.5 rounded-xl hover:bg-brand-800 transition-colors font-bold text-sm shadow-xs"
              >
                <Plus size={16} /> Criar Primeira Grade
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-50/70 border-b border-brand-100 text-brand-900/70 text-xs uppercase tracking-wider font-bold">
                    <th className="p-4">Nome da Grade</th>
                    <th className="p-4">Tamanhos Disponíveis</th>
                    <th className="p-4">Tabela de Medidas</th>
                    <th className="p-4 text-center w-28">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-50">
                  {sizeCategories.map((grade) => (
                    <tr
                      key={grade.id}
                      className="hover:bg-brand-50/40 transition-colors"
                    >
                      <td className="p-4">
                        <span className="font-bold text-brand-900 text-base">
                          {grade.name}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1.5 max-w-md">
                          {grade.sizes.map((s) => (
                            <span
                              key={s}
                              className="bg-brand-50 border border-brand-200/80 text-brand-900 font-bold px-2 py-0.5 rounded-md text-xs"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        {grade.measurement_table ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full font-medium">
                            <Ruler size={13} /> Tabela preenchida
                          </span>
                        ) : (
                          <span className="text-xs text-stone-400 italic">
                            Sem tabela cadastrada
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/admin/tamanhos/${grade.id}`}
                            className="p-2 text-brand-700 hover:text-brand-900 hover:bg-brand-50 rounded-lg transition-colors"
                            title="Editar grade"
                          >
                            <Edit2 size={16} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(grade.id, grade.name)}
                            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Excluir grade"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
