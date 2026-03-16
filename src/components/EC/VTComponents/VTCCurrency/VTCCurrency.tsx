import type { FC } from 'react';
import { memo, useCallback, useState } from 'react';
import { TextInput } from '@mantine/core';

export interface IVTCCurrencyProps {
  currency: string;
  value: string;
  setValue: (value: string) => void;
  disabled?: boolean;
  'aria-label'?: string;
}

const VTCCurrencyComponent: FC<IVTCCurrencyProps> = ({
  currency,
  value,
  setValue,
  disabled = false,
  'aria-label': ariaLabel,
}) => {
  const [focused, setFocused] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    [setValue],
  );

  const handleFocus = useCallback(() => {
    setFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setFocused(false);
  }, []);

  return (
    <div onClick={(e) => e.stopPropagation()} role="presentation" data-testid="vtc-currency">
      <TextInput
        size="xs"
        variant="filled"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        aria-label={ariaLabel}
        leftSection={focused ? undefined : currency}
        data-testid="vtc-currency-input"
      />
    </div>
  );
};

export const VTCCurrency = memo(VTCCurrencyComponent);
