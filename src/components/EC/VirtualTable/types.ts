import type { ReactNode, RefObject } from 'react';

/** Options for custom inline editor when column is editable and table is in edit mode. */
export interface VirtualTableEditCellOptions<TData extends object> {
  row: TData;
  value: unknown;
  field: keyof TData & string;
  onChange: (value: unknown) => void;
}

export interface VirtualTableColumn<TData extends object> {
  /** Column key matching a field of TData; used as column id and for header labels. */
  accessorKey: keyof TData & string;
  accessorFn?: (row: TData) => unknown;
  isSortable?: boolean;
  /** When true, this column cannot be hidden; visibility and order hooks enforce it. */
  alwaysVisible?: boolean;
  /**
   * Optional cell renderer. For consistent, table-optimized UI use VTCSelect, VTCInput,
   * VTCCheckbox, and VTCActions from `@/components/EC` (VTComponents).
   */
  cell?: (options: { row: TData; value: unknown }) => ReactNode;
  /**
   * When true, this column is editable when the table is in global edit mode or this row is in row edit mode.
   * Used only when the table has editMode or editingRowId set.
   */
  editable?: boolean;
  /**
   * Optional custom inline editor. When absent, a default text input is used for editable cells.
   */
  renderEditCell?: (
    options: VirtualTableEditCellOptions<TData>,
  ) => ReactNode;
}

/** Config for the built-in row actions column (Edit / Save / Cancel). */
export interface VirtualTableRowActionsColumnConfig {
  editLabel?: string;
  saveLabel?: string;
  cancelLabel?: string;
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

  /** Required when using editMode, editingRowId, or rowActionsColumn. */
  getRowId?: (row: TData, index: number) => string;
  onRowClick?: (row: TData) => void;

  /** Max height for the table container (enables row virtualization). Default 400. */
  tableHeight?: number;

  /** Enable row virtualization. Set to false in tests or for small lists. Default true. */
  enableRowVirtualization?: boolean;

  isLoading?: boolean;
  emptyState?: ReactNode;

  // --- Editing ---
  /** When true, table is in global edit mode: all editable columns render as inputs. */
  editMode?: 'global' | null;
  /** When set, only this row (by getRowId) is in row edit mode; at most one row at a time. */
  editingRowId?: string | null;
  /** Called when saving edits for a row (row edit mode: user clicks Save; global mode: parent calls ref.saveAll()). */
  onSaveEdit?: (rowId: string, data: Partial<TData>) => void;
  /** Called when canceling edits; parent should clear editingRowId and/or editMode. */
  onCancelEdit?: () => void;
  /** Called when user starts row edit (e.g. clicks Edit in actions column); parent should set editingRowId. */
  onStartRowEdit?: (rowId: string) => void;
  /** When provided, an actions column is rendered with Edit / Save / Cancel. Requires getRowId. */
  rowActionsColumn?: VirtualTableRowActionsColumnConfig;
  /** Ref to trigger save in global mode: call ref.current?.saveAll() when user clicks Save outside the table. */
  tableEditRef?: RefObject<VirtualTableEditRef<TData> | null>;
}

/** Ref handle for triggering save in global edit mode. */
export interface VirtualTableEditRef<TData extends object = object> {
  /** Calls onSaveEdit for each row that has draft changes, then clears draft. No-op if not in global edit mode. */
  saveAll: () => void;
  /** Type link for ref consistency with table row type. Not used at runtime. */
  readonly _type?: TData;
}

