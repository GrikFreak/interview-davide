<script setup lang="ts">
import type { Product } from '@/types'
import Button from '@/components/ui/Button.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

defineProps<{
  product: Product
}>()

defineEmits<{
  addToCart: [product: Product]
  addToWishlist: [product: Product]
}>()
</script>

<template>
  <article class="product-card">
    <div class="product-card__image">
      <img :src="product.image" :alt="product.title" loading="lazy" />
    </div>
    <div class="product-card__content">
      <span class="product-card__category">{{ product.category }}</span>
      <h3 class="product-card__title">{{ product.title }}</h3>
      <p class="product-card__price">€{{ product.price.toFixed(2) }}</p>
      <div v-if="authStore.isAuthenticated" class="product-card__actions">
        <Button @click="$emit('addToCart', product)">
          Aggiungi al carrello
        </Button>
        <Button variant="secondary" icon @click="$emit('addToWishlist', product)" aria-label="Aggiungi alla wishlist">
          ❤️
        </Button>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.product-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  &__image {
    aspect-ratio: 1;
    padding: 1rem;
    background: var(--image-bg);
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }

  &__content {
    padding: 1rem;
  }

  &__category {
    font-size: 0.75rem;
    text-transform: uppercase;
    color: var(--primary-color);
    font-weight: 600;
    letter-spacing: 0.05em;
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
  }

  &__price {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-color);
    margin: 0.5rem 0 1rem;
  }

  &__actions {
    display: flex;
    gap: 0.5rem;

    > :first-child {
      flex: 1;
    }
  }
}
</style>
