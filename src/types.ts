export interface Schema {
  [key: string]: Property;
}

export interface Property {
  type: 'array' | 'number' | 'schema' | 'string';
  schema?: Schema;
  schemaName?: string;
}

export interface Breadcrumb {
  key: string;
  index: number;
}
