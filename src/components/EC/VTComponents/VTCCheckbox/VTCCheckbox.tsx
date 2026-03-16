import type { FC } from 'react';
import { memo, useCallback } from 'react';
import { Checkbox } from '@mantine/core';
import type { CheckboxProps } from '@mantine/core';

export interface IVTCCheckboxProps
  extends Omit<CheckboxProps, 'checked' | 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  'aria-label'?: string;
}

const VTCCheckboxComponent: FC<IVTCCheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
  indeterminate = false,
  'aria-label': ariaLabel,
  ...rest
}) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.checked);
    },
    [onChange],
  );

  return (
    <div onClick={(e) => e.stopPropagation()} role="presentation">
      <Checkbox
        size="sm"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        indeterminate={indeterminate}
        aria-label={ariaLabel}
        data-testid="vtc-checkbox"
        {...rest}
      />
    </div>
  );
};

export const VTCCheckbox = memo(VTCCheckboxComponent);
