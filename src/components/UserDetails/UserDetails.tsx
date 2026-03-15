import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Avatar, Group, Menu, Text, UnstyledButton } from '@mantine/core';
import type { User } from '@/lib/types/user';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/routes';
import type { UserDetailsMenuItem } from './types';
import {
  AVATAR_SIZE,
  AVATAR_COLOR,
  AVATAR_RADIUS,
  GROUP_GAP,
  LOGOUT_MENU_KEY,
  MENU_ICON_SIZE,
  MENU_ITEMS,
  MENU_TRIGGER_STYLE,
  MENU_WIDTH,
  OPEN_MENU_ARIA_LABEL_KEY,
  USER_NAME_FW,
  USER_NAME_STYLE,
  USER_NAME_TEXT_SIZE,
  USER_SUBTITLE_TEXT_SIZE,
} from './constants';

function getInitials(name: string, surname: string): string {
  const n = name?.trim().charAt(0) ?? '';
  const s = surname?.trim().charAt(0) ?? '';
  return `${n}${s}`.toUpperCase() || '?';
}

interface UserDetailsProps {
  user: User;
}

export const UserDetails: FC<UserDetailsProps> = ({ user }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleMenuAction = (item: UserDetailsMenuItem) => {
    if (item.route) {
      navigate(item.route);
    } else if (item.title === LOGOUT_MENU_KEY) {
      logout();
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <Menu position="bottom-end" width={MENU_WIDTH} shadow="md">
      <Menu.Target>
        <UnstyledButton
          style={MENU_TRIGGER_STYLE}
          aria-label={t(OPEN_MENU_ARIA_LABEL_KEY)}
        >
          <Group gap={GROUP_GAP}>
            <Avatar
              src={user.avatarUrl}
              radius={AVATAR_RADIUS}
              color={AVATAR_COLOR}
              size={AVATAR_SIZE}
            >
              {getInitials(user.name, user.surname)}
            </Avatar>
            <div style={USER_NAME_STYLE}>
              <Text size={USER_NAME_TEXT_SIZE} fw={USER_NAME_FW} lineClamp={1}>
                {user.name} {user.surname}
              </Text>
              <Text size={USER_SUBTITLE_TEXT_SIZE} c="dimmed" lineClamp={1}>
                {user.role}
              </Text>
            </div>
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Menu.Item
              key={item.title}
              leftSection={<Icon size={MENU_ICON_SIZE} />}
              onClick={() => handleMenuAction(item)}
            >
              {t(item.title)}
            </Menu.Item>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
};
