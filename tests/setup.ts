import '@testing-library/jest-dom/vitest';

// jsdom does not provide matchMedia; Mantine's MantineProvider requires it
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// jsdom does not provide ResizeObserver; mantine-react-table and virtualized tables use it
class ResizeObserverMock {
  observe = () => {};
  unobserve = () => {};
  disconnect = () => {};
}
window.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
