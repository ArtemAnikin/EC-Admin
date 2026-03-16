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
  titleKey: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  component: ComponentType;
};

export const ROUTE_CONFIG: Record<ROUTES, RouteConfigItem> = {
  [ROUTES.LOGIN]: {
    titleKey: 'nav.login',
    icon: IconLogin,
    component: LoginScreen,
  },
  [ROUTES.DASHBOARD]: {
    titleKey: 'nav.dashboard',
    icon: IconLayoutDashboard,
    component: DashboardScreen,
  },
  [ROUTES.SETTINGS]: {
    titleKey: 'nav.settings',
    icon: IconSettings,
    component: SettingsScreen,
  },
  [ROUTES.DELIVERY]: {
    titleKey: 'nav.delivery',
    icon: IconTruck,
    component: DeliveryScreen,
  },
};
