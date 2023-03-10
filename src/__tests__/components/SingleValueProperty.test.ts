import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';

import SingleValueProperty from '../../components/SingleValueProperty.vue'

const baseProps = {
  value: '',
  property: {
    type: 'string',
  }
};

describe('SingleValueProperty Component', () => {
  it('displays the given value in the input field', () => {
    const component = render(SingleValueProperty, {
      props: {
        ...baseProps,
        value: 'some value',
      }
    });
    const input = component.getByTestId('input');

    expect((input as HTMLInputElement).value).toBe('some value');
  });

  it('emits input event when input type "text" value changes', async () => {
    const user = userEvent.setup();
    const component = render(SingleValueProperty, { props: { ...baseProps } });
    const input = component.getByTestId('input');
    const newValue = 'some value';

    await user.type(input, newValue);
    const emittedInputEvent = component.emitted('input');

    expect(emittedInputEvent).toBeTruthy();
    expect(emittedInputEvent.length).toBe(newValue.length);
    expect(emittedInputEvent[emittedInputEvent.length - 1]).toEqual(['some value']);
  });

  it('emits input event when input type "number" value changes', async () => {
    const user = userEvent.setup();
    const component = render(SingleValueProperty, {
      props: {
        ...baseProps,
        property: { type: 'number' },
      },
    });
    const input = component.getByTestId('input');
    const newValue = 50;

    await user.type(input, newValue.toString());
    const emittedInputEvent = component.emitted('input');

    expect(emittedInputEvent).toBeTruthy();
    expect(emittedInputEvent.length).toBe(2);
    expect(emittedInputEvent[emittedInputEvent.length - 1]).toEqual([50]);
  });

  it('set input type to number', () => {
    const component = render(SingleValueProperty, {
      props: {
        ...baseProps,
        property: { type: 'number' },
      },
    });
    const input = component.getByTestId('input');

    expect((input as HTMLInputElement).type).toBe('number');
  });

  it('set input type to text', () => {
    const component = render(SingleValueProperty, {
      props: {
        ...baseProps,
        property: { type: 'string' },
      },
    });
    const input = component.getByTestId('input');

    expect((input as HTMLInputElement).type).toBe('text');
  });
});
