import type { Property } from '../types';
import {
  getValue,
  setValue,
  getSchemaPath,
  isArrayOfObjects,
  isArrayOfPrimitives,
} from '../utils';

describe('Adding Values', () => {
  it('adds a value to the root', () => {
    let root = {};

    setValue(root, 'value', ['foo']);

    expect(root, 'Adding a primitive value').toEqual({ foo: 'value' });

    root = {};
    setValue(root, { bar: 'baz' }, ['foo']);

    expect(root, 'Adding an object value').toEqual({ foo: { bar: 'baz' } });
  });

  it('adds a value some levels deep', () => {
    let root = {};

    setValue(root, 'buzz', ['foo', 'bar', 'baz']);

    expect(root, 'Adding a primitive value').toEqual({
      foo: {
        bar: {
          baz: 'buzz',
        },
      },
    });

    setValue(root, 'buzz', ['foo', 'bar', 'fizz']);

    expect(root, 'Adding an object value').toEqual({
      foo: {
        bar: {
          baz: 'buzz',
          fizz: 'buzz',
        },
      },
    });
  });

  it('adds an element to an array in the first position', () => {
    const root = {};

    setValue(root, 'value', ['foo', '$0']);

    expect(root).toEqual({
      foo: ['value'],
    });
  });

  it('adds an element to an array in a specific position', () => {
    const root = {
      array: [1, 2, 3]
    };

    setValue(root, 'changed', ['array', '$1']);

    expect(root).toEqual({
      array: [1, 'changed', 3],
    });
  });

  it('adds an element to an empty array in a specific position', () => {
    const root: { array?: string[] } = {};

    setValue(root, 'value', ['array', '$3']);

    expect(root.array).toBeInstanceOf(Array);
    expect(root.array![3]).toBe('value');
  });

  it('creates a complex object structure', () => {
    const root = {
      name: 'John Doe',
    };

    setValue(root, { name: 'admin', level: 1 }, ['settings', 'roles', '$0']);

    expect(root).toEqual({
      name: 'John Doe',
      settings: {
        roles: [
          { name: 'admin', level: 1 },
        ],
      },
    });
  });

  it('updates a specific value', () => {
    const root = {
      name: 'John Doe',
      settings: {
        profile: {
          displayPhone: true,
        },
      },
    };

    setValue(root, false, ['settings', 'profile', 'displayPhone']);

    expect(root).toEqual({
      name: 'John Doe',
      settings: {
        profile: {
          displayPhone: false,
        },
      },
    });
  });

  it('updates a specific item within an array', () => {
    const root = {
      name: 'John Doe',
      settings: {
        profile: { displayPhone: false },
        permissions: {
          roles: [
            { name: 'admin', level: 0 },
            { name: 'editr', level: 0 },
          ]
        }
      },
    };

    setValue(root, { name: 'editor', level: 1 }, ['settings', 'permissions', 'roles', '$1']);

    expect(root).toEqual({
      name: 'John Doe',
      settings: {
        profile: { displayPhone: false },
        permissions: {
          roles: [
            { name: 'admin', level: 0 },
            { name: 'editor', level: 1 },
          ],
        },
      },
    });
  });

  it('updates a specific item deeply nested within arrays', () => {
    const root = {
      deepArray: [
        [               // $0
          'level1',     // $0
          [             // $1
            'level2',   // $0
            [           // $1
              'level3', // $0
              [         // $1
                'value' // $0
              ],
            ],
          ],
        ],
      ],
    };

    setValue(root, 'changed', ['deepArray', '$0', '$1', '$1', '$1', '$0']);

    expect(root).toEqual({
      deepArray: [
        [                 // $0
          'level1',       // $0
          [               // $1
            'level2',     // $0
            [             // $1
              'level3',   // $0
              [           // $1
                'changed' // $0
              ],
            ],
          ],
        ],
      ],
    });
  });

  it('adds a value deep into objects and arrays', () => {
    const root: {
      settings: {
        sections: Array<{
          name?: string;
          permissions: Array<{ name: string; level: number }>
        }>
      }
    } = {
      settings: {
        sections: [
          {
            permissions: [
              { name: 'admin', level: 0 },
              { name: 'edir', level: 0 },
            ],
          },
        ],
      },
    };

    setValue(root, 'Section One', ['settings', 'sections', '$0', 'name']);

    expect(root.settings.sections[0].name).toBe('Section One');

    setValue(root, { name: 'editor', level: 1 }, ['settings', 'sections', '$0', 'permissions', '$1']);

    expect(root.settings.sections[0].permissions[1].name).toBe('editor');
    expect(root.settings.sections[0].permissions[1].level).toBe(1);
  });
});

describe('Reading Values', () => {
  it('get root object if no path specified', () => {
    const root = {
      name: 'John Doe',
    };

    const value = getValue(root, []);

    expect(value).toEqual({ name: 'John Doe' });
  });

  it('get value from specific path', () => {
    const root = {
      settings: {
        profile: {
          displayPhone: true,
        },
      },
    };

    const value = getValue(root, ['settings', 'profile', 'displayPhone']);

    expect(value).toBe(true);
  });

  it('get undefined if path does not exists', () => {
    const root = {
      settings: {}
    };

    const value = getValue(root, ['settings', 'profile', 'displayPhone']);

    expect(value).toBeUndefined();
  });

  it('get a value from an array', () => {
    const root = {
      roles: [ 'admin', 'editor' ],
    };

    let value = getValue(root, ['roles', '$1']);

    expect(value).toBe('editor');

    const root2 = {
      roles: [
        { name: 'admin' },
        { name: 'editor' },
      ],
    };

    value = getValue(root2, ['roles', '$1', 'name']);

    expect(value).toBe('editor');
  });

  it('get a value from a deep array', () => {
    const root = {
      array: [
        [                      // $0
          'dummy',             // $0
          [                    // $1
            'dummy',           // $0
            'dummy',           // $1
            [                  // $2
              { foo: 'bar' },  // $0
            ],
          ],
        ],
      ],
    };

    const value = getValue(root, ['array', '$0', '$1', '$2', '$0', 'foo']);

    expect(value).toBe('bar');
  });

  it('get default value', () => {
    const root = {
      settings: {}
    };

    const value = getValue(root, ['settings', '$5', 'undefinedProperty'], 'default-value');

    expect(value).toBe('default-value');
  });
});

describe('Path Manipulation', () => {
  it('generates schema path based on given path', () => {
    expect(getSchemaPath(['one', 'two']))
      .toEqual(['one', 'schema', 'two', 'schema']);

    expect(getSchemaPath(['one', '$0', 'two', '$2']))
      .toEqual(['one', 'schema', 'two', 'schema']);
  });
});

describe('Misc Utils', () => {
  it('returns true if the given property describes an array of primitives', () => {
    const property: Property = {
      type: 'array',
    };

    expect(isArrayOfPrimitives(property));
  });

  it('returns true if the given property describes an array of objects', () => {
    const property: Property = {
      type: 'array',
      schema: {}
    };

    expect(isArrayOfObjects(property));
  });
});
