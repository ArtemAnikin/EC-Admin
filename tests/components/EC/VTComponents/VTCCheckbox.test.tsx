import type { ReactElement } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { VTCCheckbox } from '../../../../src/components/EC/VTComponents';
import { theme } from '../../../../src/styles/theme';

function renderWithProvider(ui: ReactElement) {
  return render(
    <MantineProvider theme={theme}>{ui}</MantineProvider>,
  );
}

describe('VTCCheckbox', () => {
  test('renders unchecked with required props', () => {
    renderWithProvider(
      <VTCCheckbox
        checked={false}
        onChange={() => {}}
        aria-label="Select row"
      />,
    );

    const checkbox = screen.getByTestId('vtc-checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  test('renders checked when checked is true', () => {
    renderWithProvider(
      <VTCCheckbox
        checked
        onChange={() => {}}
        aria-label="Select"
      />,
    );

    expect(screen.getByTestId('vtc-checkbox')).toBeChecked();
  });

  test('calls onChange with new checked value when toggled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderWithProvider(
      <VTCCheckbox
        checked={false}
        onChange={onChange}
        aria-label="Select"
      />,
    );

    const checkbox = screen.getByTestId('vtc-checkbox');
    await user.click(checkbox);

    expect(onChange).toHaveBeenCalledWith(true);
  });

  test('respects disabled prop', () => {
    renderWithProvider(
      <VTCCheckbox
        checked={false}
        onChange={() => {}}
        disabled
        aria-label="Select"
      />,
    );

    expect(screen.getByTestId('vtc-checkbox')).toBeDisabled();
  });
});
