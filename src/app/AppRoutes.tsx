import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../routes';
import { ROUTE_CONFIG, type RouteConfigItem } from './routeConfig';

const routes = Object.entries(ROUTE_CONFIG) as [ROUTES, RouteConfigItem][];

export function AppRoutes() {
  return (
    <Routes>
      {routes.map(([path, { component: Component }]) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
}
