import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Product } from '@/types/product'
import { CART_KEY } from '@/consts'

interface CartItem {
  product: Product
  quantity: number
}

function loadCartFromStorage(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveCartToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Error saving cart to storage:', error)
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(loadCartFromStorage())

  // Persist cart to localStorage whenever it changes
  watch(items, (newItems) => {
    saveCartToStorage(newItems)
  }, { deep: true })

  const totalItems = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  })

  function getItemQuantity(productId: number): number {
    const item = items.value.find(item => item.product.id === productId)
    return item?.quantity ?? 0
  }

  function isInCart(productId: number): boolean {
    return items.value.some(item => item.product.id === productId)
  }

  function addToCart(product: Product, quantity: number = 1) {
    const existingItem = items.value.find(item => item.product.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({ product, quantity })
    }
  }

  function removeFromCart(productId: number) {
    const index = items.value.findIndex(item => item.product.id === productId)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  function updateQuantity(productId: number, quantity: number) {
    const item = items.value.find(item => item.product.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
      }
    }
  }

  function increaseQuantity(productId: number) {
    const item = items.value.find(item => item.product.id === productId)
    if (item) {
      item.quantity++
    }
  }

  function decreaseQuantity(productId: number) {
    const item = items.value.find(item => item.product.id === productId)
    if (item) {
      if (item.quantity > 1) {
        item.quantity--
      } else {
        removeFromCart(productId)
      }
    }
  }

  function clearCart() {
    items.value = []
    try {
      localStorage.removeItem(CART_KEY)
    } catch (error) {
      console.error('Error clearing cart from storage:', error)
    }
  }

  return {
    items,
    totalItems,
    totalPrice,
    getItemQuantity,
    isInCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  }
})

