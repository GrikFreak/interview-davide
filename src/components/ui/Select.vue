<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

interface Option {
  value: string | number
  label: string
}

interface Props {
  modelValue?: string | number
  options: Option[]
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Seleziona...',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | undefined]
}>()

const isOpen = ref(false)
const selectRef = ref<HTMLElement | null>(null)

const selectedOption = computed(() => {
  return props.options.find(opt => opt.value === props.modelValue)
})

const displayValue = computed(() => {
  return selectedOption.value?.label || props.placeholder
})

function toggleDropdown() {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

function selectOption(option: Option) {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

function handleClickOutside(event: MouseEvent) {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="selectRef" class="custom-select" :class="{ 'custom-select--open': isOpen, 'custom-select--disabled': disabled }">
    <button
      type="button"
      class="custom-select__trigger"
      :disabled="disabled"
      @click="toggleDropdown"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
    >
      <span class="custom-select__value" :class="{ 'custom-select__value--placeholder': !selectedOption }">
        {{ displayValue }}
      </span>
      <ChevronDown :size="18" class="custom-select__icon" :class="{ 'custom-select__icon--open': isOpen }" />
    </button>
    
    <Transition name="dropdown">
      <div v-if="isOpen" class="custom-select__dropdown">
        <button
          v-for="option in options"
          :key="option.value"
          type="button"
          class="custom-select__option"
          :class="{ 'custom-select__option--selected': option.value === modelValue }"
          @click="selectOption(option)"
        >
          {{ option.label }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/breakpoints' as *;

.custom-select {
  position: relative;
  width: 100%;
  min-width: 180px;

  &--open {
    .custom-select__dropdown {
      display: block;
    }
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;

    .custom-select__trigger {
      cursor: not-allowed;
    }
  }

  &__trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    background: var(--card-bg);
    color: var(--text-color);
    font-size: 0.9375rem;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;

    &:hover:not(:disabled) {
      border-color: var(--primary-color);
    }

    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(54, 53, 251, 0.1);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  &__value {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &--placeholder {
      color: var(--text-secondary);
    }
  }

  &__icon {
    color: var(--text-secondary);
    flex-shrink: 0;
    transition: transform 0.2s ease;

    &--open {
      transform: rotate(180deg);
    }
  }

  &__dropdown {
    position: absolute;
    top: calc(100% + 0.25rem);
    left: 0;
    right: 0;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    max-height: 300px;
    overflow-y: auto;
    margin-top: 0.25rem;
  }

  &__option {
    width: 100%;
    display: block;
    padding: 0.75rem 1rem;
    text-align: left;
    background: transparent;
    border: none;
    color: var(--text-color);
    font-size: 0.9375rem;
    cursor: pointer;
    transition: all 0.2s ease;
    border-bottom: 1px solid var(--border-color);

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: var(--hover-bg);
      color: var(--primary-color);
    }

    &--selected {
      background-color: var(--primary-color);
      color: var(--active-text);
      font-weight: 500;

      &:hover {
        background-color: var(--primary-hover);
        color: var(--active-text);
      }
    }
  }
}

.dropdown-enter-active {
  transition: all 0.2s ease-out;
}

.dropdown-leave-active {
  transition: all 0.15s ease-in;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@include mobile-only {
  .custom-select {
    min-width: auto;
  }
}
</style>

