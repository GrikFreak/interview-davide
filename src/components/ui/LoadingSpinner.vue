<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <div class="loading-spinner" :class="[`loading-spinner--${size ?? 'md'}`]">
    <div class="spinner"></div>
  </div>
</template>

<style scoped lang="scss">
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;

  &--sm .spinner {
    width: 20px;
    height: 20px;
    border-width: 2px;
  }

  &--md .spinner {
    width: 40px;
    height: 40px;
    border-width: 3px;
  }

  &--lg .spinner {
    width: 60px;
    height: 60px;
    border-width: 4px;
  }
}

.spinner {
  border-radius: 50%;
  border-style: solid;
  border-color: var(--border-color, #e0e0e0);
  border-top-color: var(--primary-color, #667eea);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

