<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Product } from '@/types/product'
import WishlistButton from '@/components/product/WishlistButton.vue'

interface Props {
  product: Product
}

const props = defineProps<Props>()
const router = useRouter()

function handleProductClick() {
  router.push({ name: 'product-detail', params: { id: props.product.id } })
}
</script>


<template>
  <article class="wishlist-item">
    <div 
      class="wishlist-item__wishlist"
      @click.stop
    >
      <WishlistButton :product="product" />
    </div>
    
    <div class="wishlist-item__image" @click="handleProductClick">
      <img :src="product.image" :alt="product.title" />
    </div>
    
    <div class="wishlist-item__content" @click="handleProductClick">
      <span class="wishlist-item__category">{{ product.category }}</span>
      <h3 class="wishlist-item__title">
        {{ product.title }}
      </h3>
      <p class="wishlist-item__price">€{{ product.price.toFixed(2) }}</p>
    </div>
  </article>
</template>

<style scoped lang="scss">
@use '@/assets/styles/breakpoints' as *;

.wishlist-item {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--card-bg);
  border: none;
  border-radius: 0;
  overflow: hidden;
  transition: opacity 0.2s ease;
  cursor: pointer;

  &:hover {
    opacity: 0.85;

    @include mobile-only {
      opacity: 1;
    }
  }
}

.wishlist-item__wishlist {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  padding: 0.25rem;
  backdrop-filter: blur(4px);
}

.wishlist-item__image {
  width: 100%;
  aspect-ratio: 1;
  background: var(--image-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  transition: transform 0.3s ease;

  @include tablet-only {
    padding: 1.5rem;
  }

  @include mobile-only {
    padding: 1rem;
  }

  .wishlist-item:hover & {
    transform: scale(1.02);

    @include mobile-only {
      transform: none;
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.3s ease;
  }
}

.wishlist-item__content {
  padding: 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: var(--card-bg);
}

.wishlist-item__category {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--text-secondary);
  font-weight: 500;
  letter-spacing: 0.1em;
  margin: 0;
}

.wishlist-item__title {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 400;
  color: var(--text-color);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.wishlist-item__price {
  margin: 0.25rem 0 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-color);
  letter-spacing: 0.02em;
}

@include mobile-only {
  .wishlist-item__content {
    padding: 1rem 0.75rem;
  }

  .wishlist-item__title {
    font-size: 0.875rem;
  }

  .wishlist-item__price {
    font-size: 0.9375rem;
  }
}
</style>