<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Product } from '@/types'
import { getAllProducts, getProductsByCategory, searchProducts, type SortOrder } from '@/services/products'
import ProductGrid from '@/components/product/ProductGrid.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Pagination from '@/components/ui/Pagination.vue'
import SortControl from '@/components/ui/SortControl.vue'

const route = useRoute()
const router = useRouter()
const products = ref<Product[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const currentCategory = computed(() => route.query.category as string | undefined)
const currentSearch = computed(() => route.query.search as string | undefined)
const currentSort = computed(() => (route.query.sort as SortOrder) || undefined)
const currentPage = computed(() => {
  const page = parseInt(route.query.page as string || '1', 10)
  return isNaN(page) || page < 1 ? 1 : page
})

const itemsPerPage = 12
const totalPages = computed(() => Math.ceil(products.value.length / itemsPerPage))
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return products.value.slice(start, end)
})

const pageTitle = computed(() => {
  if (currentSearch.value) {
    return `Risultati per "${currentSearch.value}"`
  }
  if (currentCategory.value) {
    return currentCategory.value.charAt(0).toUpperCase() + currentCategory.value.slice(1)
  }
  return 'Tutti i Prodotti'
})

async function fetchProducts() {
  try {
    isLoading.value = true
    error.value = null
    
    let fetchedProducts: Product[] = []
    
    if (currentSearch.value) {
      fetchedProducts = await searchProducts(currentSearch.value, {
        sort: currentSort.value,
        category: currentCategory.value,
      })
    } else if (currentCategory.value) {
      fetchedProducts = await getProductsByCategory(currentCategory.value, {
        sort: currentSort.value,
      })
    } else {
      fetchedProducts = await getAllProducts({
        sort: currentSort.value,
      })
    }
    
    // Apply client-side sorting (needed for search results and when API doesn't support sort)
    if (currentSort.value) {
      fetchedProducts.sort((a, b) => {
        if (currentSort.value === 'asc') {
          return a.price - b.price
        } else {
          return b.price - a.price
        }
      })
    } else {
      // Default: sort by title alphabetically
      fetchedProducts.sort((a, b) => a.title.localeCompare(b.title))
    }
    
    products.value = fetchedProducts
    
    // Reset to page 1 if current page is out of bounds
    const newTotalPages = Math.ceil(fetchedProducts.length / itemsPerPage)
    if (currentPage.value > newTotalPages && newTotalPages > 0) {
      router.push({
        query: {
          ...route.query,
          page: '1',
        },
      })
    }
  } catch (e) {
    error.value = 'Errore nel caricamento dei prodotti'
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

function updateSort(sort: SortOrder | undefined) {
  router.push({
    query: {
      ...route.query,
      sort: sort || undefined,
      page: 1, // Reset to first page when sorting changes
    },
  })
}

watch([currentCategory, currentSearch, currentSort], fetchProducts, { immediate: true })
</script>

<template>
  <main class="product-view">
    <header class="product-view__header">
      <div>
        <h1>{{ pageTitle }}</h1>
        <p v-if="!currentSearch">Esplora il nostro catalogo</p>
        <p v-else>{{ products.length }} {{ products.length === 1 ? 'prodotto trovato' : 'prodotti trovati' }}</p>
      </div>
      
      <div class="product-view__controls">
        <SortControl :current-sort="currentSort" @update:sort="updateSort" />
      </div>
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
      :description="currentSearch ? 'Nessun prodotto corrisponde alla tua ricerca' : 'Torna a trovarci presto!'"
    />

    <template v-else>
      <ProductGrid :products="paginatedProducts" />
      
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :items-per-page="itemsPerPage"
        :total-items="products.length"
      />
    </template>
  </main>
</template>

<style scoped lang="scss">
@use '@/assets/styles/breakpoints' as *;

.product-view {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;

  @include mobile-and-tablet {
    padding: 1.5rem 1rem;
  }

  &__header {
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1.5rem;
    flex-wrap: wrap;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border-color);

    @include mobile-only {
      margin-bottom: 1.5rem;
      flex-direction: column;
      padding-bottom: 1rem;
    }

    h1 {
      font-size: 2rem;
      font-weight: 600;
      margin: 0 0 0.5rem;
      color: var(--text-color);

      @include tablet-only {
        font-size: 1.75rem;
      }

      @include mobile-only {
        font-size: 1.5rem;
      }
    }

    p {
      color: var(--text-secondary);
      margin: 0;
      font-size: 1rem;

      @include mobile-only {
        font-size: 0.875rem;
      }
    }
  }

  &__controls {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-shrink: 0;

    @include mobile-only {
      width: 100%;
    }
  }
}
</style>
