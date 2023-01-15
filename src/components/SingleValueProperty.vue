<script setup lang="ts">
import { Property } from '../types';

export interface Props {
  value: string;
  property: Property;
} 

interface Emits {
  (event: 'input', value: string | number): void;
}

const emit = defineEmits<Emits>();
const props = defineProps<Props>();
const inputType: Record<string, string> = {
  string: 'text',
  number: 'number',
};

/**
 * Handles the event when the input changes.
 */
function handleInput(event: Event) {
  let value: string | number = (event.target as HTMLInputElement).value;

  if (props.property.type === 'number') {
    value = Number(value);
  }

  emit('input', value);
}
</script>

<template>
  <input
    data-testid="input"
    :value="props.value"
    @input="handleInput"
    :type="inputType[props.property.type]"
  />
</template>
