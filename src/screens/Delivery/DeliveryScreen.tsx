'use client';

import { useMemo, useState, useCallback } from 'react';
import { Container, Title, Button, Group } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { VirtualTable } from '@/components/EC';
import type { VirtualTableColumn } from '@/components/EC';
import { VTCInput, VTCCheckbox, VTCCurrency } from '@/components/EC/VTComponents';
import { useTableEditState } from '@/hooks/useTableEditState';
import type { IDeliveryRow, IDeliveryTravelTime } from './types';

const DEFAULT_TRAVEL_TIME: IDeliveryTravelTime = { hours: 0, minutes: 0 };

const initialData: IDeliveryRow[] = [
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

function formatPrice(currency: string, value: number): string {
  return `${currency}${value}`;
}

function parseTravelTime(value: unknown): IDeliveryTravelTime {
  if (value != null && typeof value === 'object' && 'hours' in value && 'minutes' in value) {
    const v = value as { hours: unknown; minutes: unknown };
    return {
      hours: Number(v.hours) || 0,
      minutes: Number(v.minutes) || 0,
    };
  }
  return DEFAULT_TRAVEL_TIME;
}

export function DeliveryScreen() {
  const { t } = useTranslation();
  const [data, setData] = useState<IDeliveryRow[]>(initialData);
  const {
    isGlobalEditMode,
    setGlobalEditMode,
    editingRowId,
    startRowEdit,
    cancelEdit,
    tableEditRef,
  } = useTableEditState<IDeliveryRow>();

  const columnLabels = useMemo(
    () => ({
      city: t('delivery.columns.city'),
      place: t('delivery.columns.place'),
      oneWayPrice: t('delivery.columns.oneWayPrice'),
      freeAfterDays: t('delivery.columns.freeAfterDays'),
      travelTime: t('delivery.columns.travelTime'),
      __actions: t('delivery.columns.__actions'),
    }),
    [t],
  );

  const columns = useMemo<Array<VirtualTableColumn<IDeliveryRow>>>(
    () => [
      {
        accessorKey: 'city',
        editable: false,
      },
      {
        accessorKey: 'placeChecked',
        editable: true,
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
      <Group justify="space-between" mb="md">
        <Title order={1} data-testid="delivery-heading">
          {t('delivery.title')}
        </Title>
        <Group>
          {isGlobalEditMode ? (
            <>
              <Button
                size="sm"
                variant="filled"
                onClick={() => tableEditRef.current?.saveAll()}
                data-testid="delivery-save-all"
              >
                {t('table.save')}
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={cancelEdit}
                data-testid="delivery-cancel-edit"
              >
                {t('table.cancel')}
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="filled"
              onClick={() => setGlobalEditMode(true)}
              data-testid="delivery-edit-mode"
            >
              {t('table.edit')}
            </Button>
          )}
        </Group>
      </Group>
      <VirtualTable<IDeliveryRow>
        data={data}
        columns={columns}
        columnLabels={columnLabels}
        getRowId={(row) => row.id}
        editMode={isGlobalEditMode ? 'global' : null}
        editingRowId={editingRowId}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={cancelEdit}
        onStartRowEdit={startRowEdit}
        tableEditRef={tableEditRef}
        rowActionsColumn={{}}
        enableRowVirtualization={false}
      />
    </Container>
  );
}
