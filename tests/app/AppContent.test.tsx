import { expect, test } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { AppContent } from '../../src/app/AppContent';
import { renderWithProviders } from '../test-utils';

test('unauthenticated user visiting root is redirected to login screen', async () => {
  renderWithProviders(<AppContent />, {
    routerProps: { initialEntries: ['/'] },
  });

  await waitFor(() => {
    expect(screen.getByTestId('login-google-button')).toBeInTheDocument();
  });
});
