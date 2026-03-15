import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppMantineProvider } from './providers/MantineProvider';
import { AppQueryProvider } from './providers/QueryProvider';
import { DashboardScreen } from '../screens/Dashboard';
import { LoginScreen } from '../screens/Login';
import { ROUTES } from '../routes';

export default function App() {
  return (
    <AppMantineProvider>
      <AppQueryProvider>
        <BrowserRouter>
          <Routes>
            <Route path={ROUTES.LOGIN} element={<LoginScreen />} />
            <Route path={ROUTES.DASHBOARD} element={<DashboardScreen />} />
            <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
          </Routes>
        </BrowserRouter>
      </AppQueryProvider>
    </AppMantineProvider>
  );
}
