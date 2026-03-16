import type { ReactElement } from 'react';
import { createRef } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { I18nextProvider } from 'react-i18next';
import { VirtualTable } from '../../../src/components/EC';
import type { VirtualTableColumn, VirtualTableEditRef } from '../../../src/components/EC';
import { theme } from '../../../src/styles/theme';
import i18n from '../../../src/i18n/config';

function renderTable(ui: ReactElement) {
  return render(
    <I18nextProvider i18n={i18n}>
      <MantineProvider theme={theme}>{ui}</MantineProvider>
    </I18nextProvider>,
  );
}

interface RowData {
  id: string;
  name: string;
  value: number;
}

const columnLabels = {
  name: 'Name',
  value: 'Value',
  __actions: 'Actions',
};

const rows: RowData[] = [
  { id: '1', name: 'Alpha', value: 10 },
  { id: '2', name: 'Beta', value: 20 },
];

const getRowId = (row: RowData) => row.id;

describe('VirtualTable editing', () => {
  test('global edit mode: editable columns render as inputs, non-editable as text', () => {
    const columns: Array<VirtualTableColumn<RowData>> = [
      { accessorKey: 'name', editable: true },
      { accessorKey: 'value', editable: false },
    ];

    renderTable(
      <VirtualTable<RowData>
        data={rows}
        columns={columns}
        columnLabels={columnLabels}
        getRowId={getRowId}
        editMode="global"
        enableRowVirtualization={false}
      />,
    );

    expect(screen.getByTestId('virtual-table')).toBeInTheDocument();
    // name is editable: both rows have edit inputs for name with initial values
    const name1 = screen.getByTestId('virtual-table-edit-cell-1-name');
    const name2 = screen.getByTestId('virtual-table-edit-cell-2-name');
    expect(name1).toBeInTheDocument();
    expect(name2).toBeInTheDocument();
    expect(name1).toHaveValue('Alpha');
    expect(name2).toHaveValue('Beta');
    // value is not editable: plain text
    const table = screen.getByTestId('virtual-table');
    expect(within(table).getByText('10')).toBeInTheDocument();
    expect(within(table).getByText('20')).toBeInTheDocument();
  });

  test('row edit mode: only the editing row has editable cells as inputs', () => {
    const columns: Array<VirtualTableColumn<RowData>> = [
      { accessorKey: 'name', editable: true },
      { accessorKey: 'value', editable: true },
    ];

    renderTable(
      <VirtualTable<RowData>
        data={rows}
        columns={columns}
        columnLabels={columnLabels}
        getRowId={getRowId}
        editingRowId="1"
        enableRowVirtualization={false}
      />,
    );

    // Row 1 (id=1) is in edit mode: should have edit inputs for name and value
    expect(screen.getByTestId('virtual-table-edit-cell-1-name')).toBeInTheDocument();
    expect(screen.getByTestId('virtual-table-edit-cell-1-value')).toBeInTheDocument();
    // Row 2 (id=2) is not editing: display mode (text)
    const table = screen.getByTestId('virtual-table');
    expect(within(table).getByText('Beta')).toBeInTheDocument();
    expect(within(table).getByText('20')).toBeInTheDocument();
  });

  test('cancel restores original displayed values', async () => {
    const user = userEvent.setup();
    const columns: Array<VirtualTableColumn<RowData>> = [
      { accessorKey: 'name', editable: true },
      { accessorKey: 'value', editable: true },
    ];
    const onCancelEdit = vi.fn();

    const { rerender } = renderTable(
      <VirtualTable<RowData>
        data={rows}
        columns={columns}
        columnLabels={columnLabels}
        getRowId={getRowId}
        editingRowId="1"
        onCancelEdit={onCancelEdit}
        enableRowVirtualization={false}
      />,
    );

    const nameInput = screen.getByTestId('virtual-table-edit-cell-1-name');
    await user.clear(nameInput);
    await user.type(nameInput, 'Altered');
    expect(nameInput).toHaveValue('Altered');

    // Simulate parent handling cancel: clear editingRowId and rerender
    rerender(
      <I18nextProvider i18n={i18n}>
        <MantineProvider theme={theme}>
          <VirtualTable<RowData>
            data={rows}
            columns={columns}
            columnLabels={columnLabels}
            getRowId={getRowId}
            editingRowId={null}
            onCancelEdit={onCancelEdit}
            enableRowVirtualization={false}
          />
        </MantineProvider>
      </I18nextProvider>,
    );

    // After cancel, row 1 is no longer in edit mode; display shows original data
    const table = screen.getByTestId('virtual-table');
    expect(within(table).getByText('Alpha')).toBeInTheDocument();
    expect(within(table).getByText('10')).toBeInTheDocument();
  });

  test('row save calls onSaveEdit with row id and draft data', async () => {
    const user = userEvent.setup();
    const columns: Array<VirtualTableColumn<RowData>> = [
      { accessorKey: 'name', editable: true },
      { accessorKey: 'value', editable: true },
    ];
    const onSaveEdit = vi.fn();

    renderTable(
      <VirtualTable<RowData>
        data={rows}
        columns={columns}
        columnLabels={columnLabels}
        getRowId={getRowId}
        editingRowId="1"
        onSaveEdit={onSaveEdit}
        rowActionsColumn={{ editLabel: 'Edit', saveLabel: 'Save', cancelLabel: 'Cancel' }}
        enableRowVirtualization={false}
      />,
    );

    const nameInput = screen.getByTestId('virtual-table-edit-cell-1-name');
    await user.clear(nameInput);
    await user.type(nameInput, 'AlphaUpdated');

    const saveButton = screen.getByTestId('virtual-table-row-save');
    await user.click(saveButton);

    expect(onSaveEdit).toHaveBeenCalledTimes(1);
    expect(onSaveEdit).toHaveBeenCalledWith('1', { name: 'AlphaUpdated' });
  });

  test('global edit mode: saveAll calls onSaveEdit for each row with draft changes', async () => {
    const user = userEvent.setup();
    const columns: Array<VirtualTableColumn<RowData>> = [
      { accessorKey: 'name', editable: true },
      { accessorKey: 'value', editable: true },
    ];
    const onSaveEdit = vi.fn();
    const tableEditRef = createRef<VirtualTableEditRef<RowData> | null>();

    renderTable(
      <VirtualTable<RowData>
        data={rows}
        columns={columns}
        columnLabels={columnLabels}
        getRowId={getRowId}
        editMode="global"
        onSaveEdit={onSaveEdit}
        tableEditRef={tableEditRef}
        enableRowVirtualization={false}
      />,
    );

    const nameRow1 = screen.getByTestId('virtual-table-edit-cell-1-name');
    await user.clear(nameRow1);
    await user.type(nameRow1, 'AlphaUpdated');

    tableEditRef.current?.saveAll();

    expect(onSaveEdit).toHaveBeenCalledWith('1', { name: 'AlphaUpdated' });
  });

  test('row actions column shows Edit in display mode and Save/Cancel in edit mode', async () => {
    const user = userEvent.setup();
    const columns: Array<VirtualTableColumn<RowData>> = [
      { accessorKey: 'name', editable: true },
    ];
    const onStartRowEdit = vi.fn();
    const onCancelEdit = vi.fn();

    renderTable(
      <VirtualTable<RowData>
        data={rows}
        columns={columns}
        columnLabels={columnLabels}
        getRowId={getRowId}
        rowActionsColumn={{ editLabel: 'Edit', saveLabel: 'Save', cancelLabel: 'Cancel' }}
        onStartRowEdit={onStartRowEdit}
        onCancelEdit={onCancelEdit}
        enableRowVirtualization={false}
      />,
    );

    const editButtons = screen.getAllByTestId('virtual-table-row-edit');
    expect(editButtons.length).toBe(2);
    await user.click(editButtons[0]!);
    expect(onStartRowEdit).toHaveBeenCalledWith('1');
  });
});
