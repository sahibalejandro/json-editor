<template>
  <div>
    Items added: <span data-testid="array-length">{{ props.array?.length || 0 }}</span>
  </div>

  <div v-for="(value, index) in props.array" :key="index">
    <input
      type="text"
      :value="value"
      :data-testid="`item-${index}-input`"
      @input="$emit('updateItem', index, ($event.target as HTMLInputElement).value)"
    />
    <button
      type="button"
      @click="$emit('deleteItem', index)"
      :data-testid="`delete-item-${index}-button`"
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

  <div>
    Add new: <input
      type="text"
      v-model="newItemInputValue"
      data-testid="new-item-input"
      @keypress="handleNewItemOnKeypress"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  array: string[];
}

interface Emits {
  (event: 'deleteAllItems'): void,
  (event: 'addItem', value: string): void;
  (event: 'deleteItem', index: number): void;
  (event: 'updateItem', index: number, value: string): void;
}

const newItemInputValue = ref('');
const emit = defineEmits<Emits>();
const props = defineProps<Props>();

function handleNewItemOnKeypress(e: KeyboardEvent) {
  const value = (e.target as HTMLInputElement).value.trim();

  if (e.key === 'Enter' && value !== '') {
    emit('addItem', value);
    newItemInputValue.value = '';
  }
}
</script>
