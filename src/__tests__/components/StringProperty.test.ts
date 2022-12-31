import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';

import StringProperty from '../../components/StringProperty.vue'

const baseProps = {
  name: 'test',
  value: '',
};

describe('StringProperty Component', () => {
  it('displays the given value in the input field', () => {
    const component = render(StringProperty, {
      props: {
        ...baseProps,
        value: 'some value',
      }
    });
    const input = component.getByTestId('input');

    expect((input as HTMLInputElement).value).toBe('some value');
  });

  it('emits onUpdate when input value changes', async () => {
    const user = userEvent.setup();
    const component = render(StringProperty, { props: { ...baseProps } });
    const input = component.getByTestId('input');
    const newValue = 'some value';

    await user.type(input, newValue);

    expect(component.emitted('onUpdate')).toBeTruthy();
    expect(component.emitted('onUpdate').length).toBe(newValue.length);
  });
});
