import { supabase } from '@/lib/supabase'
import { Client, ClientInterest, Product } from '@/types'

export type ClientWithInterests = Client & {
  interests: (ClientInterest & { product: Product })[]
}

export const clientService = {
  async getClients(): Promise<ClientWithInterests[]> {
    const { data, error } = await supabase
      .from('clients')
      .select(
        `
        *,
        client_interests (
          *,
          product:products (*)
        )
      `
      )
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching clients:', error)
      return []
    }

    // O Supabase retorna os nested models. Mapeamos para facilitar no frontend
    return (data || []).map((client) => ({
      ...client,
      interests: (client.client_interests as any) || []
    })) as ClientWithInterests[]
  },

  async getClientById(id: string): Promise<ClientWithInterests | null> {
    const { data, error } = await supabase
      .from('clients')
      .select(
        `
        *,
        client_interests (
          *,
          product:products (*)
        )
      `
      )
      .eq('id', id)
      .single()

    if (error || !data) return null
    return {
      ...data,
      interests: (data.client_interests as any) || []
    } as ClientWithInterests
  },

  async createClient(
    name: string,
    nickname?: string,
    phoneSuffix?: string
  ): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .insert({
        name,
        nickname: nickname || null,
        phone_suffix: phoneSuffix || null
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating client:', error)
      return null
    }
    return data
  },

  async addInterest(
    clientId: string,
    productId: string,
    size: string
  ): Promise<boolean> {
    const { error } = await supabase
      .from('client_interests')
      .insert({
        client_id: clientId,
        product_id: productId,
        size,
        status: 'pending'
      })

    if (error) {
      console.error('Error adding interest:', error)
      return false
    }
    return true
  },

  async removeInterest(interestId: string): Promise<boolean> {
    const { error } = await supabase
      .from('client_interests')
      .delete()
      .eq('id', interestId)

    return !error
  },

  async updateInterestStatus(
    interestId: string,
    status: 'pending' | 'notified'
  ): Promise<boolean> {
    const { error } = await supabase
      .from('client_interests')
      .update({ status })
      .eq('id', interestId)

    return !error
  }
}
