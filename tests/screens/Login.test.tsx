import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../src/i18n/config';
import { AuthProvider } from '../../src/contexts/AuthContext';
import { AppMantineProvider } from '../../src/app/providers/MantineProvider';
import { AppQueryProvider } from '../../src/app/providers/QueryProvider';
import { LoginScreen } from '../../src/screens/Login';
import { DashboardScreen } from '../../src/screens/Dashboard';
import { ROUTES } from '../../src/routes';
import { renderWithProviders } from '../test-utils';

function renderLoginWithRoutes() {
  return render(
    <I18nextProvider i18n={i18n}>
      <AppMantineProvider>
        <AppQueryProvider>
          <MemoryRouter initialEntries={[ROUTES.LOGIN]}>
            <AuthProvider>
              <Routes>
                <Route path={ROUTES.LOGIN} element={<LoginScreen />} />
                <Route path={ROUTES.DASHBOARD} element={<DashboardScreen />} />
              </Routes>
            </AuthProvider>
          </MemoryRouter>
        </AppQueryProvider>
      </AppMantineProvider>
    </I18nextProvider>,
  );
}

describe('LoginScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  test('renders "Continue with Google" button', () => {
    renderWithProviders(<LoginScreen />, {
      routerProps: { initialEntries: ['/login'] },
    });

    expect(screen.getByTestId('login-google-button')).toBeInTheDocument();
  });

  test('clicking the button shows loading state', async () => {
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    renderWithProviders(<LoginScreen />, {
      routerProps: { initialEntries: ['/login'] },
    });

    const button = screen.getByTestId('login-google-button');
    await user.click(button);

    expect(screen.getByTestId('login-loading-message')).toBeInTheDocument();
  });

  test('shows success message after loading timeout', async () => {
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    renderWithProviders(<LoginScreen />, {
      routerProps: { initialEntries: ['/login'] },
    });

    const button = screen.getByTestId('login-google-button');
    await user.click(button);

    await act(() => {
      vi.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('login-success-message'),
      ).toBeInTheDocument();
    });
  });

  test('redirects to dashboard after success', async () => {
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    renderLoginWithRoutes();

    const button = screen.getByTestId('login-google-button');
    await user.click(button);

    await act(() => {
      vi.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('login-success-message'),
      ).toBeInTheDocument();
    });

    await act(() => {
      vi.advanceTimersByTime(1500);
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('dashboard-heading'),
      ).toBeInTheDocument();
    });
  });
});
