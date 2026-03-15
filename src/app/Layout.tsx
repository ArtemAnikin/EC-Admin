import type { ReactNode } from 'react';
import { AppShell, Box } from '@mantine/core';
import { AppNav } from './AppNav';

interface LayoutProps {
  children: ReactNode;
  withHeader?: boolean;
}

export function Layout({ children, withHeader = true }: LayoutProps) {
  return (
    <AppShell
      header={withHeader ? { height: 56 } : undefined}
      padding="md"
    >
      {withHeader && (
        <AppShell.Header px="md">
          <Box style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <AppNav />
          </Box>
        </AppShell.Header>
      )}
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
