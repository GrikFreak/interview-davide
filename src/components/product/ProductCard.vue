<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Product } from '@/types'
import { useAuthStore } from '@/stores/auth'
import AddToCartButton from './AddToCartButton.vue'
import WishlistButton from './WishlistButton.vue'

const router = useRouter()
const authStore = useAuthStore()

defineProps<{
  product: Product
}>()

function handleCardClick(product: Product) {
  router.push({ name: 'product-detail', params: { id: product.id } })
}
</script>

<template>
  <article class="product-card" @click="handleCardClick(product)">
    <div 
      v-if="authStore.isAuthenticated" 
      class="product-card__wishlist"
      @click.stop
    >
      <WishlistButton :product="product" />
    </div>
    <div class="product-card__image">
      <img :src="product.image" :alt="product.title" loading="lazy" />
    </div>
    <div class="product-card__content">
      <span class="product-card__category">{{ product.category }}</span>
      <h3 class="product-card__title">{{ product.title }}</h3>
      <p class="product-card__price">€{{ product.price.toFixed(2) }}</p>
      <div 
        v-if="authStore.isAuthenticated" 
        class="product-card__actions"
        @click.stop
      >
        <AddToCartButton :product="product" />
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
@use '@/assets/styles/breakpoints' as *;

.product-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  height: 100%;
  max-height: 600px;

  @include mobile-only {
    max-height: none;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);

    @include mobile-only {
      transform: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
  }

  &__wishlist {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    z-index: 10;
  }

  &__image {
    width: auto;
    height: 300px;
    padding: 1rem;
    background: var(--image-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    @include tablet-only {
      height: 250px;
      padding: 0.75rem;
    }

    @include mobile-only {
      height: 200px;
      padding: 0.75rem;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  &__content {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    @include mobile-only {
      padding: 0.75rem;
    }
  }

  &__category {
    font-size: 0.75rem;
    text-transform: uppercase;
    color: var(--primary-color);
    font-weight: 600;
    letter-spacing: 0.05em;

    @include mobile-only {
      font-size: 0.6875rem;
    }
  }

  &__title {
    margin: 0.5rem 0;
    font-size: 1rem;
    color: var(--text-color);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    @include mobile-only {
      font-size: 0.875rem;
      margin: 0.375rem 0;
    }
  }

  &__price {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-color);
    margin: 0.5rem 0 1rem;

    @include mobile-only {
      font-size: 1.125rem;
      margin: 0.375rem 0 0.75rem;
    }
  }

  &__actions {
    margin-top: auto;
    padding-top: 0.5rem;
  }
}
</style>
