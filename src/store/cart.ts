import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, ProductVariant } from '@/types'

export interface CartItem {
  id: string
  productId: string
  variantId?: string
  product: Product
  variant?: ProductVariant
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, variantId?: string, quantity?: number) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  isInCart: (productId: string, variantId?: string) => boolean
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, variantId?: string, quantity = 1) => {
        const items = get().items
        const existingItem = items.find(
          item => item.productId === product.id && item.variantId === variantId
        )

        if (existingItem) {
          set({
            items: items.map(item =>
              item.productId === product.id && item.variantId === variantId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          })
        } else {
          const variant = product.variants?.find(v => v.id === variantId)
          const newItem: CartItem = {
            id: `${product.id}-${variantId || 'default'}`,
            productId: product.id,
            variantId,
            product,
            variant,
            quantity
          }
          set({ items: [...items, newItem] })
        }
      },

      removeItem: (itemId: string) => {
        set({ items: get().items.filter(item => item.id !== itemId) })
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }
        set({
          items: get().items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          )
        })
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.variant 
            ? item.product.price + item.variant.priceAdjust
            : item.product.price
          return total + (price * item.quantity)
        }, 0)
      },

      isInCart: (productId: string, variantId?: string) => {
        return get().items.some(
          item => item.productId === productId && item.variantId === variantId
        )
      }
    }),
    {
      name: 'cart-storage'
    }
  )
)