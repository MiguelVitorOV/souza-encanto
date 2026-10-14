export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
        Relationships: []
      }
      size_categories: {
        Row: {
          id: string
          name: string
          sizes: string[]
          measurement_table: string | null
          measurement_description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          sizes?: string[]
          measurement_table?: string | null
          measurement_description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          sizes?: string[]
          measurement_table?: string | null
          measurement_description?: string | null
          created_at?: string
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          product_id: string
          category_id: string
        }
        Insert: {
          product_id: string
          category_id: string
        }
        Update: {
          product_id?: string
          category_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'product_categories_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'product_categories_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          }
        ]
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          promotional_price: number | null
          category_id: string | null
          size_category_id: string | null
          sizes: any
          images: string[]
          media?: any
          is_active: boolean
          is_out_of_stock: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          promotional_price?: number | null
          category_id?: string | null
          size_category_id?: string | null
          sizes?: any
          images?: string[]
          media?: any
          is_active?: boolean
          is_out_of_stock?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          promotional_price?: number | null
          category_id?: string | null
          size_category_id?: string | null
          sizes?: any
          images?: string[]
          media?: any
          is_active?: boolean
          is_out_of_stock?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'products_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'products_size_category_id_fkey'
            columns: ['size_category_id']
            isOneToOne: false
            referencedRelation: 'size_categories'
            referencedColumns: ['id']
          }
        ]
      }
      clients: {
        Row: {
          id: string
          name: string
          nickname: string | null
          phone_suffix: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          nickname?: string | null
          phone_suffix?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          nickname?: string | null
          phone_suffix?: string | null
          created_at?: string
        }
        Relationships: []
      }
      client_interests: {
        Row: {
          id: string
          client_id: string
          product_id: string
          size: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          product_id: string
          size: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          product_id?: string
          size?: string
          status?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'client_interests_client_id_fkey'
            columns: ['client_id']
            isOneToOne: false
            referencedRelation: 'clients'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'client_interests_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
