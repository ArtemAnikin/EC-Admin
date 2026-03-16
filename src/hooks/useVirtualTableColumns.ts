import { useMemo, useState, useCallback } from 'react';
import type {
  VirtualTableColumn,
  VirtualTableColumnVisibilityState,
} from '@/components/EC/VirtualTable/types';

export interface UseVirtualTableColumnsParams<TData extends object> {
  /** Column definitions; IDs and always-visible set are derived from this array. */
  columns: Array<VirtualTableColumn<TData>>;
  /** Initial visibility state. Always-visible column IDs are forced to true. */
  initialVisibility?: VirtualTableColumnVisibilityState;
  /** Initial column order. Missing IDs are appended; order is normalized. */
  initialOrder?: string[];
}

export interface UseVirtualTableColumnsReturn {
  columnVisibility: VirtualTableColumnVisibilityState;
  onColumnVisibilityChange: (
    value:
      | VirtualTableColumnVisibilityState
      | ((
          prev: VirtualTableColumnVisibilityState,
        ) => VirtualTableColumnVisibilityState),
  ) => void;
  columnOrder: string[];
  onColumnOrderChange: (value: string[] | ((prev: string[]) => string[])) => void;
}

function defaultVisibility(
  columnIds: string[],
  alwaysVisibleIds: Set<string>,
  initial?: VirtualTableColumnVisibilityState,
): VirtualTableColumnVisibilityState {
  const base: VirtualTableColumnVisibilityState = {};
  for (const id of columnIds) {
    base[id] = initial?.[id] ?? true;
  }
  for (const id of alwaysVisibleIds) {
    base[id] = true;
  }
  return base;
}

function defaultOrder(
  columnIds: string[],
  initial?: string[],
): string[] {
  if (!initial?.length) return [...columnIds];
  const set = new Set(columnIds);
  const ordered: string[] = [];
  for (const id of initial) {
    if (set.has(id)) {
      ordered.push(id);
      set.delete(id);
    }
  }
  for (const id of columnIds) {
    if (set.has(id)) ordered.push(id);
  }
  return ordered;
}

/**
 * Manages column visibility and ordering for VirtualTable.
 * Use this hook when you want controllable visibility/order with always-visible enforcement.
 *
 * @param params.columns - Column definitions; column IDs and always-visible set are derived from this.
 * @param params.initialVisibility - Optional initial visibility (always-visible columns are forced visible).
 * @param params.initialOrder - Optional initial column order (missing IDs are appended).
 * @returns Props to spread onto VirtualTable: columnVisibility, onColumnVisibilityChange, columnOrder, onColumnOrderChange.
 * Always-visible columns (columns with alwaysVisible: true) cannot be hidden; setting visibility to false for them is ignored.
 */
export function useVirtualTableColumns<TData extends object>({
  columns,
  initialVisibility,
  initialOrder,
}: UseVirtualTableColumnsParams<TData>): UseVirtualTableColumnsReturn {
  const columnIds = useMemo(
    () => columns.map((c) => c.accessorKey),
    [columns],
  );
  const alwaysVisibleIds = useMemo(
    () =>
      new Set(
        columns.filter((c) => c.alwaysVisible).map((c) => c.accessorKey),
      ),
    [columns],
  );

  const [columnVisibility, setColumnVisibility] = useState<
    VirtualTableColumnVisibilityState
  >(() =>
    defaultVisibility(columnIds, alwaysVisibleIds, initialVisibility),
  );
  const [columnOrder, setColumnOrder] = useState<string[]>(() =>
    defaultOrder(columnIds, initialOrder),
  );

  const onColumnVisibilityChange = useCallback(
    (
      value:
        | VirtualTableColumnVisibilityState
        | ((
            prev: VirtualTableColumnVisibilityState,
          ) => VirtualTableColumnVisibilityState),
    ) => {
      setColumnVisibility((prev) => {
        const next =
          typeof value === 'function' ? value(prev) : { ...value };
        for (const id of alwaysVisibleIds) {
          next[id] = true;
        }
        return next;
      });
    },
    [alwaysVisibleIds],
  );

  const onColumnOrderChange = useCallback(
    (value: string[] | ((prev: string[]) => string[])) => {
      setColumnOrder((prev) => {
        const next = typeof value === 'function' ? value(prev) : value;
        const set = new Set<string>(columnIds);
        const ordered: string[] = [];
        for (const id of next) {
          if (set.has(id)) {
            ordered.push(id);
            set.delete(id);
          }
        }
        for (const id of columnIds) {
          if (set.has(id)) ordered.push(id);
        }
        return ordered;
      });
    },
    [columnIds],
  );

  return {
    columnVisibility,
    onColumnVisibilityChange,
    columnOrder,
    onColumnOrderChange,
  };
}
