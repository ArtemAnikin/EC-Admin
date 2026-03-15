import type { ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { theme } from '../../styles/theme';

interface AppMantineProviderProps {
  children: ReactNode;
}

export function AppMantineProvider({ children }: AppMantineProviderProps) {
  return <MantineProvider theme={theme}>{children}</MantineProvider>;
}
