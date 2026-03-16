import type { ReactElement } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { VirtualTable } from '../../../src/components/EC';
import type { VirtualTableColumn } from '../../../src/components/EC';
import { theme } from '../../../src/styles/theme';

function renderTable(ui: ReactElement) {
  return render(
    <MantineProvider theme={theme}>{ui}</MantineProvider>,
  );
}

interface RowData {
  id: string;
  name: string;
  value: number;
}

const columns: Array<VirtualTableColumn<RowData>> = [
  {
    accessorKey: 'name',
    isSortable: true,
  },
  {
    accessorKey: 'value',
  },
];

const rows: RowData[] = [
  { id: '1', name: 'Alpha', value: 10 },
  { id: '2', name: 'Beta', value: 20 },
];

const columnLabels = {
  name: 'Name',
  value: 'Value',
};

describe('VirtualTable', () => {
  test('renders with minimal config and shows column labels from props', () => {
    renderTable(
      <VirtualTable<RowData>
        data={rows}
        columns={columns}
        columnLabels={columnLabels}
      />,
    );

    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Value' })).toBeInTheDocument();
  });

  test('calls onSortChange when sortable header is clicked with column id and direction', async () => {
    const user = userEvent.setup();
    const handleSortChange = vi.fn();

    renderTable(
      <VirtualTable<RowData>
        data={rows}
        columns={columns}
        columnLabels={columnLabels}
        sortState={[]}
        onSortChange={handleSortChange}
      />,
    );

    const nameHeader = screen.getByRole('columnheader', { name: 'Name' });
    await user.click(nameHeader);

    expect(handleSortChange).toHaveBeenCalled();
    const [nextState] = handleSortChange.mock.calls[0] as [
      Array<{ id: string; desc: boolean }>,
    ];
    expect(Array.isArray(nextState)).toBe(true);
    if (nextState.length > 0) {
      expect(nextState[0]).toMatchObject({ id: 'name' });
      expect(typeof nextState[0].desc).toBe('boolean');
    }
  });

  test('respects column visibility prop', () => {
    renderTable(
      <VirtualTable<RowData>
        data={rows}
        columns={columns}
        columnLabels={columnLabels}
        columnVisibility={{ name: false, value: true }}
      />,
    );

    expect(
      screen.queryByRole('columnheader', { name: 'Name' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Value' }),
    ).toBeInTheDocument();
  });

  test('respects column order prop', () => {
    renderTable(
      <VirtualTable<RowData>
        data={rows}
        columns={columns}
        columnLabels={columnLabels}
        columnOrder={['value', 'name']}
      />,
    );

    const headers = screen.getAllByRole('columnheader');
    expect(headers[0]).toHaveTextContent('Value');
    expect(headers[1]).toHaveTextContent('Name');
  });

  test('uses config column order when columnOrder is not provided', () => {
    renderTable(
      <VirtualTable<RowData>
        data={rows}
        columns={columns}
        columnLabels={columnLabels}
      />,
    );

    const headers = screen.getAllByRole('columnheader');
    expect(headers[0]).toHaveTextContent('Name');
    expect(headers[1]).toHaveTextContent('Value');
  });

  test('calls onRowClick with row data when a body row is clicked', async () => {
    const user = userEvent.setup();
    const handleRowClick = vi.fn();

    renderTable(
      <VirtualTable<RowData>
        data={rows}
        columns={columns}
        columnLabels={columnLabels}
        onRowClick={handleRowClick}
        enableRowVirtualization={false}
      />,
    );

    const alphaCell = screen.getByText('Alpha');
    await user.click(alphaCell);

    expect(handleRowClick).toHaveBeenCalledTimes(1);
    expect(handleRowClick).toHaveBeenCalledWith(rows[0]);
  });

  test('uses column id as header when columnLabels omits a key (no hardcoded labels)', () => {
    renderTable(
      <VirtualTable<RowData>
        data={rows}
        columns={columns}
        columnLabels={{ name: 'Name' }}
        enableRowVirtualization={false}
      />,
    );

    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'value' })).toBeInTheDocument();
  });

  test('renders empty state when data is empty and emptyState is provided', () => {
    const emptyMessage = 'No items to show';

    renderTable(
      <VirtualTable<RowData>
        data={[]}
        columns={columns}
        columnLabels={columnLabels}
        emptyState={<span>{emptyMessage}</span>}
      />,
    );

    expect(screen.getByText(emptyMessage)).toBeInTheDocument();
  });
});

