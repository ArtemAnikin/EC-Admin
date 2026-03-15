import { useLocation } from 'react-router-dom';
import { ROUTES } from '../routes';
import { Layout } from './Layout';
import { AppRoutes } from './AppRoutes';

export function AppContent() {
  const location = useLocation();
  const withHeader = location.pathname !== ROUTES.LOGIN;

  return (
    <Layout withHeader={withHeader}>
      <AppRoutes />
    </Layout>
  );
}
