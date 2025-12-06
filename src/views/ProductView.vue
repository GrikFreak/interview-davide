<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { Product } from '@/types'
import { getAllProducts, getProductsByCategory } from '@/services/products'
import ProductGrid from '@/components/product/ProductGrid.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const route = useRoute()
const products = ref<Product[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const currentCategory = computed(() => route.query.category as string | undefined)

const pageTitle = computed(() => {
  if (currentCategory.value) {
    return currentCategory.value.charAt(0).toUpperCase() + currentCategory.value.slice(1)
  }
  return 'Tutti i Prodotti'
})

async function fetchProducts() {
  try {
    isLoading.value = true
    error.value = null
    if (currentCategory.value) {
      products.value = await getProductsByCategory(currentCategory.value)
    } else {
      products.value = await getAllProducts()
    }
  } catch (e) {
    error.value = 'Errore nel caricamento dei prodotti'
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

function handleAddToCart(product: Product) {
  console.log('Aggiungi al carrello:', product)
}

function handleAddToWishlist(product: Product) {
  console.log('Aggiungi alla wishlist:', product)
}

watch(currentCategory, fetchProducts, { immediate: true })
</script>

<template>
  <main class="product-view">
    <header class="product-view__header">
      <h1>{{ pageTitle }}</h1>
      <p>Esplora il nostro catalogo</p>
    </header>

    <LoadingSpinner v-if="isLoading" size="lg" />

    <EmptyState
      v-else-if="error"
      icon="⚠️"
      :title="error"
      description="Riprova più tardi"
    />

    <EmptyState
      v-else-if="products.length === 0"
      icon="📦"
      title="Nessun prodotto disponibile"
      description="Torna a trovarci presto!"
    />

    <ProductGrid
      v-else
      :products="products"
      @add-to-cart="handleAddToCart"
      @add-to-wishlist="handleAddToWishlist"
    />
  </main>
</template>

<style scoped lang="scss">
.product-view {
  padding: 2rem;

  &__header {
    margin-bottom: 2rem;

    h1 {
      font-size: 2rem;
      margin: 0 0 0.5rem;
      color: var(--text-color, #1a1a1a);
    }

    p {
      color: var(--text-secondary, #666);
      margin: 0;
    }
  }
}
</style>
