import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useJsonEditorStore = defineStore('JsonEditorStore', () => {
  const path = reactive([]);

  return {
    path,
  };
});
