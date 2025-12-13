<script setup lang="ts">
import { computed } from 'vue'
import type { SortOrder } from '@/services/products'
import Select from './Select.vue'

interface Props {
  currentSort?: SortOrder
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:sort': [value: SortOrder | undefined]
}>()

const options = [
  { value: '', label: 'Nessun ordinamento' },
  { value: 'asc', label: 'Prezzo: crescente' },
  { value: 'desc', label: 'Prezzo: decrescente' },
]

const modelValue = computed({
  get: () => props.currentSort || '',
  set: (value) => {
    emit('update:sort', value === '' ? undefined : (value as SortOrder))
  },
})
</script>

<template>
  <div class="sort-control">
    <label class="sort-control__label">Ordina per:</label>
    <Select
      v-model="modelValue"
      :options="options"
      placeholder="Nessun ordinamento"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/breakpoints' as *;

.sort-control {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @include mobile-only {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  &__label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-color);
    white-space: nowrap;

    @include mobile-only {
      font-size: 0.8125rem;
    }
  }

}
</style>

