import { Database } from './database.types'

export type Category = Database['public']['Tables']['categories']['Row']
export type SizeCategory =
  Database['public']['Tables']['size_categories']['Row']
export type ProductCategory =
  Database['public']['Tables']['product_categories']['Row']
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
  category_ids?: string[]
  categories?: Category[]
  size_category?: SizeCategory | null
}
