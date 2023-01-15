import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';

import ObjectArrayProperty from '../../components/ObjectArrayProperty.vue';

const baseProps = {
  array: [],
  property: {
    schemaName: 'TestSchema',
  }
};

describe('ObjectArrayProperty Component', () => {
  it('displays the array lenght', () => {
    const component = render(ObjectArrayProperty, {
      props: {
        ...baseProps,
        array: [{}, {}],
      },
    });

    const element = component.getByTestId('array-length');

    expect(element.textContent).toBe('2');
  });

  it('displays an edit button per item', () => {
    const component = render(ObjectArrayProperty, {
      props: {
        ...baseProps,
        array: [{}, {}],
        property: {
          schemaName: 'FooBarSchema'
        },
      },
    });

    const itemOneEditButton = component.getByTestId('item-0-edit-button');
    const itemTwoEditButton = component.getByTestId('item-1-edit-button');

    expect(itemOneEditButton.textContent!.includes('Edit FooBarSchema #1')).toBe(true);
    expect(itemTwoEditButton.textContent!.includes('Edit FooBarSchema #2')).toBe(true);
  });

  it('displays a delete button per item', () => {
    const component = render(ObjectArrayProperty, {
      props: {
        ...baseProps,
        array: [{}, {}],
      },
    });

    component.getByTestId('item-0-delete-button');
    component.getByTestId('item-1-delete-button');
  });

  it('displays a button to add a new object', () => {
    const component = render(ObjectArrayProperty, {
      props: {
        ...baseProps,
        property: {
          schemaName: 'FooBarSchema',
        }
      }
    });
    const addNewItemButton = component.getByTestId('add-new-item-button');

    expect(addNewItemButton.textContent!.includes('FooBarSchema')).toBe(true);
  });

  it('displays a button to delete all items when the array is not empty', async () => {
    const component = render(ObjectArrayProperty, {
      props: {
        ...baseProps,
      }
    });

    expect(component.queryByTestId('delete-all-button')).toBeNull();

    await component.rerender({ ...baseProps, array: [{}] });

    expect(component.getByTestId('delete-all-button')).toBeTruthy();
  });

  it('emits deleteAllItems when clicking on Delete All button', async () => {
    const user = userEvent.setup();
    const component = render(ObjectArrayProperty, {
      props: {
        ...baseProps,
        array: [{}, {}],
      }
    });

    const deleteAllButton = component.getByTestId('delete-all-button');
    await user.click(deleteAllButton);

    const emittedDeleteAllItemsEvent = component.emitted('deleteAllItems');

    expect(emittedDeleteAllItemsEvent).toBeTruthy();
    expect(emittedDeleteAllItemsEvent.length).toBe(1);
  });

  it('emits setItemSchema when user clicks on Add New Item button', async () => {
    const user = userEvent.setup();
    const component = render(ObjectArrayProperty, { props: { ...baseProps } });
    const addNewItemButton = component.getByTestId('add-new-item-button');

    await user.click(addNewItemButton);

    const emittedSetItemSchemaEvent = component.emitted('setItemSchema');

    expect(emittedSetItemSchemaEvent).toBeTruthy();
    expect(emittedSetItemSchemaEvent.length).toBe(1);
    expect(emittedSetItemSchemaEvent[0]).toEqual([-1]);
  });

  it('emits setItemSchema when user clicks on Edit Item button', async () => {
    const user = userEvent.setup();
    const component = render(ObjectArrayProperty, {
      props: {
        ...baseProps,
        array: [{ foo: 'bar 1' }, { foo: 'bar 2' }]
      }
    });
    const editItem1Button = component.getByTestId('item-1-edit-button');

    await user.click(editItem1Button);

    const emittedSetItemSchemaEvent = component.emitted('setItemSchema');

    expect(emittedSetItemSchemaEvent).toBeTruthy();
    expect(emittedSetItemSchemaEvent.length).toBe(1);
    expect(emittedSetItemSchemaEvent[0]).toEqual([1]);
  });

  it('emits deleteItem when user clicks on Delete button', async () => {
    const user = userEvent.setup();
    const component = render(ObjectArrayProperty, {
      props: {
        ...baseProps,
        array: [{}, {}],
      },
    });
    const item1DeleteButton = component.getByTestId('item-1-delete-button');

    await user.click(item1DeleteButton);

    const emittedDeleteItemEvent = component.emitted('deleteItem');

    expect(emittedDeleteItemEvent).toBeTruthy();
    expect(emittedDeleteItemEvent.length).toBe(1);
    expect(emittedDeleteItemEvent[0]).toEqual([1]);
  });
});
