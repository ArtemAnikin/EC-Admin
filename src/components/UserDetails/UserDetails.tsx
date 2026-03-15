import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Avatar, Group, Menu, Text, UnstyledButton } from '@mantine/core';
import type { User } from '@/lib/types/user';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/routes';
import type { UserDetailsMenuItem } from '@/components/UserDetails/types';
import { LOGOUT_MENU_KEY, MENU_ITEMS } from '@/components/UserDetails/constants';

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
    <Menu position="bottom-end" width={220} shadow="md">
      <Menu.Target>
        <UnstyledButton
          style={{ display: 'block' }}
          aria-label={t('userDetails.openMenu')}
        >
          <Group gap="sm">
            <Avatar
              src={user.avatarUrl}
              radius="xl"
              color="blue"
              size="md"
            >
              {getInitials(user.name, user.surname)}
            </Avatar>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Text size="sm" fw={600} lineClamp={1}>
                {user.name} {user.surname}
              </Text>
              <Text size="xs" c="dimmed" lineClamp={1}>
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
              leftSection={<Icon size={16} />}
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
