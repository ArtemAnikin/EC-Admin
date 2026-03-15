import { useLocation, Navigate } from 'react-router-dom';
import { ROUTES } from '@/routes';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from './Layout';
import { AppRoutes } from './AppRoutes';

export function AppContent() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated && location.pathname !== ROUTES.LOGIN) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  if (isAuthenticated && location.pathname === ROUTES.LOGIN) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <Layout withHeader={isAuthenticated}>
      <AppRoutes />
    </Layout>
  );
}
