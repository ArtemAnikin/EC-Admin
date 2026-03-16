import { Container, Title, Text } from '@mantine/core';

export function DashboardScreen() {
  return (
    <Container size="lg" py="xl">
      <Title order={1} data-testid="dashboard-heading">Dashboard</Title>
      <Text c="dimmed" mt="md" data-testid="dashboard-welcome">
        Welcome to the Easy Cars Admin Panel.
      </Text>
    </Container>
  );
}
