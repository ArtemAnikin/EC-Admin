'use client';

import { useMemo, useState, useCallback } from 'react';
import { Container, Group } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import type { VirtualTableColumn, VirtualTableSortingState } from '@/components/EC';
import { VTCInput, VTCCheckbox, VTCCurrency } from '@/components/EC/VTComponents';
import { useTableEditState } from '@/hooks/useTableEditState';
import type { IDeliveryRow } from './types';
import { formatPrice, parseTravelTime } from './utils';
import { DeliveryHeaderSection, DeliveryTableSection } from './sections';

const MOCK_DATA: IDeliveryRow[] = [
  {
    id: 'bar-city',
    city: 'Bar',
    placeLabel: 'City delivery',
    placeChecked: false,
    oneWayPrice: 15,
    freeAfterDays: 7,
    travelTime: { hours: 1, minutes: 30 },
  },
  {
    id: 'bar-railway',
    city: 'Bar',
    placeLabel: 'Railway Station',
    placeChecked: false,
    oneWayPrice: 15,
    freeAfterDays: 7,
    travelTime: { hours: 1, minutes: 30 },
  },
];

export function DeliveryScreen() {
  const { t } = useTranslation();
  const [data, setData] = useState<IDeliveryRow[]>(MOCK_DATA);
  const {
    isGlobalEditMode,
    setGlobalEditMode,
    editingRowId,
    startRowEdit,
    cancelEdit,
    tableEditRef,
  } = useTableEditState<IDeliveryRow>();

  const [sortState, setSortState] = useState<VirtualTableSortingState>([]);

  const columnLabels = useMemo(
    () => ({
      city: t('delivery.columns.city'),
      place: t('delivery.columns.place'),
      oneWayPrice: t('delivery.columns.oneWayPrice'),
      freeAfterDays: t('delivery.columns.freeAfterDays'),
      travelTime: t('delivery.columns.travelTime'),
    }),
    [t],
  );

  const columns = useMemo<Array<VirtualTableColumn<IDeliveryRow>>>(
    () => [
      {
        accessorKey: 'city',
        editable: false,
        isSortable: true,
      },
      {
        accessorKey: 'placeChecked',
        editable: true,
        isSortable: false,
        cell: ({ row, value }) => (
          <VTCCheckbox
            checked={!!value}
            onChange={() => {}}
            disabled
            label={row.placeLabel}
            data-testid="delivery-place-checkbox-display"
          />
        ),
        renderEditCell: ({ row, value, onChange }) => (
          <VTCCheckbox
            checked={!!value}
            onChange={onChange as (checked: boolean) => void}
            label={row.placeLabel}
            data-testid="delivery-place-checkbox-edit"
          />
        ),
      },
      {
        accessorKey: 'oneWayPrice',
        editable: true,
        isSortable: true,
        cell: ({ value }) => formatPrice('$', Number(value ?? 0)),
        renderEditCell: ({ value, onChange }) => (
          <VTCCurrency
            currency="$"
            value={typeof value === 'number' ? String(value) : String(value ?? '')}
            setValue={(v) => onChange(v === '' ? 0 : Number(v))}
            aria-label={columnLabels.oneWayPrice}
          />
        ),
      },
      {
        accessorKey: 'freeAfterDays',
        editable: true,
        isSortable: true,
        cell: ({ value }) => String(value ?? ''),
        renderEditCell: ({ value, onChange }) => (
          <VTCInput
            type="number"
            value={typeof value === 'number' ? String(value) : String(value ?? '')}
            onChange={(v) => onChange(v === '' ? 0 : Number(v))}
            aria-label={columnLabels.freeAfterDays}
            data-testid="delivery-free-after-days"
          />
        ),
      },
      {
        accessorKey: 'travelTime',
        accessorFn: (row) => `${row.travelTime.hours} h, ${row.travelTime.minutes} min`,
        editable: true,
        isSortable: true,
        cell: ({ value }) => {
          const tt = parseTravelTime(value);
          return `${tt.hours} h, ${tt.minutes} min`;
        },
        renderEditCell: ({ row, value, onChange }) => {
          const tt = parseTravelTime(value ?? row.travelTime);
          return (
            <Group gap="xs" onClick={(e) => e.stopPropagation()} role="presentation" wrap="nowrap">
              <VTCInput
                type="number"
                value={String(tt.hours)}
                onChange={(h) =>
                  onChange({ ...tt, hours: h === '' ? 0 : Number(h) })
                }
                aria-label={`${columnLabels.travelTime} hours`}
                data-testid="delivery-travel-hours"
              />
              <span>h</span>
              <VTCInput
                type="number"
                value={String(tt.minutes)}
                onChange={(m) =>
                  onChange({ ...tt, minutes: m === '' ? 0 : Number(m) })
                }
                aria-label={`${columnLabels.travelTime} minutes`}
                data-testid="delivery-travel-minutes"
              />
              <span>min</span>
            </Group>
          );
        },
      },
    ],
    [columnLabels],
  );

  const handleSaveEdit = useCallback((rowId: string, patch: Partial<IDeliveryRow>) => {
    setData((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, ...patch } : row)),
    );
  }, []);

  return (
    <Container size="lg" py="xl">
      <DeliveryHeaderSection
        isGlobalEditMode={isGlobalEditMode}
        setGlobalEditMode={setGlobalEditMode}
        cancelEdit={cancelEdit}
        tableEditRef={tableEditRef}
      />
      <DeliveryTableSection
        data={data}
        columns={columns}
        columnLabels={columnLabels}
        sortState={sortState}
        onSortChange={setSortState}
        isGlobalEditMode={isGlobalEditMode}
        editingRowId={editingRowId}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={cancelEdit}
        onStartRowEdit={startRowEdit}
        tableEditRef={tableEditRef}
      />
    </Container>
  );
}
