<script setup lang="ts">
import JsonEditor from './components/JsonEditor.vue';

import schema from './schema';
</script>

<template>
  <JsonEditor :schema="schema" />
</template>
