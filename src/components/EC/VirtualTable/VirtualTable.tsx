import { useMemo } from 'react';
import type { MRT_ColumnDef, MRT_SortingState } from 'mantine-react-table';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import type {
  VirtualTableColumn,
  VirtualTableProps,
  VirtualTableSortingState,
  VirtualTableColumnVisibilityState,
} from './types';

const DEFAULT_TABLE_HEIGHT = 400;

function mapColumns<TData extends object>(
  columns: Array<VirtualTableColumn<TData>>,
  columnLabels: Record<string, string>,
  options: { allowHiding: boolean; allowOrdering: boolean },
): MRT_ColumnDef<TData>[] {
  return columns.map((column) => {
    const headerLabel = columnLabels[column.accessorKey] ?? column.accessorKey;
    const cellRenderer = column.cell;
    const isAlwaysVisible = column.alwaysVisible === true;

    return {
      id: column.accessorKey,
      accessorKey: column.accessorKey,
      accessorFn: column.accessorFn,
      header: headerLabel,
      enableSorting: column.isSortable ?? false,
      enableHiding: isAlwaysVisible ? false : options.allowHiding,
      enableColumnOrdering: options.allowOrdering,
      cell: cellRenderer
        ? ({
            row,
            getValue,
          }: {
            row: { original: TData };
            getValue: () => unknown;
          }) => cellRenderer({ row: row.original, value: getValue() })
        : undefined,
    };
  });
}

function resolveSortingUpdate(
  current: VirtualTableSortingState | undefined,
  updater:
    | MRT_SortingState
    | ((prev: MRT_SortingState) => MRT_SortingState),
): VirtualTableSortingState {
  const prev = (current ?? []) as MRT_SortingState;
  const next = typeof updater === 'function' ? updater(prev) : updater;
  return next as VirtualTableSortingState;
}

function resolveVisibilityUpdate(
  current: VirtualTableColumnVisibilityState | undefined,
  updater:
    | VirtualTableColumnVisibilityState
    | ((
        prev: VirtualTableColumnVisibilityState,
      ) => VirtualTableColumnVisibilityState),
): VirtualTableColumnVisibilityState {
  const prev = current ?? {};
  return typeof updater === 'function' ? updater(prev) : updater;
}

function resolveOrderUpdate(
  current: string[] | undefined,
  updater: string[] | ((prev: string[]) => string[]),
): string[] {
  const prev = current ?? [];
  return typeof updater === 'function' ? updater(prev) : updater;
}

/**
 * Reusable virtualized table: config-driven columns, sorting, column visibility/order.
 * Fully controlled: data, labels, and state (sort, visibility, order) come from props.
 * Column config uses keys only; labels are provided via columnLabels (e.g. from BE/i18n).
 */
export function VirtualTable<TData extends object>({
  data,
  columns,
  columnLabels,
  sortState,
  onSortChange,
  columnVisibility,
  onColumnVisibilityChange,
  columnOrder,
  onColumnOrderChange,
  getRowId,
  onRowClick,
  tableHeight = DEFAULT_TABLE_HEIGHT,
  enableRowVirtualization = true,
  isLoading,
  emptyState,
}: VirtualTableProps<TData>) {
  const allowHiding = !!onColumnVisibilityChange;
  const allowOrdering = !!onColumnOrderChange;

  const mappedColumns = useMemo(
    () =>
      mapColumns(columns, columnLabels, {
        allowHiding,
        allowOrdering,
      }),
    [columns, columnLabels, allowHiding, allowOrdering],
  );

  const effectiveColumnOrder = useMemo(
    () => columnOrder ?? columns.map((c) => c.accessorKey),
    [columnOrder, columns],
  );

  const table = useMantineReactTable({
    columns: mappedColumns,
    data,
    getRowId,
    state: {
      sorting: (sortState ?? []) as MRT_SortingState,
      columnVisibility,
      columnOrder: effectiveColumnOrder,
      isLoading,
    },
    onSortingChange: (updater) => {
      if (!onSortChange) return;
      const next = resolveSortingUpdate(sortState, updater);
      onSortChange(next);
    },
    onColumnVisibilityChange: (updater) => {
      if (!onColumnVisibilityChange) return;
      const next = resolveVisibilityUpdate(columnVisibility, updater);
      onColumnVisibilityChange(next);
    },
    onColumnOrderChange: (updater) => {
      if (!onColumnOrderChange) return;
      const next = resolveOrderUpdate(effectiveColumnOrder, updater);
      onColumnOrderChange(next);
    },
    enableRowVirtualization,
    enableColumnOrdering: allowOrdering,
    enableColumnResizing: true,
    enableSorting: true,
    enableHiding: allowHiding,
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: onRowClick
        ? () => {
            onRowClick(row.original);
          }
        : undefined,
      style: onRowClick ? { cursor: 'pointer' } : undefined,
    }),
    renderEmptyRowsFallback: () => emptyState ?? null,
    mantineTableContainerProps: {
      style: {
        maxHeight: tableHeight,
      },
    },
  });

  return <MantineReactTable table={table} />;
}

