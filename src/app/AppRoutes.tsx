import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../routes';
import { ROUTE_CONFIG } from './routeConfig';

export function AppRoutes() {
  return (
    <Routes>
      {(Object.entries(ROUTE_CONFIG) as [ROUTES, (typeof ROUTE_CONFIG)[ROUTES]][]).map(
        ([path, { component: Component }]) => (
          <Route key={path} path={path} element={<Component />} />
        )
      )}
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
}
