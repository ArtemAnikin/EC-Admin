import { useTranslation } from 'react-i18next';
import { Button, Loader, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconCheck } from './icons';
import styles from './LoginCard.module.css';

export type LoginPhase = 'idle' | 'loading' | 'success';

interface LoginCardProps {
  phase: LoginPhase;
  onLogin: () => void;
}

function GoogleIcon() {
  return (
    <svg className={styles.googleIcon} viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function LoginCard({ phase, onLogin }: LoginCardProps) {
  const { t } = useTranslation();
  const isFlipped = phase !== 'idle';

  return (
    <div className={styles.cardContainer}>
      <div className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}>
        {/* Front face */}
        <div className={styles.face}>
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
              leftSection={<GoogleIcon />}
              onClick={onLogin}
              fullWidth
            >
              {t('login.continueWithGoogle')}
            </Button>
          </Stack>
        </div>

        {/* Back face */}
        <div className={`${styles.face} ${styles.back}`}>
          {phase === 'loading' && (
            <Stack align="center" gap="lg">
              <GoogleIcon />
              <Loader size="lg" />
              <Text c="dimmed">{t('login.loading')}</Text>
            </Stack>
          )}

          {phase === 'success' && (
            <Stack align="center" gap="lg">
              <ThemeIcon size={64} radius="xl" color="green" variant="light">
                <IconCheck />
              </ThemeIcon>
              <Text ta="center" fw={500} size="lg">
                {t('login.successMessage')}
              </Text>
            </Stack>
          )}
        </div>
      </div>
    </div>
  );
}
