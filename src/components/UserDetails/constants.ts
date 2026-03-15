import { IconLogout, IconSettings } from '@tabler/icons-react';
import { ROUTES } from '@/routes';
import type { UserDetailsMenuItem } from '@/components/UserDetails/types';

/** Translation key for the logout menu item (used for comparison in handlers and in MENU_ITEMS). */
export const LOGOUT_MENU_KEY = 'userDetails.logout';

export const MENU_ITEMS: UserDetailsMenuItem[] = [
  { icon: IconSettings, title: 'userDetails.settings', route: ROUTES.SETTINGS },
  { icon: IconLogout, title: LOGOUT_MENU_KEY },
];
