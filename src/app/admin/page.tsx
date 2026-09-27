'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'
import { Plus, Edit2, LogOut, Check, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatCurrency } from '@/utils/formatters'
import { AdminHeader } from '@/components/admin/AdminHeader'

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setProducts(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const toggleStatus = async (
    id: string,
    field: 'is_active' | 'is_out_of_stock',
    currentValue: boolean
  ) => {
    const { error } = await supabase
      .from('products')
      .update({ [field]: !currentValue })
      .eq('id', id)

    if (!error) {
      fetchProducts()
    } else {
      alert('Erro ao atualizar status.')
    }
  }

  return (
    <div className="min-h-screen bg-brand-50">
      <AdminHeader />

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-light text-brand-800">Catálogo</h2>
            <p className="text-brand-600 mt-1">
              Gerencie os produtos da Souza Encanto
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-brand-700 text-white px-5 py-3 rounded-lg hover:bg-brand-800 transition-colors shadow-sm font-medium"
          >
            <Plus size={18} /> Novo Produto
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-brand-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-brand-500">
              Carregando catálogo...
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-brand-500">
              Nenhum produto cadastrado ainda. Clique em "Novo Produto" para
              começar.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-50 border-b border-brand-100">
                    <th className="p-4 text-sm font-medium text-brand-800">
                      Produto
                    </th>
                    <th className="p-4 text-sm font-medium text-brand-800">
                      Preço
                    </th>
                    <th className="p-4 text-sm font-medium text-brand-800 text-center">
                      Ativo (Visível)
                    </th>
                    <th className="p-4 text-sm font-medium text-brand-800 text-center">
                      Estoque
                    </th>
                    <th className="p-4 text-sm font-medium text-brand-800 text-center">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-brand-50 hover:bg-brand-50/50 transition-colors"
                    >
                      <td className="p-4 flex items-center gap-4">
                        <div className="w-12 h-14 bg-brand-100 rounded-md overflow-hidden flex-shrink-0">
                          {product.images && product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-brand-200 flex items-center justify-center text-brand-400 text-xs">
                              Sem img
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-brand-900 line-clamp-2">
                          {product.name}
                        </span>
                      </td>
                      <td className="p-4 text-brand-700 font-medium">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() =>
                            toggleStatus(
                              product.id,
                              'is_active',
                              product.is_active || false
                            )
                          }
                          className={`p-2 rounded-full inline-flex transition-colors ${product.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-brand-100 text-brand-500 hover:bg-brand-200'}`}
                          title={
                            product.is_active
                              ? 'Ocultar da vitrine'
                              : 'Mostrar na vitrine'
                          }
                        >
                          {product.is_active ? (
                            <Check size={16} />
                          ) : (
                            <X size={16} />
                          )}
                        </button>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() =>
                            toggleStatus(
                              product.id,
                              'is_out_of_stock',
                              product.is_out_of_stock || false
                            )
                          }
                          className={`p-2 rounded-full inline-flex transition-colors ${!product.is_out_of_stock ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                          title={
                            !product.is_out_of_stock
                              ? 'Marcar como esgotado'
                              : 'Marcar como disponível'
                          }
                        >
                          {!product.is_out_of_stock ? (
                            <Check size={16} />
                          ) : (
                            <X size={16} />
                          )}
                        </button>
                      </td>
                      <td className="p-4 text-center">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="text-brand-600 hover:text-brand-900 transition-colors p-2 inline-block bg-brand-50 rounded-lg hover:bg-brand-100"
                        >
                          <Edit2 size={16} />
                        </Link>
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
