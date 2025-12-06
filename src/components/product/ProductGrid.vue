<script setup lang="ts">
import type { Product } from '@/types'
import ProductCard from './ProductCard.vue'

defineProps<{
  products: Product[]
}>()

defineEmits<{
  addToCart: [product: Product]
  addToWishlist: [product: Product]
}>()
</script>

<template>
  <div class="product-grid">
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
      @add-to-cart="$emit('addToCart', $event)"
      @add-to-wishlist="$emit('addToWishlist', $event)"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/breakpoints' as *;

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;

  @include tablet-only {
    grid-template-columns: repeat(2, 1fr);
  }

  @include mobile-only {
    grid-template-columns: 1fr;
  }
}
</style>

