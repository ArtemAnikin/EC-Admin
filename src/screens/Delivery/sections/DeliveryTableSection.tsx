'use client';

import type { RefObject } from 'react';
import { VirtualTable } from '@/components/EC';
import type { VirtualTableColumn } from '@/components/EC';
import type { VirtualTableEditRef } from '@/components/EC/VirtualTable/types';
import type { IDeliveryRow } from '../types';

export interface DeliveryTableSectionProps {
  data: IDeliveryRow[];
  columns: Array<VirtualTableColumn<IDeliveryRow>>;
  columnLabels: Record<string, string>;
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
      getRowId={(row) => row.id}
      editMode={isGlobalEditMode ? 'global' : null}
      editingRowId={editingRowId}
      onSaveEdit={onSaveEdit}
      onCancelEdit={onCancelEdit}
      onStartRowEdit={onStartRowEdit}
      tableEditRef={tableEditRef}
      rowActionsColumn={{}}
      enableRowVirtualization={false}
    />
  );
}
