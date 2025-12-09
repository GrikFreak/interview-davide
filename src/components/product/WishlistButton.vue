<script setup lang="ts">
import { computed, ref } from 'vue'
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
const isAnimating = ref(false)

function handleToggle() {
  const wasInWishlist = isInWishlist.value
  wishlistStore.toggleWishlist(props.product)
  
  // Animate only when adding to wishlist
  if (!wasInWishlist) {
    isAnimating.value = true
    setTimeout(() => {
      isAnimating.value = false
    }, 600)
  }
}
</script>

<template>
  <Button
    variant="secondary"
    icon
    @click="handleToggle"
    :aria-label="isInWishlist ? 'Rimuovi dalla wishlist' : 'Aggiungi alla wishlist'"
    :class="{ 
      'wishlist-button--active': isInWishlist,
    }"
  >
    <Heart 
      :size="18" 
      :fill="isInWishlist ? 'currentColor' : 'none'" 
      class="heart-icon"
      :class="{ 'heart-icon--animating': isAnimating }"
    />
  </Button>
</template>

<style scoped lang="scss">
.btn {
  border-radius: 50%;
}

.wishlist-button--active {
  .heart-icon {
    color: var(--wishlist-color);
    transition: color 0.3s ease, transform 0.3s ease;
  }

  &:hover .heart-icon {
    color: var(--wishlist-hover);
  }
}

.heart-icon {
  transition: color 0.3s ease, transform 0.2s ease;

  &--animating {
    animation: heartBeat 0.6s ease;
  }
}

@keyframes heartBeat {
  0%, 100% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.2);
  }
  50% {
    transform: scale(1.1);
  }
  75% {
    transform: scale(1.15);
  }
}
</style>

