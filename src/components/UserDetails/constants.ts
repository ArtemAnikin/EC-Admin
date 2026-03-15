import { IconLogout, IconSettings } from '@tabler/icons-react';
import { ROUTES } from '@/routes';
import type { UserDetailsMenuItem } from './types';

/** Translation key for the logout menu item (used for comparison in handlers). */
export const LOGOUT_MENU_KEY = 'userDetails.logout';

/** Translation key for the open menu button aria-label. */
export const OPEN_MENU_ARIA_LABEL_KEY = 'userDetails.openMenu';

/** Dropdown menu width in pixels. */
export const MENU_WIDTH = 220;

/** Size of icons in menu items. */
export const MENU_ICON_SIZE = 16;

/** Avatar size in the header. */
export const AVATAR_SIZE = 'md' as const;

export const MENU_ITEMS: UserDetailsMenuItem[] = [
  { icon: IconSettings, title: 'userDetails.settings', route: ROUTES.SETTINGS },
  { icon: IconLogout, title: LOGOUT_MENU_KEY },
];
