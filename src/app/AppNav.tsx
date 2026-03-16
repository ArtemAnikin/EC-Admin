import { Link, useLocation } from 'react-router-dom';
import { Group, UnstyledButton } from '@mantine/core';
import { ROUTES } from '../routes';
import { ROUTE_CONFIG } from './routeConfig';

const NAV_ROUTES: ROUTES[] = [ROUTES.DASHBOARD, ROUTES.DELIVERY];

export function AppNav() {
  const location = useLocation();

  return (
    <Group gap="xs">
      {NAV_ROUTES.map((path) => {
        const { title, icon: Icon } = ROUTE_CONFIG[path];
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
              {title}
            </Group>
          </UnstyledButton>
        );
      })}
    </Group>
  );
}
