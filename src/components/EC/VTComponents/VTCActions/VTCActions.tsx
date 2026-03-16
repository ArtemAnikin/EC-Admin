import type { FC } from 'react';
import { memo, useCallback } from 'react';
import { ActionIcon, Menu } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';
import type { ActionItem } from '../types';

export interface IVTCActionsProps {
  items: ActionItem[];
  'aria-label'?: string;
}

const VTCActionsComponent: FC<IVTCActionsProps> = ({
  items,
  'aria-label': ariaLabel = 'Open actions menu',
}) => {
  const handleItemClick = useCallback((item: ActionItem) => {
    if (item.disabled) return;
    item.onClick();
  }, []);

  return (
    <Menu position="bottom-end" width={180} shadow="sm">
      <Menu.Target>
        <ActionIcon
          variant="subtle"
          size="sm"
          aria-label={ariaLabel}
          data-testid="vtc-actions-trigger"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <IconDotsVertical size={16} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        {items.map((item) => (
          <Menu.Item
            key={item.id}
            data-testid={`vtc-actions-item-${item.id}`}
            onClick={() => handleItemClick(item)}
            disabled={item.disabled}
          >
            {item.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export const VTCActions = memo(VTCActionsComponent);
