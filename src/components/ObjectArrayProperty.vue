<template>
  <div>
    Items added: <span data-testid="array-length">{{ props.array.length }}</span>
  </div>
  <div v-for="(_item, index) in props.array">
    <button
      type="button"
      @click="$emit('onSetSchema', index)"
      :data-testid="`item-${index}-edit-button`"
    >
      Edit {{ props.property.schemaName }} #{{ index + 1 }}
    </button>
    <button
      type="button"
      @click="$emit('onDeleteItem', index)"
      :data-testid="`item-${index}-delete-button`"
    >
      &times;
    </button>
  </div>
  <button
    type="button"
    @click="$emit('onSetSchema', -1)"
    data-testid="add-new-item-button"
  >
    Add new {{ props.property.schemaName }}
  </button>
</template>

<script setup lang="ts">
import { Property } from '../types';

interface Emits {
  (event: 'onSetSchema', index: number): void;
  (event: 'onDeleteItem', index: number): void;
}

interface Props {
  array: unknown[];
  property: Property
}

defineEmits<Emits>();
const props = defineProps<Props>();
</script>
