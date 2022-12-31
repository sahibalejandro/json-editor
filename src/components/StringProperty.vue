<template>
  {{ props.name }}:
  <input
    type="text"
    data-testid="input"
    :value="props.value"
    @input="$emit('onUpdate', ($event.target as HTMLInputElement).value)"
  >
</template>

<script setup lang="ts">
interface Emits {
  (event: 'onUpdate', value: string): void;
}

interface Props {
  name: string;
  value: string;
} 

defineEmits<Emits>();
const props = defineProps<Props>();
</script>
