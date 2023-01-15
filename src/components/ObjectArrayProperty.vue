<template>
  <div>
    Items added: <span data-testid="array-length">{{ props.array.length }}</span>
  </div>
  <div v-for="(_item, index) in props.array">
    <button
      type="button"
      @click="$emit('setItemSchema', index)"
      :data-testid="`item-${index}-edit-button`"
    >
      Edit {{ props.property.schemaName }} #{{ index + 1 }}
    </button>
    <button
      type="button"
      @click="$emit('deleteItem', index)"
      :data-testid="`item-${index}-delete-button`"
    >
      &times;
    </button>
  </div>

  <button
    type="button"
    v-if="props.array.length > 0"
    data-testid="delete-all-button"
    @click="$emit('deleteAllItems')"
  >
    Delete all
  </button>

  <button
    type="button"
    data-testid="add-new-item-button"
    @click="$emit('setItemSchema', -1)"
  >
    Add new {{ props.property.schemaName }}
  </button>
</template>

<script setup lang="ts">
import { Property } from '../types';

interface Emits {
  (event: 'deleteAllItems'): void;
  (event: 'deleteItem', index: number): void;
  (event: 'setItemSchema', index: number): void;
}

interface Props {
  array: unknown[];
  property: Property
}

defineEmits<Emits>();
const props = defineProps<Props>();
</script>
