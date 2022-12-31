<template>
  {{ props.name }}:
  <div>
    Items added: <span data-testid="array-length">{{ props.array?.length || 0 }}</span>
  </div>

  <div v-for="(value, index) in props.array" :key="index">
    <input
      type="text"
      :value="value"
      :data-testid="`item-${index}-input`"
      @input="$emit('onUpdateItem', index, ($event.target as HTMLInputElement).value)"
    />
    <button
      type="button"
      @click="$emit('onDeleteItem', index)"
      :data-testid="`delete-item-${index}-button`"
    >
      &times;
    </button>
  </div>

  <button
    type="button"
    v-if="props.array.length > 0"
    data-testid="delete-all-button"
    @click="$emit('onDeleteAllItems')"
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
  name: string;
  array: string[];
}

interface Emits {
  (event: 'onDeleteAllItems'): void,
  (event: 'onAddItem', value: string): void;
  (event: 'onDeleteItem', itemIndex: number): void;
  (event: 'onUpdateItem', itemIndex: number, value: string): void;
}

const newItemInputValue = ref('');
const emit = defineEmits<Emits>();
const props = defineProps<Props>();

function handleNewItemOnKeypress(e: KeyboardEvent) {
  const value = (e.target as HTMLInputElement).value.trim();

  if (e.key === 'Enter' && value !== '') {
    emit('onAddItem', value);
    newItemInputValue.value = '';
  }
}
</script>
