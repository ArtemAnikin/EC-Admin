import { AppMantineProvider } from './providers/MantineProvider';
import { AppQueryProvider } from './providers/QueryProvider';
import { Dashboard } from './pages/Dashboard';

export default function App() {
  return (
    <AppMantineProvider>
      <AppQueryProvider>
        <Dashboard />
      </AppQueryProvider>
    </AppMantineProvider>
  );
}
