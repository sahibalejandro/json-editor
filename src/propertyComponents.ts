import { VueElement } from "vue"

import StringProperty from './components/StringProperty.vue';
import SchemaProperty from './components/SchemaProperty.vue';

const propertyComponents: {
  [key: string]: VueElement;
} = {
  string: StringProperty,
  schema: SchemaProperty,
};

export default propertyComponents;
