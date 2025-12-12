<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import CartItem from '@/components/cart/CartItem.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Button from '@/components/ui/Button.vue'

const cartStore = useCartStore()

</script>

<template>
  <main class="cart-view">
    <div class="cart-view__header">
      <h1>Carrello</h1>
      <p v-if="cartStore.items.length > 0" class="cart-view__count">
        {{ cartStore.totalItems }} {{ cartStore.totalItems === 1 ? 'articolo' : 'articoli' }}
      </p>
    </div>

    <EmptyState
      v-if="cartStore.items.length === 0"
      icon="🛒"
      title="Il tuo carrello è vuoto"
      description="Aggiungi alcuni prodotti per iniziare"
    />

    <div v-else class="cart-view__content">
      <div class="cart-view__items">
        <CartItem
          v-for="item in cartStore.items"
          :key="item.product.id"
          :product="item.product"
          :quantity="item.quantity"
        />
      </div>

      <aside class="cart-view__summary">
        <div class="cart-summary">
          <h2 class="cart-summary__title">Riepilogo</h2>
          
          <div class="cart-summary__row">
            <span>Articoli ({{ cartStore.totalItems }})</span>
            <span>€{{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>

          <div class="cart-summary__row cart-summary__row--total">
            <span>Totale</span>
            <span class="cart-summary__total">€{{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>

          <Button class="cart-summary__checkout" size="lg">
            Procedi al checkout
          </Button>
        </div>
      </aside>
    </div>
  </main>
</template>

<style scoped lang="scss">
@use '@/assets/styles/breakpoints' as *;

.cart-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @include tablet-only {
    padding: 1.5rem;
  }

  @include mobile-only {
    padding: 1rem;
  }
}

.cart-view__header {
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 1rem;

  @include mobile-only {
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 2rem;
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

.cart-view__count {
  margin: 0;
  color: var(--text-secondary);
  font-size: 1rem;
}

.cart-view__content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;

  @include mobile-and-tablet {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.cart-view__items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-summary {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 1.5rem;
  position: sticky;
  top: 2rem;
  height: fit-content;

  @include mobile-and-tablet {
    position: static;
    padding: 1.25rem;
  }
}

.cart-summary__title {
  margin: 0 0 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
}

.cart-summary__row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  color: var(--text-color);
  border-bottom: 1px solid var(--border-color);

  &:last-of-type {
    border-bottom: none;
  }
}

.cart-summary__row--total {
  margin-top: 0.5rem;
  padding-top: 1rem;
  font-weight: 600;
}

.cart-summary__total {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.cart-summary__checkout {
  width: 100%;
  margin-top: 1.5rem;
}

.cart-summary__clear {
  width: 100%;
  margin-top: 0.75rem;
  color: var(--text-secondary);
}

</style>

