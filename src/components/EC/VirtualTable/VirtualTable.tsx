import {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { MRT_ColumnDef, MRT_SortingState } from 'mantine-react-table';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { VTCInput } from '@/components/EC/VTComponents/VTCInput';
import type {
  VirtualTableColumn,
  VirtualTableProps,
  VirtualTableSortingState,
  VirtualTableColumnVisibilityState,
  VirtualTableEditRef,
  VirtualTableRowActionsColumnConfig,
} from './types';

const DEFAULT_TABLE_HEIGHT = 400;
const ROW_ACTIONS_COLUMN_ID = '__actions';

type DraftState<TData extends object> = Record<string, Partial<TData>>;

function getRowIdFromRow<TData extends object>(
  row: { original: TData; index: number },
  getRowId: (row: TData, index: number) => string,
): string {
  return getRowId(row.original, row.index);
}

function isRowInEditMode<TData extends object>(
  row: { original: TData; index: number },
  editMode: 'global' | null | undefined,
  editingRowId: string | null | undefined,
  getRowId: ((row: TData, index: number) => string) | undefined,
): boolean {
  if (!getRowId) return false;
  const rowId = getRowId(row.original, row.index);
  if (editMode === 'global') return true;
  return editingRowId === rowId;
}

interface DefaultActionLabels {
  edit: string;
  save: string;
  cancel: string;
}

interface EditContext<TData extends object> {
  editMode: 'global' | null | undefined;
  editingRowId: string | null | undefined;
  getRowId: ((row: TData, index: number) => string) | undefined;
  draft: DraftState<TData>;
  setDraft: React.Dispatch<React.SetStateAction<DraftState<TData>>>;
  onSaveEdit?: (rowId: string, data: Partial<TData>) => void;
  onCancelEdit?: () => void;
  onStartRowEdit?: (rowId: string) => void;
  rowActionsColumn?: VirtualTableRowActionsColumnConfig;
  defaultActionLabels: DefaultActionLabels;
  columnLabels: Record<string, string>;
}

function mapColumns<TData extends object>(
  columns: Array<VirtualTableColumn<TData>>,
  columnLabels: Record<string, string>,
  options: { allowHiding: boolean; allowOrdering: boolean },
  editContext: EditContext<TData> | null,
): MRT_ColumnDef<TData>[] {
  const hasEditMode =
    editContext &&
    editContext.getRowId &&
    (editContext.editMode === 'global' || editContext.editingRowId != null);

  const dataColumns: MRT_ColumnDef<TData>[] = columns.map((column) => {
    const headerLabel = columnLabels[column.accessorKey] ?? column.accessorKey;
    const cellRenderer = column.cell;
    const isAlwaysVisible = column.alwaysVisible === true;
    const field = column.accessorKey;
    const isEditable = column.editable === true;
    const renderEditCell = column.renderEditCell;

    return {
      id: column.accessorKey,
      accessorKey: column.accessorKey,
      accessorFn: column.accessorFn,
      header: headerLabel,
      enableSorting: column.isSortable ?? false,
      enableHiding: isAlwaysVisible ? false : options.allowHiding,
      enableColumnOrdering: options.allowOrdering,
      ...(cellRenderer || (hasEditMode && isEditable)
        ? {
            Cell: ({
              row,
              cell,
            }: {
              row: { original: TData; index: number };
              cell: { getValue: () => unknown };
            }) => {
              const getValue = () => cell.getValue();
              if (
                hasEditMode &&
                isEditable &&
                editContext &&
                isRowInEditMode(
                  row,
                  editContext.editMode,
                  editContext.editingRowId,
                  editContext.getRowId,
                )
              ) {
                const rowId = getRowIdFromRow(row, editContext.getRowId!);
                const displayValue = getValue();
                const draftValue = editContext.draft[rowId]?.[field];
                const value =
                  draftValue !== undefined ? draftValue : displayValue;

                const onChange = (newValue: unknown) => {
                  editContext.setDraft((prev) => ({
                    ...prev,
                    [rowId]: {
                      ...prev[rowId],
                      [field]: newValue,
                    },
                  }));
                };

                if (renderEditCell) {
                  return renderEditCell({
                    row: row.original,
                    value,
                    field,
                    onChange,
                  });
                }

                return (
                  <DefaultEditCell
                    value={value}
                    onChange={onChange}
                    rowId={rowId}
                    field={field}
                  />
                );
              }

              if (cellRenderer) {
                return cellRenderer({
                  row: row.original,
                  value: getValue(),
                });
              }

              return String(getValue() ?? '');
            },
          }
        : {}),
    };
  });

  if (!editContext?.rowActionsColumn || !editContext.getRowId) {
    return dataColumns;
  }

  const { editLabel, saveLabel, cancelLabel } = editContext.rowActionsColumn;
  const { edit: defaultEdit, save: defaultSave, cancel: defaultCancel } =
    editContext.defaultActionLabels;
  const actionsColumn: MRT_ColumnDef<TData> = {
    id: ROW_ACTIONS_COLUMN_ID,
    header: columnLabels[ROW_ACTIONS_COLUMN_ID] ?? '',
    enableSorting: false,
    enableHiding: false,
    enableColumnOrdering: false,
    accessorFn: () => null,
    size: 120,
    Cell: ({ row }) => {
      const rowId = getRowIdFromRow(row, editContext.getRowId!);
      const isEditing = editContext.editingRowId === rowId;

      if (isEditing) {
        return (
          <RowActionsEdit
            saveLabel={saveLabel ?? defaultSave}
            cancelLabel={cancelLabel ?? defaultCancel}
            onSave={() => {
              const patch = editContext.draft[rowId];
              editContext.onSaveEdit?.(rowId, patch ?? {});
              editContext.setDraft((prev) => {
                const next = { ...prev };
                delete next[rowId];
                return next;
              });
            }}
            onCancel={() => {
              editContext.onCancelEdit?.();
              editContext.setDraft((prev) => {
                const next = { ...prev };
                delete next[rowId];
                return next;
              });
            }}
          />
        );
      }

      return (
        <RowActionsDisplay
          editLabel={editLabel ?? defaultEdit}
          onEdit={() => editContext.onStartRowEdit?.(rowId)}
        />
      );
    },
  };

  return [actionsColumn, ...dataColumns];
}

function DefaultEditCell<TData extends object>({
  value,
  onChange,
  rowId,
  field,
}: {
  value: unknown;
  onChange: (value: unknown) => void;
  rowId: string;
  field: keyof TData & string;
}) {
  const str = value != null && value !== '' ? String(value) : '';
  return (
    <VTCInput
      value={str}
      onChange={(v) => onChange(v)}
      data-testid={`virtual-table-edit-cell-${rowId}-${field}`}
      aria-label={`Edit ${field}`}
    />
  );
}

function RowActionsEdit({
  saveLabel,
  cancelLabel,
  onSave,
  onCancel,
}: {
  saveLabel?: string;
  cancelLabel?: string;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      data-testid="virtual-table-row-actions-edit"
      onClick={(e) => e.stopPropagation()}
      role="presentation"
      style={{ display: 'flex', gap: 8 }}
    >
      <button
        type="button"
        onClick={onSave}
        data-testid="virtual-table-row-save"
      >
        {saveLabel ?? 'Save'}
      </button>
      <button
        type="button"
        onClick={onCancel}
        data-testid="virtual-table-row-cancel"
      >
        {cancelLabel ?? 'Cancel'}
      </button>
    </div>
  );
}

function RowActionsDisplay({
  editLabel,
  onEdit,
}: {
  editLabel?: string;
  onEdit: () => void;
}) {
  return (
    <div
      data-testid="virtual-table-row-actions-display"
      onClick={(e) => e.stopPropagation()}
      role="presentation"
    >
      <button
        type="button"
        onClick={onEdit}
        data-testid="virtual-table-row-edit"
      >
        {editLabel ?? 'Edit'}
      </button>
    </div>
  );
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
 * Supports global edit mode and row edit mode; draft state is internal; parent controls
 * editMode/editingRowId and handles onSaveEdit/onCancelEdit/onStartRowEdit.
 */
function VirtualTableInner<TData extends object>(
  {
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
    editMode,
    editingRowId,
    onSaveEdit,
    onCancelEdit,
    onStartRowEdit,
    rowActionsColumn,
    tableEditRef,
  }: VirtualTableProps<TData>,
  ref: React.Ref<VirtualTableEditRef<TData> | null>,
) {
  const { t } = useTranslation();
  const allowHiding = !!onColumnVisibilityChange;
  const allowOrdering = !!onColumnOrderChange;

  const defaultActionLabels: DefaultActionLabels = useMemo(
    () => ({
      edit: t('table.edit'),
      save: t('table.save'),
      cancel: t('table.cancel'),
    }),
    [t],
  );

  const [draft, setDraft] = useState<DraftState<TData>>({});

  useEffect(() => {
    if (editMode !== 'global' && editingRowId == null) {
      setDraft({});
    }
  }, [editMode, editingRowId]);

  const saveAll = useCallback(() => {
    if (editMode !== 'global' || !getRowId || !onSaveEdit) return;
    data.forEach((row, index) => {
      const rowId = getRowId(row, index);
      const patch = draft[rowId];
      if (patch != null && Object.keys(patch).length > 0) {
        onSaveEdit(rowId, patch);
      }
    });
    setDraft({});
  }, [editMode, getRowId, onSaveEdit, data, draft]);

  useImperativeHandle(
    ref ?? tableEditRef,
    () => ({
      saveAll,
    }),
    [saveAll],
  );

  const editContext: EditContext<TData> | null =
    (rowActionsColumn != null && getRowId != null) ||
    editMode != null ||
    editingRowId != null
      ? {
          editMode,
          editingRowId,
          getRowId,
          draft,
          setDraft,
          onSaveEdit,
          onCancelEdit,
          onStartRowEdit,
          rowActionsColumn,
          defaultActionLabels,
          columnLabels,
        }
      : null;

  const baseColumns = useMemo(
    () => columns.map((c) => c.accessorKey),
    [columns],
  );
  const effectiveColumnOrder = useMemo(() => {
    const order = columnOrder ?? baseColumns;
    if (rowActionsColumn) {
      return [ROW_ACTIONS_COLUMN_ID, ...order];
    }
    return order;
  }, [columnOrder, baseColumns, rowActionsColumn]);

  const mappedColumns = useMemo(
    () =>
      mapColumns(columns, columnLabels, { allowHiding, allowOrdering }, editContext),
    [
      columns,
      columnLabels,
      allowHiding,
      allowOrdering,
      editContext,
    ],
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
      'data-testid': 'virtual-table',
    } as ComponentPropsWithoutRef<'div'>,
  });

  return <MantineReactTable table={table} />;
}

export const VirtualTable = forwardRef(VirtualTableInner) as <
  TData extends object,
>(
  props: VirtualTableProps<TData> & {
    ref?: React.Ref<VirtualTableEditRef<TData> | null>;
  },
) => React.ReactElement;
