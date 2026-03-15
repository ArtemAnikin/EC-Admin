import type { CSSProperties } from 'react';
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

/** Avatar radius. */
export const AVATAR_RADIUS = 'xl' as const;

/** Avatar color when no image. */
export const AVATAR_COLOR = 'blue';

/** Gap between avatar and text in the header group. */
export const GROUP_GAP = 'sm' as const;

/** Inline style for the name/text container. */
export const USER_NAME_STYLE: CSSProperties = { flex: 1, minWidth: 0 };

/** Inline style for the menu trigger button. */
export const MENU_TRIGGER_STYLE: CSSProperties = { display: 'block' };

/** Mantine Text size for user name. */
export const USER_NAME_TEXT_SIZE = 'sm' as const;

/** Mantine Text size for user role subtitle. */
export const USER_SUBTITLE_TEXT_SIZE = 'xs' as const;

/** Mantine Text fw for user name. */
export const USER_NAME_FW = 600;

export const MENU_ITEMS: UserDetailsMenuItem[] = [
  { icon: IconSettings, title: 'userDetails.settings', route: ROUTES.SETTINGS },
  { icon: IconLogout, title: LOGOUT_MENU_KEY },
];
