export interface Schema {
  [key: string]: Property;
}

export interface Property {
  type: 'array' | 'string' | 'schema';
  schema?: Schema;
  schemaName?: string;
}
