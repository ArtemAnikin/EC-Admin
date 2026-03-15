import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Group, ActionIcon, Tooltip } from '@mantine/core';
import { ROUTES } from '../../routes';
import { LoginCard, type LoginPhase } from './LoginCard';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'sr', label: 'Srpski' },
] as const;

const LOADING_DURATION_MS = 2000;
const REDIRECT_DELAY_MS = 1500;

export function LoginScreen() {
  const [phase, setPhase] = useState<LoginPhase>('idle');
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  const handleGoogleLogin = useCallback(() => {
    if (phase !== 'idle') return;

    setPhase('loading');

    const loadingTimer = setTimeout(() => {
      setPhase('success');

      const redirectTimer = setTimeout(() => {
        navigate(ROUTES.DASHBOARD);
      }, REDIRECT_DELAY_MS);

      timersRef.current.push(redirectTimer);
    }, LOADING_DURATION_MS);

    timersRef.current.push(loadingTimer);
  }, [phase, navigate]);

  const handleLanguageChange = useCallback(
    (lng: string) => {
      i18n.changeLanguage(lng);
    },
    [i18n],
  );

  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      <Group gap="xs" style={{ position: 'absolute', top: 20, right: 20 }}>
        {LANGUAGES.map((lang) => (
          <Tooltip key={lang.code} label={lang.label}>
            <ActionIcon
              variant={i18n.language === lang.code ? 'filled' : 'default'}
              size="lg"
              onClick={() => handleLanguageChange(lang.code)}
              aria-label={lang.label}
            >
              {lang.code.toUpperCase()}
            </ActionIcon>
          </Tooltip>
        ))}
      </Group>

      <LoginCard phase={phase} onLogin={handleGoogleLogin} />
    </Box>
  );
}
