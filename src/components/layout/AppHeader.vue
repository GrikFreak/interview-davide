<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { getCategories } from '@/services/products'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { ShoppingCart, Heart, User, Sun, Moon } from 'lucide-vue-next'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

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

function handleUserClick() {
  if (authStore.isAuthenticated) {
    authStore.logout()
    if (route.name === 'cart' || route.name === 'wishlist') {
      router.push('/')
    }
  } else {
    authStore.openLoginModal()
  }
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
        :to="{ name: 'products' }"
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
      <template v-if="authStore.isAuthenticated">
        <RouterLink 
          to="/cart" 
          class="action-link" 
          :class="{ 'action-link-active': route.name === 'cart' }"
          title="Carrello"
        >
          <ShoppingCart :size="20" />
          <span v-if="cartStore.totalItems > 0" class="action-link__badge">
            {{ cartStore.totalItems > 99 ? '99+' : cartStore.totalItems }}
          </span>
        </RouterLink>
        <RouterLink 
          to="/wishlist" 
          class="action-link"
          :class="{ 'action-link-active': route.name === 'wishlist' }"
          title="Wishlist"
        >
          <Heart :size="20" />
          <span v-if="wishlistStore.totalItems > 0" class="action-link__badge">
            {{ wishlistStore.totalItems > 99 ? '99+' : wishlistStore.totalItems }}
          </span>
        </RouterLink>
      </template>
      <button 
        class="user-button"
        :class="{ 'user-button--authenticated': authStore.isAuthenticated }"
        @click="handleUserClick"
        :title="authStore.isAuthenticated ? 'Logout' : 'Login'"
      >
        <User :size="20" />
      </button>
      <button class="dark-toggle" @click="toggleDark()" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
        <Sun v-if="isDark" :size="18" />
        <Moon v-else :size="18" />
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
  padding: 0.625rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color);

  @include mobile-only {
    padding: 0.5rem;
  }

  &:hover {
    background-color: var(--hover-bg);
    color: var(--primary-color);
  }

  &.action-link-active {
    background-color: var(--primary-color);
    color: var(--active-text);
  }

  &__badge {
    position: absolute;
    top: -4px;
    right: -4px;
    background-color: #ef4444;
    color: white;
    font-size: 0.625rem;
    font-weight: 700;
    min-width: 18px;
    height: 18px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.25rem;
    border: 2px solid var(--header-bg);
    line-height: 1;

    @include mobile-only {
      font-size: 0.5625rem;
      min-width: 16px;
      height: 16px;
      border-radius: 8px;
      top: -2px;
      right: -2px;
    }
  }
}

.user-button {
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  width: 44px;
  height: 44px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color);
  transition: all 0.2s ease;

  @include mobile-only {
    width: 36px;
    height: 36px;
  }

  &:hover {
    background-color: var(--hover-bg);
    border-color: var(--primary-color);
    color: var(--primary-color);
  }

  &--authenticated {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--active-text);

    &:hover {
      background-color: var(--primary-hover);
      border-color: var(--primary-hover);
      color: var(--active-text);
    }
  }

  &:active {
    transform: scale(0.95);
  }
}

.dark-toggle {
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  width: 44px;
  height: 44px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color);
  transition: all 0.2s ease;

  @include mobile-only {
    width: 36px;
    height: 36px;
  }

  &:hover {
    background-color: var(--hover-bg);
    border-color: var(--primary-color);
    color: var(--primary-color);
  }

  &:active {
    transform: scale(0.95);
  }
}
</style>
