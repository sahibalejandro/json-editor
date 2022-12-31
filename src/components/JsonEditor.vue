<template>
  <div>
    Json Editor - current path:
    <a @click.prevent="backToRoot()" href="#">root</a>.{{ path.join('.') }}
  </div>

  <hr />

  <div v-for="(property, name) in currentSchema" :key="name">
    <StringProperty v-if="property.type === 'string'"
      :name="name as string"
      :value="getDataValueFor(name as string, '')"
      @on-update="(value) => handleOnUpdateProperty(name as string, value)"
    />

    <ArrayProperty v-if="property.type === 'array'"
      :name="name as string"
      :array="getDataValueFor(name as string, [])"
      @on-delete-all-items="handleOnDeleteAllItems(name as string)"
      @on-add-item="(value) => handleOnAddItem(name as string, value)"
      @on-delete-item="(itemIndex) => handleOnDeleteItem(name as string, itemIndex)"
      @on-update-item="(itemIndex, value) => handleOnUpdateItem(name as string, itemIndex, value)"
    />

    <SchemaProperty v-if="property.type === 'schema'" :name="name as string" :property="property" @onPushToPath="handlePushToPath" />
  </div>

  <hr />

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1em">
    <div>Current schema definition:</div>
    <div>Current data:</div>
    <textarea :value="JSON.stringify(currentSchema, null, 2)" cols="70" rows="10"></textarea>
    <textarea :value="JSON.stringify(data, null, 2)" cols="70" rows="10"></textarea>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';

import { Schema } from '../types';
import { getValue, pushSchemaKeysIntoPath, setValue } from '../utils';

import ArrayProperty from './ArrayProperty.vue';
import SchemaProperty from './SchemaProperty.vue';
import StringProperty from './StringProperty.vue';

const data = reactive({});
const path = reactive<string[]>([]);
const props = defineProps<{ schema: Schema }>();

const schemaPath = computed(() => {
  return (path.length === 0) ? [] : pushSchemaKeysIntoPath(path);
});

const currentSchema = computed(() => {
  return getValue<Schema>(props.schema, schemaPath.value, {});
});

/**
 * Reset the path to an empty array, it means the root schema will
 * be displayed.
 */
function backToRoot() {
  path.length = 0;
}

function getDataValueFor<T>(key: string, defaultValue: T) {
  return getValue<T>(data, [...path, key as string], defaultValue);
}

/**
 * Handle the event to push a new key into the path.
 */
function handlePushToPath(key: string) {
  path.push(key);
}

/**
 * Handle the event fired to add the given item to the array specified
 * by propertyName within the current data's path.
 */
function handleOnAddItem(propertyName: string, item: string) {
  const propertyPath = [...path, propertyName];
  let array = getValue<string[]>(data, propertyPath);

  // Create a new array and add it to the
  // data object if it does not exists.
  if (array === undefined) {
    array = [];
    setValue(data, array, propertyPath);
  }

  array.push(item);
}

function handleOnUpdateItem(propertyName: string, itemIndex: number, value: string) {
  getValue<string[]>(data, [...path, propertyName])?.splice(itemIndex, 1, value);
}

function handleOnDeleteItem(propertyName: string, itemIndex: number) {
  getValue<string[]>(data, [...path, propertyName])?.splice(itemIndex, 1);
}

function handleOnDeleteAllItems(propertyName: string) {
  setValue(data, [], [...path, propertyName]);
}

function handleOnUpdateProperty(propertyName: string, value: string) {
  setValue(data, value, [...path, propertyName]);
}
</script>
