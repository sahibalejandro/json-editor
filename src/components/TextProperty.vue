<script setup lang="ts">
interface Props {
  value: string;
};

interface Emits {
  (event: 'onInput', value: string): void;
}

defineEmits<Emits>();
const props = defineProps<Props>();
</script>

<template>
  <textarea
    cols="30"
    rows="10"
    :value="props.value"
    data-testid="textarea"
    @input="$emit('onInput', ($event.target as HTMLTextAreaElement).value)"
  />
</template>
