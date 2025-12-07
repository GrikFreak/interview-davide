<script setup lang="ts">
import { computed } from 'vue'
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

function handleAddToCart() {
  if (isInCart.value) {
    cartStore.removeFromCart(props.product.id)
  } else {
    cartStore.addToCart(props.product, 1)
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
  <div class="add-to-cart">
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
      <Button variant="secondary" @click="handleAddToCart">
        Rimuovi dal carrello
      </Button>
    </template>
    <template v-else>
      <Button @click="handleAddToCart">
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
}
</style>

