import { Container, Title, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export function SettingsScreen() {
  const { t } = useTranslation();

  return (
    <Container size="lg" py="xl">
      <Title order={1}>{t('settings.title')}</Title>
      <Text c="dimmed" mt="md">
        {t('settings.description')}
      </Text>
    </Container>
  );
}
