<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from './Button.vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

interface Props {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalItems: number
}

const props = defineProps<Props>()

const router = useRouter()
const route = useRoute()

function updatePage(page: number) {
  router.push({
    query: {
      ...route.query,
      page: page.toString(),
    },
  })
}

const startItem = computed(() => (props.currentPage - 1) * props.itemsPerPage + 1)
const endItem = computed(() => {
  const end = props.currentPage * props.itemsPerPage
  return end > props.totalItems ? props.totalItems : end
})
</script>

<template>
  <div v-if="totalPages > 1" class="pagination">
    <Button
      variant="secondary"
      :disabled="currentPage === 1"
      @click="updatePage(currentPage - 1)"
    >
      <ChevronLeft :size="18" />
      Precedente
    </Button>
    
    <div class="pagination__info">
      <span class="pagination__range">
        {{ startItem }}-{{ endItem }} di {{ totalItems }}
      </span>
      <span class="pagination__pages">
        Pagina {{ currentPage }} di {{ totalPages }}
      </span>
    </div>
    
    <Button
      variant="secondary"
      :disabled="currentPage === totalPages"
      @click="updatePage(currentPage + 1)"
    >
      Successiva
      <ChevronRight :size="18" />
    </Button>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/breakpoints' as *;

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);

  @include mobile-only {
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 2rem;
    padding-top: 1.5rem;
  }

  :deep(.btn) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0 1rem;

    @include mobile-only {
      padding: 0;
      order: -1;
      gap: 0.125rem;
    }
  }

  &__range {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  &__pages {
    font-size: 0.9375rem;
    color: var(--text-secondary);
    font-weight: 500;

    @include mobile-only {
      font-size: 0.875rem;
    }
  }
}
</style>

