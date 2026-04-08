import { create } from 'zustand'
import type { Product, CartItem } from '../types'

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, size: string) => void
  removeItem: (productId: string, size: string) => void
  updateQuantity: (productId: string, size: string, quantity: number) => void
  clearCart: () => void
  total: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (product, size) => {
    const existing = get().items.find(
      i => i.product.id === product.id && i.size === size
    )
    if (existing) {
      set(state => ({
        items: state.items.map(i =>
          i.product.id === product.id && i.size === size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      }))
    } else {
      set(state => ({ items: [...state.items, { product, size, quantity: 1 }] }))
    }
  },

  removeItem: (productId, size) => {
    set(state => ({
      items: state.items.filter(
        i => !(i.product.id === productId && i.size === size)
      ),
    }))
  },

  updateQuantity: (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      set(state => ({
        items: state.items.filter(i => !(i.product.id === productId && i.size === size))
      }))
      return
    }
    set(state => ({
      items: state.items.map(i =>
        i.product.id === productId && i.size === size ? { ...i, quantity } : i
      ),
    }))
  },

  clearCart: () => set({ items: [] }),

  total: () =>
    get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
}))