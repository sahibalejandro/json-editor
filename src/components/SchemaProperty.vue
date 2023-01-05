<template>
  <button type="button" @click="emit('onPushToPath')">Edit {{ property.schemaName }}</button>
</template>

<script setup lang="ts">
import type { Property } from '../types';

interface Emits {
  (event: 'onPushToPath'): void;
}

interface Props {
  property: Property;
}

const emit = defineEmits<Emits>();
defineProps<Props>();
</script>
