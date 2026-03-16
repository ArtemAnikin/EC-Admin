'use client';

import { Title, Button, Group } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import type { RefObject } from 'react';
import type { IDeliveryRow } from '../types';
import type { VirtualTableEditRef } from '@/components/EC/VirtualTable/types';

export interface DeliveryHeaderSectionProps {
  isGlobalEditMode: boolean;
  setGlobalEditMode: (value: boolean) => void;
  cancelEdit: () => void;
  tableEditRef: RefObject<VirtualTableEditRef<IDeliveryRow> | null>;
}

export function DeliveryHeaderSection({
  isGlobalEditMode,
  setGlobalEditMode,
  cancelEdit,
  tableEditRef,
}: DeliveryHeaderSectionProps) {
  const { t } = useTranslation();

  return (
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
  );
}
