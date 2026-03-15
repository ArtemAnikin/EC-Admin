import type { ComponentType } from 'react';

export interface UserDetailsMenuItem {
  icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  route?: string;
}
