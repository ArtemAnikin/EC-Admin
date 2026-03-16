import type { FC } from 'react';
import { memo, useCallback } from 'react';
import { TextInput } from '@mantine/core';
import type { TextInputProps } from '@mantine/core';

export type VTCInputVariant = 'filled' | 'default' | 'unstyled';

export interface IVTCInputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'number';
  variant?: VTCInputVariant;
  placeholder?: string;
  disabled?: boolean;
  'aria-label'?: string;
}

const VTCInputComponent: FC<IVTCInputProps> = ({
  value,
  onChange,
  type = 'text',
  variant = 'filled',
  placeholder,
  disabled = false,
  'aria-label': ariaLabel,
  ...rest
}) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <div onClick={(e) => e.stopPropagation()} role="presentation">
      <TextInput
        size="xs"
        variant={variant}
        value={value}
        onChange={handleChange}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel}
        data-testid="vtc-input"
        {...rest}
      />
    </div>
  );
};

export const VTCInput = memo(VTCInputComponent);
