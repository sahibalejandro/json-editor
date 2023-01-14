export interface Schema {
  [key: string]: Property;
}

type PropertyType = 'array' | 'number' | 'schema' | 'string' | 'text';

export interface Property {
  schema?: Schema;
  type: PropertyType;
  schemaName?: string;
}

export interface Breadcrumb {
  key: string;
  index: number;
}
