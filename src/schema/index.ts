import { Schema } from '../types';

const schema: Schema = {

  name: {
    type: 'string',
  },

  settings: {
    type: 'schema',
    schemaName: 'Settings',
    schema: {
      phone: {
        type: 'string',
      },
    },
  },

  roles: {
    type: 'array',
  },

};

export default schema;
