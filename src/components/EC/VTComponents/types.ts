import type { ReactNode } from 'react';

/**
 * Single action item for VTCActions dropdown menu.
 * Used for row actions (edit, delete, etc.) in table cells.
 */
export interface ActionItem {
  id: string;
  label: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

/**
 * Option shape for VTCSelect (Mantine-compatible).
 */
export interface VTCSelectOption {
  value: string;
  label: string;
}
