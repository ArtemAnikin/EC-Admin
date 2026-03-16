import type { ComponentType } from 'react';
import {
  IconLogin,
  IconLayoutDashboard,
  IconSettings,
  IconTruck,
} from '@tabler/icons-react';
import { ROUTES } from '../routes';
import { LoginScreen } from '../screens/Login';
import { DashboardScreen } from '../screens/Dashboard';
import { SettingsScreen } from '../screens/Settings';
import { DeliveryScreen } from '../screens/Delivery';

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
  [ROUTES.SETTINGS]: {
    title: 'Settings',
    icon: IconSettings,
    component: SettingsScreen,
  },
  [ROUTES.DELIVERY]: {
    title: 'Delivery',
    icon: IconTruck,
    component: DeliveryScreen,
  },
};
