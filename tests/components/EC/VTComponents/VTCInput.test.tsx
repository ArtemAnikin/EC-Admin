import type { ReactElement } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { VTCInput } from '../../../../src/components/EC/VTComponents';
import { theme } from '../../../../src/styles/theme';

function renderWithProvider(ui: ReactElement) {
  return render(
    <MantineProvider theme={theme}>{ui}</MantineProvider>,
  );
}

describe('VTCInput', () => {
  test('renders with value and required props', () => {
    renderWithProvider(
      <VTCInput
        value="hello"
        onChange={() => {}}
        aria-label="Name"
      />,
    );

    const input = screen.getByTestId('vtc-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('hello');
  });

  test('renders with placeholder', () => {
    renderWithProvider(
      <VTCInput
        value=""
        onChange={() => {}}
        placeholder="Enter text"
        aria-label="Field"
      />,
    );

    expect(screen.getByTestId('vtc-input')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  test('calls onChange when user types', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderWithProvider(
      <VTCInput
        value=""
        onChange={onChange}
        aria-label="Field"
      />,
    );

    const input = screen.getByTestId('vtc-input');
    await user.type(input, 'x');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith('x');
  });

  test('respects disabled prop', () => {
    renderWithProvider(
      <VTCInput
        value=""
        onChange={() => {}}
        disabled
        aria-label="Field"
      />,
    );

    expect(screen.getByTestId('vtc-input')).toBeDisabled();
  });
});
