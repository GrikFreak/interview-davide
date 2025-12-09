<script setup lang="ts">
import AppHeader from './components/layout/AppHeader.vue'
import LoginModal from './components/ui/LoginModal.vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <AppHeader />
  <RouterView v-slot="{ Component, route }">
    <Transition name="slide-fade" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>
  <LoginModal :is-open="authStore.isLoginModalOpen" @close="authStore.closeLoginModal" />
</template>

<style scoped lang="scss">
.slide-fade-enter-active {
  transition: all 0.25s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
