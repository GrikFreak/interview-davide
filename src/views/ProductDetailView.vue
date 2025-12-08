<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getProduct } from '@/services/products'
import type { Product } from '@/types/product'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import AddToCartButton from '@/components/product/AddToCartButton.vue'
import WishlistButton from '@/components/product/WishlistButton.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const product = ref<Product | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    isLoading.value = true
    error.value = null
    const productId = parseInt(route.params.id as string, 10)
    product.value = await getProduct(productId)
  } catch (e) {
    error.value = 'Errore nel caricamento del prodotto'
    console.error(e)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <main class="product-detail">
    <LoadingSpinner v-if="isLoading" size="lg" />

    <EmptyState
      v-else-if="error"
      icon="⚠️"
      :title="error"
      description="Riprova più tardi"
    />

    <div v-else-if="product" class="product-detail__content">
      <div class="product-detail__image">
        <img :src="product.image" :alt="product.title" />
      </div>

      <div class="product-detail__info">
        <span class="product-detail__category">{{ product.category }}</span>
        <h1 class="product-detail__title">{{ product.title }}</h1>
        <p class="product-detail__price">€{{ product.price.toFixed(2) }}</p>
        <p class="product-detail__description">{{ product.description }}</p>

        <div v-if="authStore.isAuthenticated" class="product-detail__actions">
          <AddToCartButton :product="product" :show-quantity="true" />
          <div class="wishlist-wrapper">
            <WishlistButton :product="product" />
            <span class="wishlist-label">Aggiungi il prodotto alla wishlist</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
@use '@/assets/styles/breakpoints' as *;

.product-detail {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.product-detail__content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;

  @include mobile-only {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.product-detail__image {
  background: var(--image-bg);
  border-radius: 0.75rem;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
}

.product-detail__info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-detail__category {
  font-size: 0.875rem;
  text-transform: uppercase;
  color: var(--primary-color);
  font-weight: 600;
  letter-spacing: 0.05em;
}

.product-detail__title {
  font-size: 2rem;
  margin: 0;
  color: var(--text-color);
  line-height: 1.2;

  @include mobile-only {
    font-size: 1.5rem;
  }
}

.product-detail__price {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0.5rem 0;

  @include mobile-only {
    font-size: 2rem;
  }
}

.product-detail__description {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-color);
  margin: 1rem 0;
}

.product-detail__actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
  flex-wrap: wrap;
  width: 100%;
}

.wishlist-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.wishlist-label {
  font-size: 0.875rem;
  color: var(--text-color);
}
</style>

