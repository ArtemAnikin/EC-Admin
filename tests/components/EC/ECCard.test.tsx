import type { ReactElement } from 'react';
import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { ECCard } from '@/components/EC';
import { theme } from '@/styles/theme';

function renderWithProvider(ui: ReactElement) {
  return render(
    <MantineProvider theme={theme}>{ui}</MantineProvider>,
  );
}

describe('ECCard', () => {
  test('renders with required props (title and children)', () => {
    renderWithProvider(
      <ECCard title="Main Information">
        <p>Card body content</p>
      </ECCard>,
    );

    const card = screen.getByTestId('ec-card');
    expect(card).toBeInTheDocument();

    expect(screen.getByTestId('ec-card-header')).toHaveTextContent(
      'Main Information',
    );
    expect(screen.getByTestId('ec-card-content')).toHaveTextContent(
      'Card body content',
    );
    expect(screen.queryByTestId('ec-card-footer')).not.toBeInTheDocument();
  });

  test('renders footer when provided', () => {
    renderWithProvider(
      <ECCard title="Contacts" footer={<button type="button">Delete</button>}>
        <span>Contact details</span>
      </ECCard>,
    );

    const footer = screen.getByTestId('ec-card-footer');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveTextContent('Delete');
  });

  test('renders without footer when footer is not passed', () => {
    renderWithProvider(
      <ECCard title="Section">
        <div>Content only</div>
      </ECCard>,
    );

    expect(screen.getByTestId('ec-card')).toBeInTheDocument();
    expect(screen.queryByTestId('ec-card-footer')).not.toBeInTheDocument();
  });
});
