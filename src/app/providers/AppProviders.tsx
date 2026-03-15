import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppMantineProvider } from './MantineProvider';
import { AppQueryProvider } from './QueryProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AppMantineProvider>
      <AppQueryProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </AppQueryProvider>
    </AppMantineProvider>
  );
}
