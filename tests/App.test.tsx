import { render } from '@testing-library/react';
import { expect, test } from 'vitest';
import App from '../src/app/App';

test('App renders and shows Dashboard screen', () => {
  const { getByRole } = render(<App />);
  expect(getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
});
