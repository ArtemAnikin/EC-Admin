import type { FC } from 'react';
import { memo, useCallback } from 'react';
import { Select } from '@mantine/core';
import type { SelectProps } from '@mantine/core';
import type { VTCSelectOption } from '../types';

export interface IVTCSelectProps
  extends Omit<SelectProps, 'data' | 'value' | 'onChange'> {
  value: string | null;
  onChange: (value: string | null) => void;
  data: VTCSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  'aria-label'?: string;
}

const VTCSelectComponent: FC<IVTCSelectProps> = ({
  value,
  onChange,
  data,
  placeholder,
  disabled = false,
  'aria-label': ariaLabel,
  ...rest
}) => {
  const handleChange = useCallback(
    (v: string | null) => {
      onChange(v);
    },
    [onChange],
  );

  return (
    <div onClick={(e) => e.stopPropagation()} role="presentation">
      <Select
        size="xs"
        variant="filled"
        value={value}
        onChange={handleChange}
        data={data}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel}
        data-testid="vtc-select"
        {...rest}
      />
    </div>
  );
};

export const VTCSelect = memo(VTCSelectComponent);
