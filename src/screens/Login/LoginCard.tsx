import type { CSSProperties, FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Loader,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconCheck, IconBrandGoogle } from './icons';

export type LoginPhase = 'idle' | 'loading' | 'success' | 'error';

export interface ILoginCard {
  phase: LoginPhase;
  onLogin: () => void;
  error?: string;
}

const faceStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  backfaceVisibility: 'hidden',
  borderRadius: 'var(--mantine-radius-lg)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  background: 'var(--mantine-color-white)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '48px 40px',
};

export const LoginCard: FC<ILoginCard> = ({ phase, onLogin, error }) => {
  const { t } = useTranslation();
  const isFlipped = phase !== 'idle';

  return (
    <Box style={{ perspective: 1200, width: 420, height: 460 }}>
      <Box
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : undefined,
        }}
      >
        {/* Front face */}
        <Box style={faceStyle}>
          <Stack align="center" gap="xl">
            <div>
              <Title order={1} ta="center">
                {t('login.title')}
              </Title>
              <Text c="dimmed" ta="center" mt="xs" size="lg">
                {t('login.subtitle')}
              </Text>
            </div>

            <Button
              size="lg"
              variant="default"
              leftSection={<IconBrandGoogle size={20} />}
              onClick={onLogin}
              fullWidth
            >
              {t('login.continueWithGoogle')}
            </Button>
          </Stack>
        </Box>

        {/* Back face */}
        <Box style={{ ...faceStyle, transform: 'rotateY(180deg)' }}>
          {phase === 'loading' && (
            <Stack align="center" gap="lg">
              <IconBrandGoogle size={24} />
              <Loader size="lg" />
              <Text c="dimmed">{t('login.loading')}</Text>
            </Stack>
          )}

          {phase === 'success' && (
            <Stack align="center" gap="lg">
              <ThemeIcon size={64} radius="xl" color="green" variant="light">
                <IconCheck size={32} />
              </ThemeIcon>
              <Text ta="center" fw={500} size="lg">
                {t('login.successMessage')}
              </Text>
            </Stack>
          )}

          {phase === 'error' && (
            <Stack align="center" gap="lg">
              <Text ta="center" c="red" fw={500} size="lg">
                {error ?? t('login.errorMessage')}
              </Text>
              <Button variant="light" onClick={onLogin}>
                {t('login.tryAgain')}
              </Button>
            </Stack>
          )}
        </Box>
      </Box>
    </Box>
  );
};
