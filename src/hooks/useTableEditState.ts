import { useState, useCallback, useRef } from 'react';
import type { RefObject } from 'react';
import type { VirtualTableEditRef } from '@/components/EC/VirtualTable/types';

export interface UseTableEditStateReturn<TData extends object> {
  /** Whether the table is in global edit mode. */
  isGlobalEditMode: boolean;
  /** Set global edit mode on or off. */
  setGlobalEditMode: (value: boolean) => void;
  /** Row id currently in row edit mode, or null. Only one row at a time. */
  editingRowId: string | null;
  /** Start editing the given row (clears any other row edit). */
  startRowEdit: (rowId: string) => void;
  /** Clear row edit and global edit mode; table will clear draft on cancel. */
  cancelEdit: () => void;
  /** Ref to pass to VirtualTable as tableEditRef; call ref.current?.saveAll() for global save. */
  tableEditRef: RefObject<VirtualTableEditRef<TData> | null>;
}

/**
 * Manages edit state for VirtualTable: global edit mode and single-row edit mode.
 * Use with VirtualTable by passing editMode, editingRowId, onStartRowEdit, onCancelEdit, and tableEditRef.
 * For global save, call tableEditRef.current?.saveAll() when the user clicks Save outside the table.
 */
export function useTableEditState<TData extends object>(): UseTableEditStateReturn<TData> {
  const [isGlobalEditMode, setGlobalEditMode] = useState(false);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const tableEditRef = useRef<VirtualTableEditRef<TData> | null>(null);

  const startRowEdit = useCallback((rowId: string) => {
    setEditingRowId(rowId);
  }, []);

  const cancelEdit = useCallback(() => {
    setGlobalEditMode(false);
    setEditingRowId(null);
  }, []);

  return {
    isGlobalEditMode,
    setGlobalEditMode,
    editingRowId,
    startRowEdit,
    cancelEdit,
    tableEditRef,
  };
}
