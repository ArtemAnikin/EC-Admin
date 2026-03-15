import { expect, test } from 'vitest';
import { renderWithProviders } from '../test-utils';
import { SettingsScreen } from '../../src/screens/Settings';

test('SettingsScreen renders title and description', () => {
  const { getByRole, getByText } = renderWithProviders(<SettingsScreen />);
  expect(getByRole('heading', { name: /settings/i })).toBeInTheDocument();
  expect(getByText(/manage your account/i)).toBeInTheDocument();
});
