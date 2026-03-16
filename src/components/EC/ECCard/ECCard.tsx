import type { FC, ReactNode } from 'react';
import { Box, Divider, Paper, Title } from '@mantine/core';
import type { PaperProps } from '@mantine/core';

export interface IECCardProps extends Omit<PaperProps, 'title'> {
  /** Card header title */
  title: ReactNode;
  /** Main content area */
  children: ReactNode;
  /** Optional footer (e.g. actions, logo delete) */
  footer?: ReactNode;
}

const CARD_PADDING = 'md';
const HEADER_PADDING_BOTTOM = 'sm';

export const ECCard: FC<IECCardProps> = ({
  title,
  children,
  footer,
  className,
  ...rest
}) => {
  return (
    <Paper
      withBorder
      radius="md"
      p={0}
      bg="var(--mantine-color-default)"
      className={className}
      data-testid="ec-card"
      {...rest}
    >
      <Box px={CARD_PADDING} pt={CARD_PADDING} pb={HEADER_PADDING_BOTTOM}>
        <Title order={4} data-testid="ec-card-header">
          {title}
        </Title>
      </Box>
      <Divider />
      <Box px={CARD_PADDING} py={CARD_PADDING} data-testid="ec-card-content">
        {children}
      </Box>
      {footer != null ? (
        <>
          <Divider />
          <Box px={CARD_PADDING} py={CARD_PADDING} data-testid="ec-card-footer">
            {footer}
          </Box>
        </>
      ) : null}
    </Paper>
  );
};
