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

  it.only('emits onInput when textarea value changes', async () => {
    const user = userEvent.setup();
    const component = render(TextProperty, {
      props: {
        value: '',
      }
    });
    const textarea = component.getByTestId('textarea');

    await user.type(textarea, 'foo bar');
    const onInput = component.emitted('onInput');

    expect(onInput).toBeTruthy();
    expect(onInput.length).toBe('foo bar'.length);
    expect(onInput[onInput.length -1]).toEqual(['foo bar']);
  });
});
