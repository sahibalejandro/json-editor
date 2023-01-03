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

  favorites: {
    type: 'array',
    schemaName: 'Favorite',
    schema: {
      product_id: {
        type: 'string',
      },
      stars: {
        type: 'string',
      }
    },
  }

};

export default schema;
