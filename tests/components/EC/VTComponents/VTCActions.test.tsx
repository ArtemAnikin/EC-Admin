import type { ReactElement } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { VTCActions } from '../../../../src/components/EC/VTComponents';
import { theme } from '../../../../src/styles/theme';

function renderWithProvider(ui: ReactElement) {
  return render(
    <MantineProvider theme={theme}>{ui}</MantineProvider>,
  );
}

describe('VTCActions', () => {
  test('renders trigger button with aria-label', () => {
    renderWithProvider(
      <VTCActions
        items={[]}
        aria-label="Row actions"
      />,
    );

    expect(screen.getByTestId('vtc-actions-trigger')).toBeInTheDocument();
    expect(screen.getByTestId('vtc-actions-trigger')).toHaveAttribute('aria-label', 'Row actions');
  });

  test('opens dropdown when trigger is clicked and shows action items', async () => {
    const user = userEvent.setup();
    const items = [
      { id: 'edit', label: 'Edit', onClick: vi.fn() },
      { id: 'delete', label: 'Delete', onClick: vi.fn() },
    ];

    renderWithProvider(<VTCActions items={items} aria-label="Actions" />);

    const trigger = screen.getByTestId('vtc-actions-trigger');
    await user.click(trigger);

    const editItem = await screen.findByTestId('vtc-actions-item-edit');
    const deleteItem = await screen.findByTestId('vtc-actions-item-delete');
    expect(editItem).toBeInTheDocument();
    expect(deleteItem).toBeInTheDocument();
  });

  test('calls action onClick when menu item is clicked', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const items = [
      { id: 'edit', label: 'Edit', onClick: onEdit },
    ];

    renderWithProvider(<VTCActions items={items} aria-label="Actions" />);

    await user.click(screen.getByTestId('vtc-actions-trigger'));
    const editItem = await screen.findByTestId('vtc-actions-item-edit');
    await user.click(editItem);

    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  test('renders disabled action item as disabled', async () => {
    const user = userEvent.setup();
    const items = [
      { id: 'disabled', label: 'Disabled action', onClick: vi.fn(), disabled: true },
    ];

    renderWithProvider(<VTCActions items={items} aria-label="Actions" />);

    await user.click(screen.getByTestId('vtc-actions-trigger'));

    const menuItem = await screen.findByTestId('vtc-actions-item-disabled');
    expect(menuItem).toBeDisabled();
  });
});
