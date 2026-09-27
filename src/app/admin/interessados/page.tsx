'use client'

import { useEffect, useState } from 'react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { clientService, ClientWithInterests } from '@/services/clientService'
import { Product } from '@/types'
import { supabase } from '@/lib/supabase'
import {
  Plus,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  Trash2
} from 'lucide-react'
import { formatCurrency } from '@/utils/formatters'

export default function InteressadosPage() {
  const [clients, setClients] = useState<ClientWithInterests[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedClient, setExpandedClient] = useState<string | null>(null)

  // Modal states
  const [isClientModalOpen, setIsClientModalOpen] = useState(false)
  const [newClientName, setNewClientName] = useState('')
  const [newClientNickname, setNewClientNickname] = useState('')
  const [newClientPhone, setNewClientPhone] = useState('')

  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState('')
  const [selectedSize, setSelectedSize] = useState('')

  const loadData = async () => {
    setLoading(true)
    const [clientsData, { data: productsData }] = await Promise.all([
      clientService.getClients(),
      supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
    ])
    setClients(clientsData)
    if (productsData) setProducts(productsData)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClientName) return
    const newClient = await clientService.createClient(
      newClientName,
      newClientNickname,
      newClientPhone
    )
    if (newClient) {
      setIsClientModalOpen(false)
      setNewClientName('')
      setNewClientNickname('')
      setNewClientPhone('')
      loadData()
    }
  }

  const handleAddInterest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!expandedClient || !selectedProductId || !selectedSize) return
    const success = await clientService.addInterest(
      expandedClient,
      selectedProductId,
      selectedSize
    )
    if (success) {
      setIsInterestModalOpen(false)
      setSelectedProductId('')
      setSelectedSize('')
      loadData()
    }
  }

  const toggleInterestStatus = async (
    interestId: string,
    currentStatus: string
  ) => {
    const newStatus = currentStatus === 'pending' ? 'notified' : 'pending'
    const success = await clientService.updateInterestStatus(
      interestId,
      newStatus
    )
    if (success) loadData()
  }

  const removeInterest = async (interestId: string) => {
    if (confirm('Tem certeza que deseja remover este interesse?')) {
      const success = await clientService.removeInterest(interestId)
      if (success) loadData()
    }
  }

  const selectedProductObj = products.find((p) => p.id === selectedProductId)

  return (
    <div className="min-h-screen bg-brand-50">
      <AdminHeader />

      <main className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-light text-brand-800">Interessados</h2>
            <p className="text-brand-600 mt-1">
              Gerencie os clientes que aguardam reposição
            </p>
          </div>
          <button
            onClick={() => setIsClientModalOpen(true)}
            className="flex items-center gap-2 bg-brand-700 text-white px-5 py-3 rounded-lg hover:bg-brand-800 transition-colors shadow-sm font-medium"
          >
            <Plus size={18} /> Novo Cliente
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-brand-500 bg-white rounded-xl shadow-sm border border-brand-100">
            Carregando clientes...
          </div>
        ) : clients.length === 0 ? (
          <div className="p-8 text-center text-brand-500 bg-white rounded-xl shadow-sm border border-brand-100">
            Nenhum cliente cadastrado ainda.
          </div>
        ) : (
          <div className="space-y-4">
            {clients.map((client) => (
              <div
                key={client.id}
                className="bg-white rounded-xl shadow-sm border border-brand-100 overflow-hidden transition-all"
              >
                {/* Client Header */}
                <div
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-brand-50/50"
                  onClick={() =>
                    setExpandedClient(
                      expandedClient === client.id ? null : client.id
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-medium">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-medium text-brand-900">
                        {client.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-brand-500">
                        {client.nickname && <span>{client.nickname}</span>}
                        {client.nickname && client.phone_suffix && (
                          <span>•</span>
                        )}
                        {client.phone_suffix && (
                          <span>Final {client.phone_suffix}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-brand-500">
                      {client.interests.length} interesse(s)
                    </span>
                    {expandedClient === client.id ? (
                      <ChevronDown className="text-brand-400" />
                    ) : (
                      <ChevronRight className="text-brand-400" />
                    )}
                  </div>
                </div>

                {/* Client Details (Expanded) */}
                {expandedClient === client.id && (
                  <div className="p-4 border-t border-brand-50 bg-brand-50/20">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-brand-800 text-sm">
                        Lista de Peças Desejadas
                      </h4>
                      <button
                        onClick={() => setIsInterestModalOpen(true)}
                        className="text-brand-700 text-sm font-medium hover:text-brand-900 flex items-center gap-1"
                      >
                        <Plus size={14} /> Adicionar Peça
                      </button>
                    </div>

                    {client.interests.length === 0 ? (
                      <p className="text-sm text-brand-400 italic">
                        Nenhuma peça na lista.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {client.interests.map((interest) => (
                          <div
                            key={interest.id}
                            className="flex items-center justify-between bg-white p-3 rounded-lg border border-brand-100"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-12 bg-brand-100 rounded overflow-hidden">
                                {interest.product.images?.[0] ? (
                                  <img
                                    src={interest.product.images[0]}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-brand-200" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-brand-900 text-sm line-clamp-1">
                                  {interest.product.name}
                                </p>
                                <p className="text-xs text-brand-500">
                                  Tamanho:{' '}
                                  <span className="font-bold">
                                    {interest.size}
                                  </span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <button
                                onClick={() =>
                                  toggleInterestStatus(
                                    interest.id,
                                    interest.status
                                  )
                                }
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${interest.status === 'notified' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}
                              >
                                {interest.status === 'notified' ? (
                                  <CheckCircle2 size={14} />
                                ) : (
                                  <Circle size={14} />
                                )}
                                {interest.status === 'notified'
                                  ? 'Avisada'
                                  : 'Aguardando'}
                              </button>

                              <button
                                onClick={() => removeInterest(interest.id)}
                                className="text-red-400 hover:text-red-600 transition-colors p-1"
                                title="Remover"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal Novo Cliente */}
      {isClientModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-medium text-brand-900 mb-4">
              Novo Cliente
            </h3>
            <form onSubmit={handleCreateClient}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">
                    Nome
                  </label>
                  <input
                    required
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Ex: Maria Silva"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">
                    Apelido (Opcional)
                  </label>
                  <input
                    value={newClientNickname}
                    onChange={(e) => setNewClientNickname(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Ex: Cacau"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">
                    Final do Telefone (Opcional)
                  </label>
                  <input
                    value={newClientPhone}
                    onChange={(e) =>
                      setNewClientPhone(
                        e.target.value.replace(/\D/g, '').slice(0, 2)
                      )
                    }
                    maxLength={2}
                    className="w-full px-4 py-2 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Ex: 58"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsClientModalOpen(false)}
                  className="px-4 py-2 text-brand-600 hover:text-brand-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-700 text-white rounded-lg hover:bg-brand-800 font-medium"
                >
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Novo Interesse */}
      {isInterestModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-medium text-brand-900 mb-4">
              Vincular Peça
            </h3>
            <form onSubmit={handleAddInterest}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">
                    Produto
                  </label>
                  <select
                    required
                    value={selectedProductId}
                    onChange={(e) => {
                      setSelectedProductId(e.target.value)
                      setSelectedSize('') // Reset size when product changes
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="">Selecione um produto...</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} - {formatCurrency(p.price)}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedProductObj && (
                  <div>
                    <label className="block text-sm font-medium text-brand-700 mb-1">
                      Tamanho Desejado
                    </label>
                    <select
                      required
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="">Selecione um tamanho...</option>
                      {/* Note: sizes field contains objects like { size: 'M', inStock: false } */}
                      {((selectedProductObj.sizes as any[]) || []).map((s) => (
                        <option key={s.size} value={s.size}>
                          {s.size} {s.inStock ? '(Disponível)' : '(Esgotado)'}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsInterestModalOpen(false)}
                  className="px-4 py-2 text-brand-600 hover:text-brand-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!selectedProductId || !selectedSize}
                  className="px-4 py-2 bg-brand-700 text-white rounded-lg hover:bg-brand-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
