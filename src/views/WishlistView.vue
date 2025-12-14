<script setup lang="ts">
import { useWishlistStore } from '@/stores/wishlist'
import ProductCard from '@/components/product/ProductCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const wishlistStore = useWishlistStore()

</script>

<template>
  <main class="wishlist-view">
    <div class="wishlist-view__header">
      <h1>Wishlist</h1>
      <p v-if="wishlistStore.items.length > 0" class="wishlist-view__count">
        {{ wishlistStore.totalItems }} {{ wishlistStore.totalItems === 1 ? 'prodotto' : 'prodotti' }}
      </p>
    </div>

    <EmptyState
      v-if="wishlistStore.items.length === 0"
      icon="❤️"
      title="La tua wishlist è vuota"
      description="Aggiungi alcuni prodotti ai preferiti per iniziare"
    />

    <div v-else class="wishlist-view__content">
      <div class="wishlist-view__items">
        <ProductCard
          v-for="item in wishlistStore.items"
          :key="item.id"
          :product="item"
        />
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
@use '@/assets/styles/breakpoints' as *;

.wishlist-view {
  padding: 3rem 2rem;
  max-width: 1400px;
  margin: 0 auto;

  @include tablet-only {
    padding: 2rem 1.5rem;
  }

  @include mobile-only {
    padding: 1.5rem 1rem;
  }
}

.wishlist-view__header {
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);

  @include mobile-only {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
  }

  h1 {
    font-size: 2rem;
    font-weight: 600;
    margin: 0;
    color: var(--text-color);

    @include tablet-only {
      font-size: 1.75rem;
    }

    @include mobile-only {
      font-size: 1.5rem;
    }
  }
}

.wishlist-view__count {
  margin: 0;
  color: var(--text-secondary);
  font-size: 1rem;
}

.wishlist-view__content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.wishlist-view__items {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;

  @include desktop {
    grid-template-columns: repeat(4, 1fr);
  }

  @include tablet-only {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.25rem;
  }

  @include mobile-only {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  @media (max-width: 360px) {
    grid-template-columns: 1fr;
  }
}
</style>

