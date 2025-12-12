<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Product } from '@/types/product'
import { useCartStore } from '@/stores/cart'
import { Trash2 } from 'lucide-vue-next'
import QuantitySelector from '@/components/product/QuantitySelector.vue'
import Button from '@/components/ui/Button.vue'

interface Props {
  product: Product
  quantity: number
}

const props = defineProps<Props>()
const router = useRouter()
const cartStore = useCartStore()

const itemTotal = computed(() => props.product.price * props.quantity)

function handleQuantityChange(newQuantity: number) {
  cartStore.updateQuantity(props.product.id, newQuantity)
}

function handleRemove() {
  cartStore.removeFromCart(props.product.id)
}

function handleProductClick() {
  router.push({ name: 'product-detail', params: { id: props.product.id } })
}
</script>


<template>
  <article class="cart-item">
    <div class="cart-item__image" @click="handleProductClick">
      <img :src="product.image" :alt="product.title" />
    </div>
    
    <div class="cart-item__content">
      <div class="cart-item__info">
        <h3 class="cart-item__title" @click="handleProductClick">
          {{ product.title }}
        </h3>
        <p class="cart-item__category">{{ product.category }}</p>
        <p class="cart-item__price">€{{ product.price.toFixed(2) }} cad.</p>
      </div>

      <div class="cart-item__actions">
        <QuantitySelector
          :quantity="quantity"
          @update:quantity="handleQuantityChange"
        />
        <p class="cart-item__total">€{{ itemTotal.toFixed(2) }}</p>
        <Button
          variant="ghost"
          size="sm"
          icon
          @click="handleRemove"
          aria-label="Rimuovi dal carrello"
        >
          <Trash2 :size="18" />
        </Button>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
@use '@/assets/styles/breakpoints' as *;

.cart-item {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  transition: box-shadow 0.2s ease;

  @include tablet-only {
    padding: 1.25rem;
    gap: 1.25rem;
  }

  @include mobile-only {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.cart-item__image {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  background: var(--image-bg);
  border-radius: 0.5rem;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;

  @include tablet-only {
    width: 100px;
    height: 100px;
  }

  @include mobile-only {
    width: 100%;
    height: 200px;
  }

  &:hover {
    transform: scale(1.05);

    @include mobile-only {
      transform: none;
    }
  }

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
}

.cart-item__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
}

.cart-item__info {
  flex: 1;
}

.cart-item__title {
  margin: 0 0 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color);
  cursor: pointer;
  transition: color 0.2s ease;

  @include mobile-only {
    font-size: 1rem;
  }

  &:hover {
    color: var(--primary-color);
  }
}

.cart-item__category {
  margin: 0 0 0.5rem;
  font-size: 0.875rem;
  text-transform: uppercase;
  color: var(--primary-color);
  font-weight: 600;
  letter-spacing: 0.05em;
}

.cart-item__price {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.cart-item__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @include mobile-only {
    justify-content: space-between;
    gap: 0.75rem;
  }
}

.cart-item__total {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
  min-width: 80px;
  text-align: right;

  @include tablet-only {
    font-size: 1.125rem;
  }

  @include mobile-only {
    flex: 1;
    text-align: left;
    font-size: 1.125rem;
    min-width: auto;
  }
}
</style>

