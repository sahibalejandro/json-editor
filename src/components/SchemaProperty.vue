<template>
  {{ props.name }}:
  <button type="button" @click="emit('onPushToPath', props.name)">Add {{ property.schemaName }}</button>
</template>

<script setup lang="ts">
import type { Property } from '../types';

interface Emits {
  (event: 'onPushToPath', key: string): void;
}

interface Props {
  name: string;
  property: Property;
}

const emit = defineEmits<Emits>();
const props = defineProps<Props>();
</script>
