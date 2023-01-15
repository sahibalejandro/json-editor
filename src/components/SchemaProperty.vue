<template>
  <button type="button" @click="$emit('pushToPath')" data-testid="button">
    Edit {{ property.schemaName }}
  </button>
</template>

<script setup lang="ts">
import type { Property } from '../types';

interface Emits {
  (event: 'pushToPath'): void;
}

interface Props {
  property: Property;
}

defineEmits<Emits>();
defineProps<Props>();
</script>
