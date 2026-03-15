import { render } from '@testing-library/react';
import { expect, test } from 'vitest';
import App from '../src/app/App';

test('renders Dashboard page', () => {
  const { getByText } = render(<App />);
  expect(getByText('Dashboard')).toBeInTheDocument();
});
