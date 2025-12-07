<script setup lang="ts">
import Button from '@/components/ui/Button.vue'

interface Props {
  quantity: number
  min?: number
  max?: number
  disabled?: boolean
}

interface Emits {
  (e: 'update:quantity', value: number): void
}

const props = withDefaults(defineProps<Props>(), {
  min: 1,
  max: 999,
  disabled: false,
})

const emit = defineEmits<Emits>()

function increase() {
  if (!props.disabled && props.quantity < props.max) {
    emit('update:quantity', props.quantity + 1)
  }
}

function decrease() {
  if (!props.disabled && props.quantity > props.min) {
    emit('update:quantity', props.quantity - 1)
  }
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = parseInt(target.value, 10)
  
  if (!isNaN(value)) {
    const clampedValue = Math.max(props.min, Math.min(props.max, value))
    emit('update:quantity', clampedValue)
  }
}
</script>

<template>
  <div class="quantity-selector">
    <Button
      variant="secondary"
      size="sm"
      icon
      @click="decrease"
      :disabled="disabled || quantity <= min"
      aria-label="Diminuisci quantità"
    >
      −
    </Button>
    <input
      type="number"
      :value="quantity"
      :min="min"
      :max="max"
      :disabled="disabled"
      @input="handleInput"
      class="quantity-input"
      aria-label="Quantità"
    />
    <Button
      variant="secondary"
      size="sm"
      icon
      @click="increase"
      :disabled="disabled || quantity >= max"
      aria-label="Aumenta quantità"
    >
      +
    </Button>
  </div>
</template>

<style scoped lang="scss">
.quantity-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 0.25rem;
  background: var(--card-bg);
}

.quantity-input {
  width: 60px;
  text-align: center;
  border: none;
  background: transparent;
  color: var(--text-color);
  font-size: 1rem;
  font-weight: 600;
  padding: 0.5rem;
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>

