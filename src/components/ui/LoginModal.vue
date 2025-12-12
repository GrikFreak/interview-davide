<script lang="ts" setup>
import { ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import Button from './Button.vue'
import Input from './Input.vue'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const authStore = useAuthStore()

const username = ref('')
const password = ref('')

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    username.value = ''
    password.value = ''
    authStore.error = null
  }
})

async function handleSubmit() {
  await authStore.login({
    username: username.value,
    password: password.value,
  })
}

function handleClose() {
  if (!authStore.isLoading) {
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="handleClose">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Login</h2>
            <button class="close-button" @click="handleClose" :disabled="authStore.isLoading">
              <X :size="20" />
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="modal-body">
            <div v-if="authStore.error" class="error-message">
              {{ authStore.error }}
            </div>

            <div class="info-message">
              <strong>Credenziali di test:</strong><br>
              Username: <code>mor_2314</code><br>
              Password: <code>83r5^_</code>
            </div>

            <Input
              v-model="username"
              type="text"
              label="Username"
              placeholder="Inserisci il tuo username"
              required
              :disabled="authStore.isLoading"
            />

            <Input
              v-model="password"
              type="password"
              label="Password"
              placeholder="Inserisci la tua password"
              required
              :disabled="authStore.isLoading"
            />

            <div class="modal-actions">
              <Button
                type="button"
                variant="secondary"
                @click="handleClose"
                :disabled="authStore.isLoading"
              >
                Annulla
              </Button>
              <Button
                type="submit"
                :loading="authStore.isLoading"
              >
                Accedi
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
@use '@/assets/styles/breakpoints' as *;

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;

  @include mobile-only {
    padding: 1rem;
    align-items: center;
    justify-content: center;
  }
}

.modal-content {
  background: var(--card-bg);
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  max-height: 90vh;
  overflow-y: auto;

  @include mobile-only {
    max-width: calc(100% - 2rem);
    border-radius: 12px;
    max-height: 90vh;
    margin: auto;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);

  @include mobile-only {
    padding: 1.25rem;
  }

  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: var(--text-color);

    @include mobile-only {
      font-size: 1.25rem;
    }
  }
}

.close-button {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: var(--hover-bg);
    color: var(--text-color);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @include mobile-only {
    padding: 1.25rem;
    gap: 1.25rem;
  }
}

.error-message {
  padding: 0.75rem;
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 6px;
  color: #dc2626;
  font-size: 0.875rem;
}

.info-message {
  padding: 0.75rem;
  background-color: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 6px;
  color: var(--text-color);
  font-size: 0.875rem;
  line-height: 1.5;

  code {
    background-color: rgba(0, 0, 0, 0.1);
    padding: 0.125rem 0.375rem;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 0.8125rem;
  }
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
  flex-wrap: wrap;

  @include mobile-only {
    flex-direction: column-reverse;
    gap: 0.5rem;

    :deep(.btn) {
      width: 100%;
    }
  }
}

// Modal transitions
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
  opacity: 0;
}
</style>

