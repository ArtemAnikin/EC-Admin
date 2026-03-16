import { describe, expect, test } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVirtualTableColumns } from '@/hooks/useVirtualTableColumns';
import type { VirtualTableColumn } from '@/components/EC/VirtualTable/types';

interface RowData {
  id: string;
  name: string;
  value: number;
}

const baseColumns: Array<VirtualTableColumn<RowData>> = [
  { accessorKey: 'id', alwaysVisible: true },
  { accessorKey: 'name', isSortable: true },
  { accessorKey: 'value' },
];

describe('useVirtualTableColumns', () => {
  test('initial visibility and order use column definition order when no initial state', () => {
    const { result } = renderHook(() =>
      useVirtualTableColumns({ columns: baseColumns }),
    );

    expect(result.current.columnVisibility).toEqual({
      id: true,
      name: true,
      value: true,
    });
    expect(result.current.columnOrder).toEqual(['id', 'name', 'value']);
  });

  test('initial visibility and order respect initialVisibility and initialOrder', () => {
    const { result } = renderHook(() =>
      useVirtualTableColumns({
        columns: baseColumns,
        initialVisibility: { id: true, name: false, value: true },
        initialOrder: ['value', 'name', 'id'],
      }),
    );

    expect(result.current.columnVisibility).toEqual({
      id: true,
      name: false,
      value: true,
    });
    expect(result.current.columnOrder).toEqual(['value', 'name', 'id']);
  });

  test('always-visible columns are forced true in initial visibility', () => {
    const { result } = renderHook(() =>
      useVirtualTableColumns({
        columns: baseColumns,
        initialVisibility: { id: false, name: true, value: true },
      }),
    );

    expect(result.current.columnVisibility.id).toBe(true);
    expect(result.current.columnVisibility.name).toBe(true);
    expect(result.current.columnVisibility.value).toBe(true);
  });

  test('setting visibility to hide a non-always-visible column works', () => {
    const { result } = renderHook(() =>
      useVirtualTableColumns({ columns: baseColumns }),
    );

    act(() => {
      result.current.onColumnVisibilityChange({ id: true, name: false, value: true });
    });

    expect(result.current.columnVisibility).toEqual({
      id: true,
      name: false,
      value: true,
    });
  });

  test('setting visibility to hide an always-visible column leaves that column visible', () => {
    const { result } = renderHook(() =>
      useVirtualTableColumns({ columns: baseColumns }),
    );

    act(() => {
      result.current.onColumnVisibilityChange({
        id: false,
        name: true,
        value: true,
      });
    });

    expect(result.current.columnVisibility.id).toBe(true);
    expect(result.current.columnVisibility.name).toBe(true);
    expect(result.current.columnVisibility.value).toBe(true);
  });

  test('onColumnVisibilityChange with updater function enforces always-visible', () => {
    const { result } = renderHook(() =>
      useVirtualTableColumns({
        columns: baseColumns,
        initialVisibility: { id: true, name: true, value: false },
      }),
    );

    act(() => {
      result.current.onColumnVisibilityChange((prev) => ({
        ...prev,
        id: false,
        value: true,
      }));
    });

    expect(result.current.columnVisibility.id).toBe(true);
    expect(result.current.columnVisibility.value).toBe(true);
  });

  test('setting column order updates state and keeps all IDs', () => {
    const { result } = renderHook(() =>
      useVirtualTableColumns({ columns: baseColumns }),
    );

    act(() => {
      result.current.onColumnOrderChange(['value', 'id', 'name']);
    });

    expect(result.current.columnOrder).toEqual(['value', 'id', 'name']);
  });

  test('onColumnOrderChange with updater function updates order', () => {
    const { result } = renderHook(() =>
      useVirtualTableColumns({
        columns: baseColumns,
        initialOrder: ['id', 'name', 'value'],
      }),
    );

    act(() => {
      result.current.onColumnOrderChange((prev) =>
        [...prev].reverse(),
      );
    });

    expect(result.current.columnOrder).toEqual(['value', 'name', 'id']);
  });

  test('order with missing IDs reinserts missing column IDs', () => {
    const { result } = renderHook(() =>
      useVirtualTableColumns({ columns: baseColumns }),
    );

    act(() => {
      result.current.onColumnOrderChange(['value', 'name']);
    });

    expect(result.current.columnOrder).toContain('id');
    expect(result.current.columnOrder).toContain('name');
    expect(result.current.columnOrder).toContain('value');
    expect(result.current.columnOrder).toHaveLength(3);
  });

  test('returned shape matches VirtualTable props', () => {
    const { result } = renderHook(() =>
      useVirtualTableColumns({ columns: baseColumns }),
    );

    expect(result.current).toHaveProperty('columnVisibility');
    expect(result.current).toHaveProperty('onColumnVisibilityChange');
    expect(result.current).toHaveProperty('columnOrder');
    expect(result.current).toHaveProperty('onColumnOrderChange');
    expect(typeof result.current.onColumnVisibilityChange).toBe('function');
    expect(typeof result.current.onColumnOrderChange).toBe('function');
  });
});
