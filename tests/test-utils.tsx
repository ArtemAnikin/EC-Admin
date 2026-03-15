/* eslint-disable react-refresh/only-export-components -- test utils: wrapper component + renderWithProviders */
import type { ReactElement, ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { AppMantineProvider } from '../src/app/providers/MantineProvider';
import { AppQueryProvider } from '../src/app/providers/QueryProvider';

function AllProviders({ children }: { children: ReactNode }) {
  return (
    <AppMantineProvider>
      <AppQueryProvider>{children}</AppQueryProvider>
    </AppMantineProvider>
  );
}

/**
 * Custom render that wraps UI with app providers (Mantine, React Query).
 * Use for screen/component tests that need theme or query client.
 */
function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, {
    wrapper: AllProviders,
    ...options,
  });
}

export { renderWithProviders };
