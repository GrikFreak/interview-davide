<script setup lang="ts">
defineProps<{
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url'
  placeholder?: string
  disabled?: boolean
  error?: string
  label?: string
}>()

const model = defineModel<string>()
</script>

<template>
  <div class="input-wrapper" :class="{ 'input-wrapper--error': error }">
    <label v-if="label" class="input-wrapper__label">{{ label }}</label>
    <input
      v-model="model"
      class="input"
      :type="type ?? 'text'"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-label="label || placeholder"
      :aria-invalid="!!error"
    />
    <span v-if="error" class="input-wrapper__error">{{ error }}</span>
  </div>
</template>

<style scoped lang="scss">
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &__label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-color);
  }

  &__error {
    font-size: 0.75rem;
    color: var(--error-color, #ef4444);
  }

  &--error .input {
    border-color: var(--error-color, #ef4444);

    &:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
    }
  }
}

.input {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--card-bg);
  color: var(--text-color);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &::placeholder {
    color: var(--text-secondary);
  }

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>

