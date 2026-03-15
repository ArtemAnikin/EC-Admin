import { AppMantineProvider } from './providers/MantineProvider';
import { AppQueryProvider } from './providers/QueryProvider';
import { DashboardScreen } from '../screens/Dashboard';

export default function App() {
  return (
    <AppMantineProvider>
      <AppQueryProvider>
        <DashboardScreen />
      </AppQueryProvider>
    </AppMantineProvider>
  );
}
