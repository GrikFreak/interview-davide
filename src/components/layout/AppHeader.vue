<script lang="ts" setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { getCategories } from '@/services/products'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { ShoppingCart, Heart, User, Sun, Moon, Menu, X } from 'lucide-vue-next'
import SearchBar from '@/components/ui/SearchBar.vue'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const categories = ref<string[]>([])
const isLoading = ref(true)
const isMobileMenuOpen = ref(false)

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

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

function handleNavClick() {
  closeMobileMenu()
}

// Prevent body scroll when menu is open
watch(isMobileMenuOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})

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
  <div class="header-wrapper">
  <header class="app-header">
    <button 
      class="mobile-menu-toggle" 
      :class="{ 'mobile-menu-toggle--hidden': isMobileMenuOpen }"
      @click="toggleMobileMenu" 
      aria-label="Toggle menu"
    >
      <Menu :size="24" />
    </button>

    <RouterLink :to="{ name: 'products' }" class="logo" @click="closeMobileMenu">
      <h1>Ecommerce App</h1>
    </RouterLink>

    <nav class="main-nav" :class="{ 'main-nav--open': isMobileMenuOpen }">
      <div v-if="isMobileMenuOpen" class="main-nav__header">
        <h2 class="main-nav__title">Menu</h2>
        <button class="main-nav__close" @click="closeMobileMenu" aria-label="Close menu">
          <X :size="24" />
        </button>
      </div>
      
      <RouterLink 
        :to="{ name: 'products' }"
        class="nav-link"
        :class="{ 'nav-link-active': isNavLinkActive() }"
        @click="handleNavClick"
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
          @click="handleNavClick"
        >
          {{ capitalizeCategory(category) }}
        </RouterLink>
      </template>
    </nav>

    <div class="desktop-search">
      <SearchBar />
    </div>
    
    <Transition name="overlay">
      <div 
        v-if="isMobileMenuOpen" 
        class="mobile-menu-overlay" 
        @click="closeMobileMenu"
      ></div>
    </Transition>


    <div class="header-actions">
      <template v-if="authStore.isAuthenticated">
        <RouterLink 
          to="/cart" 
          class="action-link" 
          :class="{ 'action-link-active': route.name === 'cart' }"
          title="Carrello"
        >
          <ShoppingCart :size="20" />
          <Transition name="badge">
            <span v-if="cartStore.totalItems > 0" class="action-link__badge" :key="cartStore.totalItems">
              {{ cartStore.totalItems > 99 ? '99+' : cartStore.totalItems }}
            </span>
          </Transition>
        </RouterLink>
        <RouterLink 
          to="/wishlist" 
          class="action-link"
          :class="{ 'action-link-active': route.name === 'wishlist' }"
          title="Wishlist"
        >
          <Heart :size="20" />
          <Transition name="badge">
            <span v-if="wishlistStore.totalItems > 0" class="action-link__badge" :key="wishlistStore.totalItems">
              {{ wishlistStore.totalItems > 99 ? '99+' : wishlistStore.totalItems }}
            </span>
          </Transition>
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
  
  <div class="mobile-search-bar">
    <SearchBar />
  </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/breakpoints' as *;

.header-wrapper {
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-header {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--header-bg);
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.3s ease, border-color 0.3s ease;

  @include tablet-only {
    padding: 1rem 1.5rem;
  }

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
  align-items: center;

  @include tablet-only {
    gap: 1.25rem;
  }

  @include mobile-and-tablet {
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    max-width: 85vw;
    height: 100vh;
    background: var(--header-bg);
    z-index: 1001;
    flex-direction: column;
    align-items: stretch;
    padding: 0;
    gap: 0;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow-y: auto;
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.15);

    &--open {
      transform: translateX(0);
    }
  }

  &__header {
    display: none;

    @include mobile-and-tablet {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      background: var(--header-bg);
      z-index: 10;
    }
  }

  &__title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-color);
  }

  &__close {
    background: transparent;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    color: var(--text-color);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    transition: all 0.2s ease;

    &:hover {
      background-color: var(--hover-bg);
      color: var(--primary-color);
    }

    &:active {
      transform: scale(0.95);
    }
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
    background: var(--text-color);
    transition: width 0.2s ease;
  }

  &:hover {

    &::after {
      width: 100%;
    }
  }

  &.nav-link-active {
    font-weight: 600;

    &::after {
      width: 100%;
    }
  }

  @include tablet-only {
    font-size: 0.9375rem;
  }

  @include mobile-and-tablet {
    font-size: 1rem;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
    text-align: left;
    width: 100%;
    display: block;
    margin: 0;
    border-radius: 0;

    &:first-of-type {
      border-top: none;
    }

    &:last-child {
      border-bottom: none;
    }

    &::after {
      display: none;
    }

    &:hover,
    &:active {
      background-color: var(--hover-bg);
      color: var(--primary-color);
    }

    &.nav-link-active {
      background-color: var(--primary-color);
      color: var(--active-text);
      font-weight: 600;
    }
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @include mobile-only {
    gap: 0.375rem;
  }
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

  @include tablet-only {
    padding: 0.5625rem;
  }

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

.badge-enter-active {
  animation: badgeBounce 0.5s ease;
}

.badge-leave-active {
  animation: badgeBounce 0.3s ease reverse;
}

@keyframes badgeBounce {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
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

  @include tablet-only {
    width: 40px;
    height: 40px;
  }

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

  @include tablet-only {
    width: 40px;
    height: 40px;
  }

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

.mobile-menu-toggle {
  display: none;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  width: 44px;
  height: 44px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  color: var(--text-color);
  transition: all 0.2s ease;
  padding: 0;
  flex-shrink: 0;

  @include mobile-and-tablet {
    display: flex;
    width: 40px;
    height: 40px;
    order: 0;
    z-index: 1002;
    position: relative;
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

.mobile-menu-toggle--hidden {
  @include mobile-and-tablet {
    display: none !important;
  }
}

.mobile-menu-overlay {
  display: none;

  @include mobile-and-tablet {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    backdrop-filter: blur(2px);
  }
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.desktop-search {
  display: flex;
  justify-content: flex-end;
  flex: 1;
  max-width: 500px;
  margin: 0 1.5rem;

  @include tablet-only {
    max-width: 300px;
    margin: 0 1rem;
  }

  @include mobile-and-tablet {
    display: none;
  }
}

.mobile-search-bar {
  display: none;

  @include mobile-and-tablet {
    display: block;
    width: 100%;
    padding: 1rem;
    background: var(--header-bg);
    border-bottom: 1px solid var(--border-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    :deep(.search-bar) {
      width: 100%;
      padding: 0.5rem 1rem;
    }
  }
}

@include mobile-and-tablet {
  .logo {
    flex: 1;
    order: 1;
    margin-left: 0.75rem;
  }

  .header-actions {
    order: 2;
    margin-left: auto;
  }
}
</style>
