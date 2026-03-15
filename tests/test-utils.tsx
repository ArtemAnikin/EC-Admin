/* eslint-disable react-refresh/only-export-components -- test utils: wrapper component + renderWithProviders */
import type { ReactElement, ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { AuthProvider } from '../src/contexts/AuthContext';
import { AppMantineProvider } from '../src/app/providers/MantineProvider';
import { AppQueryProvider } from '../src/app/providers/QueryProvider';
import i18n from '../src/i18n/config';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  routerProps?: MemoryRouterProps;
}

function AllProviders({
  children,
  routerProps,
}: {
  children: ReactNode;
  routerProps?: MemoryRouterProps;
}) {
  return (
    <I18nextProvider i18n={i18n}>
      <AppMantineProvider>
        <AppQueryProvider>
          <MemoryRouter {...routerProps}>
            <AuthProvider>{children}</AuthProvider>
          </MemoryRouter>
        </AppQueryProvider>
      </AppMantineProvider>
    </I18nextProvider>
  );
}

/**
 * Custom render that wraps UI with app providers (Mantine, React Query, Router, i18n).
 * Pass `routerProps` to configure MemoryRouter (e.g. `initialEntries`).
 */
function renderWithProviders(
  ui: ReactElement,
  options?: ExtendedRenderOptions,
) {
  const { routerProps, ...renderOptions } = options ?? {};

  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders routerProps={routerProps}>{children}</AllProviders>
    ),
    ...renderOptions,
  });
}

export { renderWithProviders };
