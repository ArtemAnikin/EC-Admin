# VTComponents

Reusable UI components for use inside **VirtualTable** cell renderers. Built on Mantine with minimal styling and minimal re-renders (memoized).

## Components

- **VTCSelect** – Dropdown select for table cells (`value`, `onChange`, `data`, optional `placeholder`, `disabled`, `aria-label`).
- **VTCInput** – Text/number input for editable cells (`value`, `onChange`, optional `type`, `placeholder`, `disabled`, `aria-label`).
- **VTCCheckbox** – Checkbox for row selection or boolean values (`checked`, `onChange`, optional `disabled`, `indeterminate`, `aria-label`).
- **VTCActions** – Action menu (three dots) with dropdown (`items: ActionItem[]`, optional `aria-label`). Use `ActionItem`: `{ id, label, onClick, disabled? }`.

## Usage

Import from `@/components/EC` or `@/components/EC/VTComponents`:

```tsx
import { VTCSelect, VTCInput, VTCCheckbox, VTCActions, type ActionItem } from '@/components/EC';

// In column config:
columns: [
  {
    accessorKey: 'status',
    cell: ({ row, value }) => (
      <VTCSelect
        value={value as string}
        onChange={(v) => updateStatus(row.id, v)}
        data={statusOptions}
        aria-label="Status"
      />
    ),
  },
  {
    accessorKey: 'name',
    cell: ({ row, value }) => (
      <VTCInput
        value={String(value ?? '')}
        onChange={(v) => updateName(row.id, v)}
        aria-label="Name"
      />
    ),
  },
  {
    accessorKey: 'selected',
    cell: ({ row }) => (
      <VTCCheckbox
        checked={selection.has(row.id)}
        onChange={(checked) => toggleSelection(row.id, checked)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: 'actions',
    cell: ({ row }) => (
      <VTCActions
        items={[
          { id: 'edit', label: 'Edit', onClick: () => onEdit(row) },
          { id: 'delete', label: 'Delete', onClick: () => onDelete(row) },
        ]}
        aria-label="Row actions"
      />
    ),
  },
]
```

When using interactive cells with `onRowClick`, wrap cell content or use `stopPropagation` in VTCActions so row click does not fire when using the control (VTCActions does this internally).
