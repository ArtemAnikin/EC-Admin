import { Container, Title, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export function SettingsScreen() {
  const { t } = useTranslation();

  return (
    <Container size="lg" py="xl">
      <Title order={1} data-testid="settings-heading">{t('settings.title')}</Title>
      <Text c="dimmed" mt="md" data-testid="settings-description">
        {t('settings.description')}
      </Text>
    </Container>
  );
}
