<script lang="ts" setup>
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <header class="app-header">
    <h1>Ecommerce App</h1>
    <button class="dark-toggle" @click="toggleDark()" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
      <span v-if="isDark">☀️</span>
      <span v-else>🌙</span>
    </button>
  </header>
</template>

<style scoped lang="scss">
@use '@/assets/styles/breakpoints' as *;

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--header-bg, #fff);
  border-bottom: 1px solid var(--border-color, #e0e0e0);
  transition: background-color 0.3s ease, border-color 0.3s ease;

  @include mobile-only {
    padding: 0.75rem 1rem;
  }

  h1 {
    margin: 0;
    font-size: 1.5rem;
    color: var(--text-color, #1a1a1a);

    @include mobile-only {
      font-size: 1.125rem;
    }
  }
}

.dark-toggle {
  background: transparent;
  border: 2px solid var(--border-color, #e0e0e0);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: transform 0.2s ease, border-color 0.3s ease;

  @include mobile-only {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
}
</style>