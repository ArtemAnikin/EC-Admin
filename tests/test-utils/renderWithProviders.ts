import { createElement, type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import type { MemoryRouterProps } from 'react-router-dom';
import { AllProviders } from './AllProviders';

export interface ExtendedRenderOptions
  extends Omit<RenderOptions, 'wrapper'> {
  routerProps?: MemoryRouterProps;
}

/**
 * Custom render that wraps UI with app providers (Mantine, React Query, Router, i18n).
 * Pass `routerProps` to configure MemoryRouter (e.g. `initialEntries`).
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: ExtendedRenderOptions,
) {
  const { routerProps, ...renderOptions } = options ?? {};

  return render(ui, {
    wrapper: ({ children }) =>
      createElement(AllProviders, { routerProps, children }),
    ...renderOptions,
  });
}
