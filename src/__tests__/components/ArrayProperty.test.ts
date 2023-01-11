import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';

import ArrayProperty from '../../components/ArrayProperty.vue';

const baseProps = {
  array: [],
};

describe('ArrayProperty Component', () => {
  it('displays the array length', () => {
    const component = render(ArrayProperty, {
      props: {
        ...baseProps,
        array: ['foo', 'bar', 'baz'],
      }
    });
    const element = component.getByTestId('array-length');

    expect(element.textContent).toBe('3');
  });

  it('renders the input for new values', () => {
    const component = render(ArrayProperty, { props: { ...baseProps } });

    component.getByTestId('new-item-input');
  });

  it('renders one input per array item', async () => {
    const component = render(ArrayProperty, { props: { ...baseProps } });

    expect(component.getAllByRole('textbox').length).toBe(1);

    await component.rerender({
        ...baseProps,
        array: ['foo', 'bar'],
    });

    expect(component.getAllByRole('textbox').length).toBe(3);
    expect((component.getByTestId('item-0-input') as HTMLInputElement).value).toBe('foo');
    expect((component.getByTestId('item-1-input') as HTMLInputElement).value).toBe('bar');
  });

  it('emits onAddItem when Enter key is pressed and the New Item Input has value', async () => {
    const user = userEvent.setup();
    const component = render(ArrayProperty, { props: { ...baseProps } });
    const newItemInput = component.getByTestId('new-item-input');

    await user.type(newItemInput, 'some value');
    await user.keyboard('[Enter]');

    expect(component.emitted('onAddItem').length, 'Emit onAddItem').toBe(1);
    expect(component.emitted('onAddItem')[0], 'Emit correct value').toEqual(['some value']);
  });

  it('does not emit onAddItem when Enter key is pressed and the New Item Input is empty', async () => {
    const user = userEvent.setup();
    const component = render(ArrayProperty, { props: { ...baseProps } });
    const newItemInput = component.getByTestId('new-item-input');

    await user.click(newItemInput);
    await user.keyboard('[Enter]');

    expect(component.emitted('onAddItem')).toBeFalsy();
  });

  it('clears New Item Input after adding an item', async () => {
    const user = userEvent.setup();
    const component = render(ArrayProperty, { props: { ...baseProps } });
    const newItemInput = component.getByTestId('new-item-input') as HTMLInputElement;

    await user.type(newItemInput, 'some value');

    expect(newItemInput.value).toBe('some value');

    await user.keyboard('[Enter]');

    expect(newItemInput.value).toBe('');
  });

  it('emits onUpdateItem when the input of an item changes', async () => {
    const user = userEvent.setup();
    const component = render(ArrayProperty, {
      props: {
        ...baseProps,
        array: ['', '']
      },
    });
    const targetIndex = 1;
    const newValue = 'new value';
    const itemInput = component.getByTestId(`item-${targetIndex}-input`);

    await user.click(itemInput);
    await user.keyboard(newValue);

    expect(component.emitted('onUpdateItem')).toBeTruthy();
    // Number of events must match the number of typed letters
    expect(component.emitted('onUpdateItem').length).toBe(newValue.length);
    // Last event must have received the target index and the full new value
    expect(component.emitted('onUpdateItem').pop()).toEqual([targetIndex, newValue]);
  });

  it('emits onDeleteItem when user clicks on Delete button', async () => {
    const user = userEvent.setup();
    const indexOfItemToDelete = 1;
    const component = render(ArrayProperty, {
      props: {
        ...baseProps,
        array: ['item 1', 'item 2'],
      }
    });
    const deleteItemButton = component.getByTestId(`delete-item-${indexOfItemToDelete}-button`);

    await user.click(deleteItemButton);

    expect(component.emitted('onDeleteItem')).toBeTruthy();
    expect(component.emitted('onDeleteItem').length).toBe(1);
    expect(component.emitted('onDeleteItem')[0]).toEqual([indexOfItemToDelete]);
  });

  it('emits onDeleteAllItems when clicking on Delete All button', async () => {
    const user = userEvent.setup();
    const component = render(ArrayProperty, {
      props: {
        ...baseProps,
        array: ['item1', 'item2'],
      }
    });

    const deleteAllButton = component.getByTestId('delete-all-button');
    await user.click(deleteAllButton);

    expect(component.emitted('onDeleteAllItems')).toBeTruthy();
    expect(component.emitted('onDeleteAllItems').length).toBe(1);
  });
});
