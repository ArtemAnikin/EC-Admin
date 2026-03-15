import { expect, test } from 'vitest';
import { renderWithProviders } from '../test-utils';
import { DashboardScreen } from '../../src/screens/Dashboard';

test('DashboardScreen renders title and welcome text', () => {
  const { getByRole, getByText } = renderWithProviders(<DashboardScreen />);
  expect(getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  expect(
    getByText(/welcome to the easy cars admin panel/i),
  ).toBeInTheDocument();
});
