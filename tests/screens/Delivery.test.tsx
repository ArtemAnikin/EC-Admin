import { expect, test } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import { DeliveryScreen } from '../../src/screens/Delivery';

test('DeliveryScreen renders title and virtual table', () => {
  renderWithProviders(<DeliveryScreen />);
  expect(screen.getByTestId('delivery-heading')).toBeInTheDocument();
  expect(screen.getByTestId('virtual-table')).toBeInTheDocument();
});

test('DeliveryScreen renders delivery title from i18n', () => {
  renderWithProviders(<DeliveryScreen />);
  expect(screen.getByTestId('delivery-heading')).toHaveTextContent('Delivery');
});

test('DeliveryScreen renders edit button when not in edit mode', () => {
  renderWithProviders(<DeliveryScreen />);
  expect(screen.getByTestId('delivery-edit-mode')).toBeInTheDocument();
});
