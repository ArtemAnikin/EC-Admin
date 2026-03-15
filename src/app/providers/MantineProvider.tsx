import type { ReactNode } from 'react';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';

const theme = createTheme({});

interface AppMantineProviderProps {
  children: ReactNode;
}

export function AppMantineProvider({ children }: AppMantineProviderProps) {
  return <MantineProvider theme={theme}>{children}</MantineProvider>;
}
