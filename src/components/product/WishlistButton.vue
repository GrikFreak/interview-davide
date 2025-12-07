<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types/product'
import { useWishlistStore } from '@/stores/wishlist'
import Button from '@/components/ui/Button.vue'

interface Props {
  product: Product
}

const props = defineProps<Props>()

const wishlistStore = useWishlistStore()

const isInWishlist = computed(() => wishlistStore.isInWishlist(props.product.id))

function handleToggle() {
  wishlistStore.toggleWishlist(props.product)
}
</script>

<template>
  <Button
    variant="secondary"
    icon
    @click="handleToggle"
    :aria-label="isInWishlist ? 'Rimuovi dalla wishlist' : 'Aggiungi alla wishlist'"
    :class="{ 'wishlist-button--active': isInWishlist }"
  >
    {{ isInWishlist ? '❤️' : '🤍' }}
  </Button>
</template>

<style scoped lang="scss">
.wishlist-button--active {
  background-color: var(--primary-color);
  color: var(--active-text);
}
</style>

