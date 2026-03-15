import type { ComponentType } from 'react';
import { IconLogin, IconLayoutDashboard } from '@tabler/icons-react';
import { ROUTES } from '../routes';
import { LoginScreen } from '../screens/Login';
import { DashboardScreen } from '../screens/Dashboard';

export type RouteConfigItem = {
  title: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  component: ComponentType;
};

export const ROUTE_CONFIG: Record<ROUTES, RouteConfigItem> = {
  [ROUTES.LOGIN]: {
    title: 'Login',
    icon: IconLogin,
    component: LoginScreen,
  },
  [ROUTES.DASHBOARD]: {
    title: 'Dashboard',
    icon: IconLayoutDashboard,
    component: DashboardScreen,
  },
};
