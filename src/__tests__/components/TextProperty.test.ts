import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';

import TextProperty from '../../components/TextProperty.vue';

describe('TextProperty Component', () => {
  it('displays the given value in the textarea', () => {
    const component = render(TextProperty, {
      props: {
        value: 'foo bar',
      }
    });

    const textarea = component.getByTestId('textarea');

    expect((textarea as HTMLTextAreaElement).value).toBe('foo bar');
  });

  it('emits input event when textarea value changes', async () => {
    const user = userEvent.setup();
    const component = render(TextProperty, {
      props: {
        value: '',
      }
    });
    const textarea = component.getByTestId('textarea');

    await user.type(textarea, 'foo bar');
    const emittedInputEvent = component.emitted('input');

    expect(emittedInputEvent).toBeTruthy();
    expect(emittedInputEvent.length).toBe('foo bar'.length);
    expect(emittedInputEvent[emittedInputEvent.length -1]).toEqual(['foo bar']);
  });
});
