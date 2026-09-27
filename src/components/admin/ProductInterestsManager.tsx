'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Client, ClientInterest, Product } from '@/types'
import { clientService } from '@/services/clientService'
import { Trash2, CheckCircle2, Circle, Plus } from 'lucide-react'

type InterestWithClient = ClientInterest & { client: Client }

export function ProductInterestsManager({ product }: { product: Product }) {
  const [interests, setInterests] = useState<InterestWithClient[]>([])
  const [allClients, setAllClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  // Form states
  const [isAdding, setIsAdding] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState('')
  const [selectedSize, setSelectedSize] = useState('')

  // New Client states
  const [isCreatingClient, setIsCreatingClient] = useState(false)
  const [newClientName, setNewClientName] = useState('')
  const [newClientNickname, setNewClientNickname] = useState('')
  const [newClientPhone, setNewClientPhone] = useState('')

  const loadData = async () => {
    setLoading(true)
    // Fetch interests for this product
    const { data: interestsData } = await supabase
      .from('client_interests')
      .select(
        `
        *,
        client:clients (*)
      `
      )
      .eq('product_id', product.id)
      .order('created_at', { ascending: false })

    // Fetch all clients for the dropdown
    const { data: clientsData } = await supabase
      .from('clients')
      .select('*')
      .order('name', { ascending: true })

    if (interestsData) setInterests(interestsData as InterestWithClient[])
    if (clientsData) setAllClients(clientsData)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [product.id])

  const handleAddInterest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSize) return

    let clientIdToUse = selectedClientId

    if (isCreatingClient) {
      if (!newClientName) return
      const newClient = await clientService.createClient(
        newClientName,
        newClientNickname,
        newClientPhone
      )
      if (newClient) {
        clientIdToUse = newClient.id
      } else {
        return // Failed to create
      }
    }

    if (!clientIdToUse) return

    const success = await clientService.addInterest(
      clientIdToUse,
      product.id,
      selectedSize
    )
    if (success) {
      setIsAdding(false)
      setIsCreatingClient(false)
      setSelectedClientId('')
      setSelectedSize('')
      setNewClientName('')
      setNewClientNickname('')
      setNewClientPhone('')
      loadData()
    }
  }

  const toggleStatus = async (interestId: string, currentStatus: string) => {
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

  if (loading) {
    return (
      <div className="mt-8 p-6 bg-white rounded-2xl shadow-sm border border-brand-100 text-center text-brand-500">
        Carregando interessados...
      </div>
    )
  }

  return (
    <div className="mt-8 p-6 bg-white rounded-2xl shadow-sm border border-brand-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-medium text-brand-900">
            Clientes Interessados
          </h2>
          <p className="text-sm text-brand-500 mt-1">
            Pessoas que aguardam reposição desta peça.
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 bg-brand-50 text-brand-700 px-3 py-2 rounded-lg hover:bg-brand-100 transition-colors text-sm font-medium"
          >
            <Plus size={16} /> Adicionar
          </button>
        )}
      </div>

      {isAdding && (
        <form
          onSubmit={handleAddInterest}
          className="mb-6 p-4 bg-brand-50/50 rounded-xl border border-brand-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {!isCreatingClient ? (
              <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">
                  Selecionar Cliente
                </label>
                <select
                  required
                  value={selectedClientId}
                  onChange={(e) => {
                    if (e.target.value === 'NEW') {
                      setIsCreatingClient(true)
                      setSelectedClientId('')
                    } else {
                      setSelectedClientId(e.target.value)
                    }
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                >
                  <option value="">Selecione...</option>
                  <option value="NEW" className="font-bold text-brand-700">
                    + Novo Cliente
                  </option>
                  {allClients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.nickname ? `(${c.nickname})` : ''}{' '}
                      {c.phone_suffix ? `[${c.phone_suffix}]` : ''}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">
                    Nome do Cliente
                  </label>
                  <input
                    required
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    placeholder="Ex: Ana Souza"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">
                    Apelido (Opcional)
                  </label>
                  <input
                    value={newClientNickname}
                    onChange={(e) => setNewClientNickname(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
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
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    placeholder="Ex: 58"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreatingClient(false)}
                  className="text-xs text-brand-500 hover:text-brand-700 underline"
                >
                  Cancelar e selecionar existente
                </button>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1">
                Tamanho Desejado
              </label>
              <select
                required
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="">Selecione...</option>
                {product.sizes.map((s) => (
                  <option key={s.size} value={s.size}>
                    {s.size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-sm text-brand-600 hover:bg-brand-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={
                (!selectedClientId && !isCreatingClient) || !selectedSize
              }
              className="px-4 py-2 text-sm bg-brand-700 text-white rounded-lg hover:bg-brand-800 transition-colors disabled:opacity-50"
            >
              Salvar
            </button>
          </div>
        </form>
      )}

      {interests.length === 0 ? (
        <p className="text-brand-400 text-sm text-center py-4">
          Nenhum cliente aguardando esta peça no momento.
        </p>
      ) : (
        <div className="space-y-3">
          {interests.map((interest) => (
            <div
              key={interest.id}
              className="flex flex-wrap sm:flex-nowrap items-center justify-between p-3 rounded-xl border border-brand-100 hover:border-brand-200 transition-colors bg-white gap-3"
            >
              <div>
                <p className="font-medium text-brand-900">
                  {interest.client.name}
                  {interest.client.nickname && (
                    <span className="text-brand-500 text-sm font-normal ml-1">
                      ({interest.client.nickname})
                    </span>
                  )}
                  {interest.client.phone_suffix && (
                    <span className="text-brand-500 text-sm font-normal ml-1">
                      • Final {interest.client.phone_suffix}
                    </span>
                  )}
                </p>
                <p className="text-xs text-brand-500 mt-0.5">
                  Aguardando tamanho:{' '}
                  <span className="font-bold text-brand-700">
                    {interest.size}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => toggleStatus(interest.id, interest.status)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${interest.status === 'notified' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}
                >
                  {interest.status === 'notified' ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <Circle size={14} />
                  )}
                  {interest.status === 'notified' ? 'Avisada' : 'Aguardando'}
                </button>
                <button
                  onClick={() => removeInterest(interest.id)}
                  className="p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                  title="Remover interesse"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
