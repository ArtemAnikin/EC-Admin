import { expect, test } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import { SettingsScreen } from '../../src/screens/Settings';

test('SettingsScreen renders title and description', () => {
  renderWithProviders(<SettingsScreen />);
  expect(screen.getByTestId('settings-heading')).toBeInTheDocument();
  expect(screen.getByTestId('settings-description')).toBeInTheDocument();
});
