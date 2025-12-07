import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Product } from '@/types/product'
import { WISHLIST_KEY } from '@/consts'

function loadWishlistFromStorage(): Product[] {
  try {
    const stored = localStorage.getItem(WISHLIST_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveWishlistToStorage(items: Product[]) {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Error saving wishlist to storage:', error)
  }
}

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref<Product[]>(loadWishlistFromStorage())

  // Persist wishlist to localStorage whenever it changes
  watch(items, (newItems) => {
    saveWishlistToStorage(newItems)
  }, { deep: true })

  const totalItems = computed(() => items.value.length)

  function isInWishlist(productId: number): boolean {
    return items.value.some(product => product.id === productId)
  }

  function addToWishlist(product: Product) {
    if (!isInWishlist(product.id)) {
      items.value.push(product)
    }
  }

  function removeFromWishlist(productId: number) {
    const index = items.value.findIndex(product => product.id === productId)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  function toggleWishlist(product: Product) {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  function clearWishlist() {
    items.value = []
    try {
      localStorage.removeItem(WISHLIST_KEY)
    } catch (error) {
      console.error('Error clearing wishlist from storage:', error)
    }
  }

  return {
    items,
    totalItems,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
  }
})

