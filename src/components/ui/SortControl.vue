<script setup lang="ts">
import type { SortOrder } from '@/services/products'

interface Props {
  currentSort?: SortOrder
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:sort': [value: SortOrder | undefined]
}>()

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const value = target.value as SortOrder | ''
  emit('update:sort', value === '' ? undefined : value)
}
</script>

<template>
  <div class="sort-control">
    <label for="sort-select" class="sort-control__label">Ordina per:</label>
    <select
      id="sort-select"
      :value="currentSort || ''"
      @change="handleChange"
      class="sort-control__select"
    >
      <option value="">Nessun ordinamento</option>
      <option value="asc">Prezzo: crescente</option>
      <option value="desc">Prezzo: decrescente</option>
    </select>
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

  &__select {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    background: var(--card-bg);
    color: var(--text-color);
    font-size: 0.9375rem;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 180px;

    @include mobile-only {
      width: 100%;
      min-width: auto;
    }

    &:hover {
      border-color: var(--primary-color);
    }

    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(54, 53, 251, 0.1);
    }
  }
}
</style>

