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
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          category_id: string | null
          sizes: Json
          images: string[]
          is_active: boolean
          is_out_of_stock: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          category_id?: string | null
          sizes?: Json
          images?: string[]
          is_active?: boolean
          is_out_of_stock?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          category_id?: string | null
          sizes?: Json
          images?: string[]
          is_active?: boolean
          is_out_of_stock?: boolean
          created_at?: string
        }
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
