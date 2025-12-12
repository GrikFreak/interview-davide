<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Search, X } from 'lucide-vue-next'

interface Props {
  placeholder?: string
  autoFocus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Cerca prodotti...',
  autoFocus: false,
})

const router = useRouter()
const route = useRoute()

const searchQuery = ref('')
const isFocused = ref(false)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// Sync search query with route
watch(() => route.query.search, (search) => {
  if (search && typeof search === 'string') {
    searchQuery.value = search
  } else if (!search) {
    searchQuery.value = ''
  }
}, { immediate: true })

function handleSearch() {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  
  debounceTimer = setTimeout(() => {
    if (searchQuery.value.trim()) {
      router.push({
        name: 'products',
        query: {
          ...route.query,
          search: searchQuery.value.trim(),
          page: '1', // Reset to first page on new search
        },
      })
    } else {
      const { search, ...restQuery } = route.query
      router.push({
        name: 'products',
        query: restQuery,
      })
    }
  }, 500) // 500ms debounce
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  searchQuery.value = target.value
  handleSearch()
}

function clearSearch() {
  searchQuery.value = ''
  handleSearch()
}

onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
})
</script>

<template>
  <div class="search-bar" :class="{ 'search-bar--focused': isFocused }">
    <Search :size="20" class="search-bar__icon" />
    <input
      :value="searchQuery"
      type="text"
      class="search-bar__input"
      :placeholder="placeholder"
      @input="handleInput"
      @focus="isFocused = true"
      @blur="isFocused = false"
      :autofocus="autoFocus"
    />
    <button
      v-if="searchQuery"
      class="search-bar__clear"
      @click="clearSearch"
      aria-label="Clear search"
      type="button"
    >
      <X :size="16" />
    </button>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/breakpoints' as *;

.search-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  transition: all 0.2s ease;
  width: 80%;
  

  &--focused {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(54, 53, 251, 0.1);
  }

  &__icon {
    color: var(--text-secondary);
    flex-shrink: 0;
  }

  &__input {
    flex: 1;
    border: none;
    background: transparent;
    color: var(--text-color);
    font-size: 0.9375rem;
    outline: none;
    width: 100%;
    min-width: 0;

    &::placeholder {
      color: var(--text-secondary);
    }
  }

  &__clear {
    background: transparent;
    border: none;
    padding: 0.25rem;
    cursor: pointer;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.25rem;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &:hover {
      background-color: var(--hover-bg);
      color: var(--text-color);
    }
  }
}
</style>

