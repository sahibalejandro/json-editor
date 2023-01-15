import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';

import SchemaProperty from '../../components/SchemaProperty.vue';

describe('SchemaProperty Component', () => {
  it('displays the schema name inside the button', () => {
    const component = render(SchemaProperty, {
      props: {
        property: {
          schemaName: 'SchemaName',
        },
      },
    });

    const button = component.getByTestId('button');

    expect(button.textContent!.includes('SchemaName')).toBe(true);
  });

  it('emits pushToPath event when button is clicked', async () => {
    const user = userEvent.setup();
    const component = render(SchemaProperty, {
      props: {
        property: {
          schemaName: 'SchemaName',
        },
      },
    });
    const button = component.getByTestId('button');

    await user.click(button);

    const emittedPushToPathEvent = component.emitted('pushToPath');

    expect(emittedPushToPathEvent).toBeTruthy();
    expect(emittedPushToPathEvent.length).toBe(1);
  });
});
