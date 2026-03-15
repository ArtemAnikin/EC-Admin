import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/config';
import { AuthProvider } from '../../contexts/AuthContext';
import { AppMantineProvider } from './MantineProvider';
import { AppQueryProvider } from './QueryProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <I18nextProvider i18n={i18n}>
      <AppMantineProvider>
        <AppQueryProvider>
          <BrowserRouter>
            <AuthProvider>{children}</AuthProvider>
          </BrowserRouter>
        </AppQueryProvider>
      </AppMantineProvider>
    </I18nextProvider>
  );
}
