import { render } from '@testing-library/react';
import { expect, test } from 'vitest';
import '../src/i18n';
import App from '../src/app/App';

test('App renders without crashing', () => {
  const { container } = render(<App />);
  expect(container).toBeTruthy();
});
