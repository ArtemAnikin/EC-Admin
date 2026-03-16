import { expect, test } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import { DashboardScreen } from '../../src/screens/Dashboard';

test('DashboardScreen renders title and welcome text', () => {
  renderWithProviders(<DashboardScreen />);
  expect(screen.getByTestId('dashboard-heading')).toBeInTheDocument();
  expect(screen.getByTestId('dashboard-welcome')).toBeInTheDocument();
});
