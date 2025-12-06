<script setup lang="ts">
import AppHeader from './components/layout/AppHeader.vue'
import LoginModal from './components/ui/LoginModal.vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <AppHeader />
  <RouterView />
  <LoginModal :is-open="authStore.isLoginModalOpen" @close="authStore.closeLoginModal" />
</template>

<style scoped lang="scss">
</style>
