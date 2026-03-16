# Tests

Vitest + React Testing Library. We focus on **page/screen flows (happy path)** rather than isolated component tests.

## Run tests

| Command | Description |
|--------|-------------|
| `yarn test` | Run all tests once |
| `yarn test:watch` | Watch mode; re-runs on file changes |
| `yarn test path/to/file.test.tsx` | Run a single test file |
| `yarn precommit` | Lint + test (run before commit) |
| `yarn commit` | Stage all, run lint + test, then `git commit` |

## Run tests before every commit

Use the commit script so lint and tests run automatically:

```bash
yarn commit
# then enter your commit message when prompted
```

Or run the precommit check manually before `git commit`:

```bash
yarn precommit
git add -A && git commit -m "your message"
```

## Writing tests

- **Page flows**: Put tests in `tests/screens/<ScreenName>.test.tsx`. Use `renderWithProviders` so Mantine, router, i18n, and auth are available (no MantineProvider issues).
- **Template**: Copy `tests/_templates/screen-flow.test.template.tsx` to a new file and replace placeholders.
- **Pattern**: Render screen → simulate user actions (click, type) → assert outcome (visible content or navigation).

## Example: happy-path flow

```tsx
import { expect, test } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import { LoginScreen } from '../../src/screens/Login';

test('happy path: login and see success', async () => {
  const user = userEvent.setup();
  renderWithProviders(<LoginScreen />, {
    routerProps: { initialEntries: ['/login'] },
  });

  await user.click(screen.getByRole('button', { name: /continue with google/i }));
  await waitFor(() => {
    expect(screen.getByText(/signing you in/i)).toBeInTheDocument();
  });
});
```

## Test utils

- **`renderWithProviders(ui, options?)`** – Renders with I18n, Mantine, React Query, Router, and Auth. Use for all screen/flow tests. Optional `routerProps: { initialEntries: ['/path'] }`.
