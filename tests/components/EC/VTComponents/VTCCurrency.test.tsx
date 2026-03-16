import type { ReactElement } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { VTCCurrency } from '../../../../src/components/EC/VTComponents';
import { theme } from '../../../../src/styles/theme';

function renderWithProvider(ui: ReactElement) {
  return render(<MantineProvider theme={theme}>{ui}</MantineProvider>);
}

describe('VTCCurrency', () => {
  test('renders with value and currency when not focused', () => {
    renderWithProvider(
      <VTCCurrency
        currency="$"
        value="15"
        setValue={() => {}}
        aria-label="Price"
      />,
    );

    expect(screen.getByTestId('vtc-currency')).toBeInTheDocument();
    const input = screen.getByTestId('vtc-currency-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('15');
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  test('hides currency when input is focused', async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <VTCCurrency
        currency="$"
        value="15"
        setValue={() => {}}
        aria-label="Price"
      />,
    );

    const input = screen.getByTestId('vtc-currency-input');
    await user.click(input);

    expect(input).toHaveFocus();
    expect(screen.queryByText('$')).not.toBeInTheDocument();
  });

  test('shows currency again when input loses focus', async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <VTCCurrency
        currency="$"
        value="15"
        setValue={() => {}}
        aria-label="Price"
      />,
    );

    const input = screen.getByTestId('vtc-currency-input');
    await user.click(input);
    expect(screen.queryByText('$')).not.toBeInTheDocument();

    await user.tab();
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  test('calls setValue when user types', async () => {
    const user = userEvent.setup();
    const setValue = vi.fn();
    renderWithProvider(
      <VTCCurrency
        currency="$"
        value=""
        setValue={setValue}
        aria-label="Price"
      />,
    );

    const input = screen.getByTestId('vtc-currency-input');
    await user.type(input, '42');

    // Controlled input with mock setValue: parent does not update value, so each keystroke reports only the current input value ("4" then "2")
    expect(setValue).toHaveBeenCalledWith('4');
    expect(setValue).toHaveBeenCalledWith('2');
    expect(setValue).toHaveBeenCalledTimes(2);
  });

  test('respects disabled prop', () => {
    renderWithProvider(
      <VTCCurrency
        currency="$"
        value="15"
        setValue={() => {}}
        disabled
        aria-label="Price"
      />,
    );

    expect(screen.getByTestId('vtc-currency-input')).toBeDisabled();
  });
});
