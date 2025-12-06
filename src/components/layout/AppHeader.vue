<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { getCategories } from '@/services/products'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const route = useRoute()

const categories = ref<string[]>([])
const isLoading = ref(true)

function capitalizeCategory(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1)
}

const isNavLinkActive = (category?: string) => {
  if (route.name !== 'products') return false
  if (category) {
    return route.query.category === category
  }
  return !route.query.category
}

onMounted(async () => {
  try {
    categories.value = await getCategories()
  } catch (e) {
    console.error('Errore nel caricamento delle categorie:', e)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <header class="app-header">
    <RouterLink to="/" class="logo">
      <h1>Ecommerce App</h1>
    </RouterLink>

    <nav class="main-nav">
      <RouterLink 
        to="/products" 
        class="nav-link"
        :class="{ 'nav-link-active': isNavLinkActive() }"
      >
        Tutti i Prodotti
      </RouterLink>
      <template v-if="!isLoading">
        <RouterLink
          v-for="category in categories"
          :key="category"
          :to="{ name: 'products', query: { category } }"
          class="nav-link"
          :class="{ 'nav-link-active': isNavLinkActive(category) }"
        >
          {{ capitalizeCategory(category) }}
        </RouterLink>
      </template>
    </nav>

    <div class="header-actions">
      <RouterLink 
        to="/cart" 
        class="action-link" 
        :class="{ 'action-link-active': route.name === 'cart' }"
        title="Carrello"
      >
        🛒
      </RouterLink>
      <RouterLink 
        to="/wishlist" 
        class="action-link"
        :class="{ 'action-link-active': route.name === 'wishlist' }"
        title="Wishlist"
      >
        ❤️
      </RouterLink>
      <button class="dark-toggle" @click="toggleDark()" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
        <span v-if="isDark">☀️</span>
        <span v-else>🌙</span>
      </button>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '@/assets/styles/breakpoints' as *;

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--header-bg);
  border-bottom: 1px solid var(--border-color);
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
    color: var(--text-color);
    transition: color 0.2s ease;

    @include mobile-only {
      font-size: 1.125rem;
    }
  }

  &:hover h1 {
    color: var(--primary-color);
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
  color: var(--text-color);
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
    background: var(--primary-color);
    transition: width 0.2s ease;
  }

  &:hover {
    color: var(--primary-color);

    &::after {
      width: 100%;
    }
  }

  &.nav-link-active {
    color: var(--primary-color);
    font-weight: 600;

    &::after {
      width: 100%;
    }
  }

  @include mobile-only {
    font-size: 0.875rem;
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-link {
  text-decoration: none;
  font-size: 1.25rem;
  padding: 0.5rem;
  border-radius: 50%;
  transition: transform 0.2s ease, background-color 0.2s ease;

  @include mobile-only {
    font-size: 1rem;
    padding: 0.375rem;
  }

  &:hover {
    transform: scale(1.1);
    background-color: var(--hover-bg);
  }

  &.action-link-active {
    background-color: var(--primary-color);
    color: var(--active-text);
    transform: scale(1.05);
  }
}

.dark-toggle {
  background: transparent;
  border: 2px solid var(--border-color);
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
