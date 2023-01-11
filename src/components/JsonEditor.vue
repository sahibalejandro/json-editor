<script setup lang="ts">
import { computed, reactive } from 'vue';

import { Schema } from '../types';
import {
  getValue,
  setValue,
  getSchemaPath,
  isArrayOfObjects,
  isArrayOfPrimitives,
} from '../utils';

import ArrayProperty from './ArrayProperty.vue';
import SchemaProperty from './SchemaProperty.vue';
import StringProperty from './StringProperty.vue';
import ObjectArrayProperty from './ObjectArrayProperty.vue';

const data = reactive({});
const path = reactive<string[]>([]);
const props = defineProps<{ schema: Schema }>();

const schemaPath = computed(() => {
  return (path.length === 0) ? [] : getSchemaPath(path);
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

/**
 * Get the value of the given key within the current path, if
 * the property does not exists it will return defaultValue.
 */
function getDataValueFor<T>(key: string, defaultValue: T) {
  return getValue<T>(data, [...path, key], defaultValue);
}

/**
 * Handle the event to push a new key into the path.
 */
function handlePushToPath(key: string) {
  path.push(key);
}

/**
 * Handle the event to set the schema for an item in an array of objects.
 */
function handleOnSetItemSchema(key: string, index: number) {
  let indexPath = index;
  const propertyPath = [...path, key];
  let array = getValue<any[]>(data, propertyPath);

  // The first time this schema is set, the array will not
  // exists in the data object and we need to create it.
  if (array === undefined) {
    array = [];
    setValue(data, array, propertyPath);
  }

  // When indexPath is < 0 it means we will set the schema for adding
  // a new item at the end of the array, we need to push this new
  // object into the current array in order to mutate it.
  if (indexPath < 0) {
    array.push({});
    indexPath = array.length - 1;
  }

  handlePushToPath(key);
  handlePushToPath(`\$${indexPath}`);
}

/**
 * Handle the event fired to add the given item to the array specified
 * by key within the current data's path.
 */
function handleOnAddItem(key: string, item: string) {
  const propertyPath = [...path, key];
  let array = getValue<string[]>(data, propertyPath);

  // Create a new array and add it to the
  // data object if it does not exists.
  if (array === undefined) {
    array = [];
    setValue(data, array, propertyPath);
  }

  array.push(item);
}

/**
 * Handle the event to update the item at the given index from the array
 * under the given key in the object at the current path.
 */
function handleOnUpdateItem(key: string, index: number, value: string) {
  getValue<string[]>(data, [...path, key])?.splice(index, 1, value);
}

/**
 * handles the event to delete an item at the specified index from the
 * array under the given key in the object at the current path.
 */
function handleOnDeleteItem(key: string, index: number) {
  getValue<unknown[]>(data, [...path, key])?.splice(index, 1);
}

/**
 * Handles the event to clear all the items in the array under the given
 * key in the object at the current path.
 */
function handleOnDeleteAllItems(key: string) {
  setValue(data, [], [...path, key]);
}

/**
 * Handle the event to update the value under the given key in
 * the object at the current path.
 */
function handleOnUpdateProperty(key: string, value: string) {
  setValue(data, value, [...path, key]);
}
</script>

<template>
  <div>
    Json Editor - current path:
    <a @click.prevent="backToRoot()" href="#">root</a>.{{ path.join('.') }}
  </div>

  <hr />

  <div v-for="(property, key) in currentSchema" :key="key">
    {{ key }}:
    <StringProperty v-if="property.type === 'string'"
      :value="getDataValueFor(key as string, '')"
      @on-update="(value) => handleOnUpdateProperty(key as string, value)"
    />

    <ArrayProperty v-if="isArrayOfPrimitives(property)"
      :array="getDataValueFor(key as string, [])"
      @on-delete-all-items="handleOnDeleteAllItems(key as string)"
      @on-add-item="(value) => handleOnAddItem(key as string, value)"
      @on-delete-item="(index) => handleOnDeleteItem(key as string, index)"
      @on-update-item="(index, value) => handleOnUpdateItem(key as string, index, value)"
    />

    <ObjectArrayProperty v-if="isArrayOfObjects(property)"
      :property="property"
      :array="getDataValueFor(key as string, [])"
      @on-delete-all-items="handleOnDeleteAllItems(key as string)"
      @on-delete-item="(index) => handleOnDeleteItem(key as string, index)"
      @on-set-item-schema="(index) => handleOnSetItemSchema(key as string, index)"
    />

    <SchemaProperty
      v-if="property.type === 'schema'"
      :property="property" @onPushToPath="handlePushToPath(key as string)"
    />
  </div>

  <hr />

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1em">
    <div>Current schema definition:</div>
    <div>Current data:</div>
    <textarea :value="JSON.stringify(currentSchema, null, 2)" cols="70" rows="10"></textarea>
    <textarea :value="JSON.stringify(data, null, 2)" cols="70" rows="10"></textarea>
  </div>
</template>

