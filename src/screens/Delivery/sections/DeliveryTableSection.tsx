'use client';

import type { RefObject } from 'react';
import { VirtualTable } from '@/components/EC';
import type { VirtualTableColumn, VirtualTableSortingState } from '@/components/EC';
import type { VirtualTableEditRef } from '@/components/EC/VirtualTable/types';
import type { IDeliveryRow } from '../types';

export interface DeliveryTableSectionProps {
  data: IDeliveryRow[];
  columns: Array<VirtualTableColumn<IDeliveryRow>>;
  columnLabels: Record<string, string>;
  sortState?: VirtualTableSortingState;
  onSortChange?: (state: VirtualTableSortingState) => void;
  isGlobalEditMode: boolean;
  editingRowId: string | null;
  onSaveEdit: (rowId: string, patch: Partial<IDeliveryRow>) => void;
  onCancelEdit: () => void;
  onStartRowEdit: (rowId: string) => void;
  tableEditRef: RefObject<VirtualTableEditRef<IDeliveryRow> | null>;
}

export function DeliveryTableSection({
  data,
  columns,
  columnLabels,
  sortState,
  onSortChange,
  isGlobalEditMode,
  editingRowId,
  onSaveEdit,
  onCancelEdit,
  onStartRowEdit,
  tableEditRef,
}: DeliveryTableSectionProps) {
  return (
    <VirtualTable<IDeliveryRow>
      data={data}
      columns={columns}
      columnLabels={columnLabels}
      sortState={sortState}
      onSortChange={onSortChange}
      getRowId={(row) => row.id}
      editMode={isGlobalEditMode ? 'global' : null}
      editingRowId={editingRowId}
      onSaveEdit={onSaveEdit}
      onCancelEdit={onCancelEdit}
      onStartRowEdit={onStartRowEdit}
      tableEditRef={tableEditRef}
      enableTopToolbar={false}
      enableRowVirtualization={false}
    />
  );
}
