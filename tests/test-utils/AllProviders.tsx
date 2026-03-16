import type { ReactNode } from 'react';
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppMantineProvider } from '@/app/providers/MantineProvider';
import { AppQueryProvider } from '@/app/providers/QueryProvider';
import i18n from '@/i18n/config';

interface AllProvidersProps {
  children: ReactNode;
  routerProps?: MemoryRouterProps;
}

export function AllProviders({ children, routerProps }: AllProvidersProps) {
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
