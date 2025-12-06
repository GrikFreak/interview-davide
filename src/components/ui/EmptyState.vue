<script setup lang="ts">
defineProps<{
  icon?: string
  title: string
  description?: string
}>()
</script>

<template>
  <div class="empty-state">
    <span v-if="icon" class="empty-state__icon">{{ icon }}</span>
    <h3 class="empty-state__title">{{ title }}</h3>
    <p v-if="description" class="empty-state__description">{{ description }}</p>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;

  &__icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  &__title {
    margin: 0 0 0.5rem;
    font-size: 1.25rem;
    color: var(--text-color, #1a1a1a);
  }

  &__description {
    margin: 0;
    color: var(--text-secondary, #666);
  }
}
</style>

