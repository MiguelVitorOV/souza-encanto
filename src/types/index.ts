import { Database } from './database.types'

export type Category = Database['public']['Tables']['categories']['Row']
export type Client = Database['public']['Tables']['clients']['Row']
export type ClientInterest =
  Database['public']['Tables']['client_interests']['Row']

export interface ProductSize {
  size: string
  inStock: boolean
}

export type Product = Omit<
  Database['public']['Tables']['products']['Row'],
  'sizes'
> & {
  sizes: ProductSize[]
}
