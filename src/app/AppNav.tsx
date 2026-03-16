import { Link, useLocation } from 'react-router-dom';
import { Group, UnstyledButton } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../routes';
import { ROUTE_CONFIG } from './routeConfig';

const NAV_ROUTES: ROUTES[] = [ROUTES.DASHBOARD, ROUTES.DELIVERY];

export function AppNav() {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <Group gap="xs">
      {NAV_ROUTES.map((path) => {
        const { titleKey, icon: Icon } = ROUTE_CONFIG[path];
        const isActive = location.pathname === path;
        return (
          <UnstyledButton
            key={path}
            component={Link}
            to={path}
            variant="subtle"
            style={{
              fontWeight: isActive ? 600 : 400,
              opacity: isActive ? 1 : 0.8,
            }}
          >
            <Group gap="xs">
              <Icon size={18} />
              {t(titleKey)}
            </Group>
          </UnstyledButton>
        );
      })}
    </Group>
  );
}
