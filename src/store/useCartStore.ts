import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/types'

export interface CartItem {
  product: Product
  size: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  isCartOpen: boolean
  addItem: (product: Product, size: string) => void
  removeItem: (productId: string, size: string) => void
  updateQuantity: (productId: string, size: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  setCartOpen: (isOpen: boolean) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isCartOpen: false,

      addItem: (product, size) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.product.id === product.id && item.size === size
          )

          if (existingItemIndex >= 0) {
            const newItems = [...state.items]
            newItems[existingItemIndex].quantity += 1
            return { items: newItems, isCartOpen: true }
          }

          return {
            items: [...state.items, { product, size, quantity: 1 }],
            isCartOpen: true
          }
        }),

      removeItem: (productId, size) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product.id === productId && item.size === size)
          )
        })),

      updateQuantity: (productId, size, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (item) => !(item.product.id === productId && item.size === size)
              )
            }
          }
          return {
            items: state.items.map((item) =>
              item.product.id === productId && item.size === size
                ? { ...item, quantity }
                : item
            )
          }
        }),

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      setCartOpen: (isOpen) => set({ isCartOpen: isOpen })
    }),
    {
      name: 'souza-encanto-cart',
      partialize: (state) => ({ items: state.items }) // Persiste apenas os itens do carrinho
    }
  )
)
