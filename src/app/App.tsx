import { AppProviders } from './providers/AppProviders';
import { AppContent } from './AppContent';

export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}
