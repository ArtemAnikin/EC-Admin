import type { ReactNode } from 'react';
import { AppShell, Box } from '@mantine/core';
import { useAuth } from '@/contexts/AuthContext';
import { UserDetails } from '@/components/UserDetails';
import { AppNav } from './AppNav';

interface LayoutProps {
  children: ReactNode;
  withHeader?: boolean;
}

export function Layout({ children, withHeader = true }: LayoutProps) {
  const { user } = useAuth();

  return (
    <AppShell
      header={withHeader ? { height: 56 } : undefined}
      padding="md"
    >
      {withHeader && (
        <AppShell.Header px="md">
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '100%',
            }}
          >
            <AppNav />
            {user && (
              <Box style={{ marginLeft: 'auto' }}>
                <UserDetails user={user} />
              </Box>
            )}
          </Box>
        </AppShell.Header>
      )}
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
