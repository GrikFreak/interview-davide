<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types/product'
import { useWishlistStore } from '@/stores/wishlist'
import { Heart } from 'lucide-vue-next'
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
    <Heart :size="18" :fill="isInWishlist ? 'currentColor' : 'none'" class="heart-icon" />
  </Button>
</template>

<style scoped lang="scss">
.btn {
  border-radius: 50%;
}

.wishlist-button--active {
  .heart-icon {
    color: var(--wishlist-color);
  }

  &:hover .heart-icon {
    color: var(--wishlist-hover);
  }
}
</style>

