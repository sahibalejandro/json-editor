<template>
  <button type="button" @click="emit('pushToPath')">Edit {{ property.schemaName }}</button>
</template>

<script setup lang="ts">
import type { Property } from '../types';

interface Emits {
  (event: 'pushToPath'): void;
}

interface Props {
  property: Property;
}

const emit = defineEmits<Emits>();
defineProps<Props>();
</script>
