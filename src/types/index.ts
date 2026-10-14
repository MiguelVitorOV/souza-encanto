import { Database } from './database.types'

export type Category = Database['public']['Tables']['categories']['Row']
export type Client = Database['public']['Tables']['clients']['Row']
export type ClientInterest =
  Database['public']['Tables']['client_interests']['Row']

export interface ProductSize {
  size: string
  inStock: boolean
}

export type MediaType = 'image' | 'video'

export interface ProductMedia {
  url: string
  type: MediaType
  order: number
}

export type Product = Omit<
  Database['public']['Tables']['products']['Row'],
  'sizes' | 'media'
> & {
  sizes: ProductSize[]
  media?: ProductMedia[]
}
