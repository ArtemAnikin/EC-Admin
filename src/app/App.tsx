import { BrowserRouter, useLocation } from 'react-router-dom';
import { AppMantineProvider } from './providers/MantineProvider';
import { AppQueryProvider } from './providers/QueryProvider';
import { AppNav } from './AppNav';
import { AppRoutes } from './AppRoutes';
import { ROUTES } from '../routes';

function AppContent() {
  const location = useLocation();
  const showNav = location.pathname !== ROUTES.LOGIN;

  return (
    <>
      {showNav && <AppNav />}
      <AppRoutes />
    </>
  );
}

export default function App() {
  return (
    <AppMantineProvider>
      <AppQueryProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AppQueryProvider>
    </AppMantineProvider>
  );
}
