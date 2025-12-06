<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: boolean
  disabled?: boolean
  loading?: boolean
}>()
</script>

<template>
  <button
    class="btn"
    :class="[
      `btn--${variant ?? 'primary'}`,
      `btn--${size ?? 'md'}`,
      { 'btn--icon': icon, 'btn--loading': loading }
    ]"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="btn__spinner"></span>
    <slot v-else />
  </button>
</template>

<style scoped lang="scss">
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease, opacity 0.2s ease;

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  // Sizes
  &--sm {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }

  &--md {
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }

  &--lg {
    padding: 1rem 1.5rem;
    font-size: 1.125rem;
  }

  // Icon button sizes
  &--icon {
    padding: 0;

    &.btn--sm {
      width: 32px;
      height: 32px;
    }

    &.btn--md {
      width: 44px;
      height: 44px;
    }

    &.btn--lg {
      width: 52px;
      height: 52px;
    }
  }

  // Variants
  &--primary {
    background: var(--primary-color);
    color: white;

    &:hover:not(:disabled) {
      background: var(--primary-hover);
    }
  }

  &--secondary {
    background: var(--card-bg);
    color: var(--text-color);
    border: 1px solid var(--border-color);

    &:hover:not(:disabled) {
      background: var(--border-color);
    }
  }

  &--outline {
    background: transparent;
    color: var(--primary-color);
    border: 2px solid var(--primary-color);

    &:hover:not(:disabled) {
      background: var(--primary-color);
      color: white;
    }
  }

  &--ghost {
    background: transparent;
    color: var(--text-color);

    &:hover:not(:disabled) {
      background: var(--border-color);
    }
  }

  // Loading state
  &--loading {
    position: relative;
  }

  &__spinner {
    width: 1em;
    height: 1em;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

