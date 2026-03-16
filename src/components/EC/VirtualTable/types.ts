import type { ReactNode } from 'react';

export interface VirtualTableColumn<TData extends object> {
  /** Column key matching a field of TData; used as column id and for header labels. */
  accessorKey: keyof TData & string;
  accessorFn?: (row: TData) => unknown;
  isSortable?: boolean;
  /** When true, this column cannot be hidden; visibility and order hooks enforce it. */
  alwaysVisible?: boolean;
  cell?: (options: { row: TData; value: unknown }) => ReactNode;
}

export type VirtualTableSortingState = Array<{
  id: string;
  desc: boolean;
}>;

export type VirtualTableColumnVisibilityState = Record<string, boolean>;

export interface VirtualTableProps<TData extends object> {
  data: TData[];
  columns: Array<VirtualTableColumn<TData>>;
  /** Header labels keyed by column accessorKey. Provided by consumer (e.g. from BE/i18n). No labels are hardcoded in the table. */
  columnLabels: Record<string, string>;

  sortState?: VirtualTableSortingState;
  onSortChange?: (state: VirtualTableSortingState) => void;

  columnVisibility?: VirtualTableColumnVisibilityState;
  onColumnVisibilityChange?: (
    visibility: VirtualTableColumnVisibilityState,
  ) => void;

  columnOrder?: string[];
  onColumnOrderChange?: (order: string[]) => void;

  getRowId?: (row: TData, index: number) => string;
  onRowClick?: (row: TData) => void;

  /** Max height for the table container (enables row virtualization). Default 400. */
  tableHeight?: number;

  /** Enable row virtualization. Set to false in tests or for small lists. Default true. */
  enableRowVirtualization?: boolean;

  isLoading?: boolean;
  emptyState?: ReactNode;
}

