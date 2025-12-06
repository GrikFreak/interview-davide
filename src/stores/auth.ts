import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi } from '@/services/auth'
import type { LoginPayload } from '@/types/auth'
import { TOKEN_KEY } from '@/consts'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isLoginModalOpen = ref(false)

  const isAuthenticated = computed(() => !!token.value)

  function setToken(newToken: string | null) {
    token.value = newToken
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  }

  async function login(credentials: LoginPayload) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await loginApi(credentials)
      setToken(response.token)
      isLoginModalOpen.value = false
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Errore durante il login'
      return false
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    setToken(null)
    error.value = null
  }

  function openLoginModal() {
    isLoginModalOpen.value = true
    error.value = null
  }

  function closeLoginModal() {
    isLoginModalOpen.value = false
    error.value = null
  }

  return {
    token,
    isLoading,
    error,
    isAuthenticated,
    isLoginModalOpen,
    login,
    logout,
    openLoginModal,
    closeLoginModal,
  }
})

