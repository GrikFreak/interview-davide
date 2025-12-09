<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Product } from '@/types/product'
import { useCartStore } from '@/stores/cart'
import Button from '@/components/ui/Button.vue'
import QuantitySelector from './QuantitySelector.vue'

interface Props {
  product: Product
  showQuantity?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showQuantity: false,
})

const cartStore = useCartStore()

const isInCart = computed(() => cartStore.isInCart(props.product.id))
const quantity = computed(() => cartStore.getItemQuantity(props.product.id) || 1)
const isAnimating = ref(false)

function handleAddToCart() {
  if (isInCart.value) {
    cartStore.removeFromCart(props.product.id)
  } else {
    cartStore.addToCart(props.product, 1)
    // Trigger animation
    isAnimating.value = true
    setTimeout(() => {
      isAnimating.value = false
    }, 600)
  }
}

function handleQuantityChange(newQuantity: number) {
  if (newQuantity <= 0) {
    cartStore.removeFromCart(props.product.id)
  } else {
    cartStore.updateQuantity(props.product.id, newQuantity)
  }
}
</script>

<template>
  <div class="add-to-cart" :class="{ 'add-to-cart--with-quantity': isInCart && showQuantity }">
    <template v-if="isInCart && showQuantity">
      <QuantitySelector
        :quantity="quantity"
        @update:quantity="handleQuantityChange"
      />
      <Button variant="secondary" @click="handleAddToCart">
        Rimuovi dal carrello
      </Button>
    </template>
    <template v-else-if="isInCart">
      <Button variant="secondary" @click="handleAddToCart" class="add-to-cart__button">
        Rimuovi dal carrello
      </Button>
    </template>
    <template v-else>
      <Button 
        @click="handleAddToCart" 
        class="add-to-cart__button"
        :class="{ 'add-to-cart__button--animating': isAnimating }"
      >
        Aggiungi al carrello
      </Button>
    </template>
  </div>
</template>

<style scoped lang="scss">
.add-to-cart {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;

  &__button {
    flex: 1;
    min-width: 0;

    :deep(.btn) {
      width: 100%;
    }
  }

  &--with-quantity {
    .add-to-cart__button {
      flex: 0 0 auto;

      :deep(.btn) {
        width: auto;
      }
    }
  }

  &__button {
    &--animating {
      :deep(.btn) {
        animation: addToCartPulse 0.6s ease;
      }
    }
  }
}

@keyframes addToCartPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 0 rgba(54, 53, 251, 0.7);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(54, 53, 251, 0);
  }
}
</style>

