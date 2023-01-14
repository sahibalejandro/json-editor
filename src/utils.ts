import { Property } from "./types";

/**
 * Returns a safe key to use to access an object property or array
 * item, keys starting with "$" will be returned as an integer,
 * eg: "$3" will return the number 3, all other keys will
 * return unchanged.
 */
function safeKey(key: string): string | number {
  return isIndexKey(key) ? Number(key.substring(1)) : key;
}

/**
 * Returns true if the given key is an Index Key. Index keys
 * starts with "$", eg: "$5" which means it is the key for
 * the item in the 5th position of an array.
 */
export function isIndexKey(key: string) {
  return key && key.startsWith('$');
}

/**
 * Set the given value to the specified path in the given root object. Note that
 * the root object will be mutated. The path can be a mix of Property Keys and
 * Index Keys, and the necessary objects an arrays will be created so the
 * given path will always exists and will have the given value.
 */
export function setValue<T>(root: any, value: T, path: string[]) {
  let current = root;

  path.forEach((key, index) => {
    const targetKey = safeKey(key);
    const isLastKey = (index + 1) === path.length;
    const isNextKeyAnIndex = isIndexKey(path[index + 1]);

    if (isLastKey) {
      current[targetKey] = value;
      return;
    }

    if (current[targetKey] === undefined) {
      current[targetKey] = isNextKeyAnIndex ? [] : {};
    }

    current = current[targetKey];
  });
}

/**
 * Returns the value located at the specified path in the given root object,
 * if the value is not found it will return the defaultValue. The path can
 * be a mix of Property Keys and Index Keys.
 */
export function getValue<T>(root: any, path: string[]): T | undefined;
export function getValue<T>(root: any, path: string[], defaultValue: T): T;
export function getValue<T>(root: any, path: string[], defaultValue?: T) {
  const value = path.reduce((current, key) => {
    return current?.[safeKey(key)];
  }, root);

  return value || defaultValue;
}

/**
 * Returns a path containing the needed schema keys.
 * Input: ["property", "subProperty"]
 * Output: ["property", "schema", "subProperty", "schema"]
 */
export function getSchemaPath(path: string[]) {
  return path.reduce<string[]>((pathWithSchemaKeys, key) => {
    if (isIndexKey(key)) {
      return pathWithSchemaKeys;
    }

    return pathWithSchemaKeys.concat([key, 'schema']);
  }, []);
}

export function isArrayOfPrimitives(property: Property) {
  return property.type === 'array' && property.schema === undefined;
}

export function isArrayOfObjects(property: Property) {
  return property.type === 'array' && property.schema !== undefined;
}
