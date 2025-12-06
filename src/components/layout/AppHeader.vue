<script lang="ts" setup>
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <header class="app-header">
    <RouterLink to="/" class="logo">
      <h1>Ecommerce App</h1>
    </RouterLink>

    <nav class="main-nav">
      <RouterLink to="/" class="nav-link">Home</RouterLink>
      <RouterLink to="/products" class="nav-link">Prodotti</RouterLink>
      <RouterLink to="/cart" class="nav-link">Carrello</RouterLink>
      <RouterLink to="/wishlist" class="nav-link">Wishlist</RouterLink>
    </nav>

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
    flex-wrap: wrap;
    gap: 0.75rem;
  }
}

.logo {
  text-decoration: none;

  h1 {
    margin: 0;
    font-size: 1.5rem;
    color: var(--text-color, #1a1a1a);
    transition: color 0.2s ease;

    @include mobile-only {
      font-size: 1.125rem;
    }
  }

  &:hover h1 {
    color: var(--primary-color, #667eea);
  }
}

.main-nav {
  display: flex;
  gap: 1.5rem;

  @include mobile-only {
    order: 3;
    width: 100%;
    justify-content: center;
    gap: 1rem;
  }
}

.nav-link {
  text-decoration: none;
  color: var(--text-color, #1a1a1a);
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--primary-color, #667eea);
    transition: width 0.2s ease;
  }

  &:hover,
  &.router-link-active {
    color: var(--primary-color, #667eea);

    &::after {
      width: 100%;
    }
  }

  @include mobile-only {
    font-size: 0.875rem;
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
