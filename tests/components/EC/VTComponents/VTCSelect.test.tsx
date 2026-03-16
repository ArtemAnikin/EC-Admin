import type { ReactElement } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { VTCSelect } from '../../../../src/components/EC/VTComponents';
import { theme } from '../../../../src/styles/theme';

function renderWithProvider(ui: ReactElement) {
  return render(
    <MantineProvider theme={theme}>{ui}</MantineProvider>,
  );
}

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' },
];

describe('VTCSelect', () => {
  test('renders with value and required props', () => {
    renderWithProvider(
      <VTCSelect
        value="a"
        onChange={() => {}}
        data={options}
        aria-label="Choose option"
      />,
    );

    expect(screen.getByTestId('vtc-select')).toBeInTheDocument();
    expect(screen.getByText('Option A')).toBeInTheDocument();
  });

  test('renders with placeholder when value is null', () => {
    renderWithProvider(
      <VTCSelect
        value={null}
        onChange={() => {}}
        data={options}
        placeholder="Select..."
        aria-label="Choose"
      />,
    );

    expect(screen.getByTestId('vtc-select')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Select...')).toBeInTheDocument();
  });

  test('calls onChange when option is selected', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderWithProvider(
      <VTCSelect
        value={null}
        onChange={onChange}
        data={options}
        aria-label="Choose"
      />,
    );

    const combobox = screen.getByTestId('vtc-select');
    await user.click(combobox);

    const optionB = await screen.findByRole('option', { name: 'Option B', hidden: true });
    await user.click(optionB);

    expect(onChange).toHaveBeenCalledWith('b');
  });
});
